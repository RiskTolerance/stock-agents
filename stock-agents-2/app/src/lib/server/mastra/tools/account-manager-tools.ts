import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { mastra } from '../index.js';
import {
	getAccount as getAlpacaAccount,
	getPositions as getAlpacaPositions,
	getPosition as getAlpacaPosition,
	getOrders as getAlpacaOrders,
	getLatestQuote
} from '../../alpaca/index.js';
import { db } from '../../db/index.js';
import { reports } from '../../db/schema.js';
import { desc, eq } from 'drizzle-orm';
import { retryOnRateLimit, analysisThrottle, isRateLimitError } from '../utils/rate-limit.js';
import { logActivity } from './activity-tools.js';

// ============================================================================
// Tool: Trigger Stock Analysis
// ============================================================================

export const triggerAnalysisTool = createTool({
	id: 'trigger-stock-analysis',
	description:
		'Trigger a comprehensive stock analysis workflow for a given symbol. Returns the analysis report with decision (BUY/SELL/HOLD) and full context.',
	inputSchema: z.object({
		symbol: z.string().min(1).max(10).describe('Stock symbol to analyze (e.g., AAPL)')
	}),
	outputSchema: z.object({
		success: z.boolean(),
		reportId: z.string().uuid().optional(),
		symbol: z.string(),
		decision: z.string(),
		timestamp: z.string()
	}),
	execute: async ({
		context
	}): Promise<{
		success: boolean;
		reportId?: string;
		symbol: string;
		decision: string;
		timestamp: string;
	}> => {
		const { symbol } = context;
		const symbolUpper = symbol.toUpperCase();

		// Check for recent analysis to prevent duplicates (within last hour)
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
		const recentAnalysis = await db
			.select()
			.from(reports)
			.where(eq(reports.symbol, symbolUpper))
			.orderBy(desc(reports.createdAt))
			.limit(1);

		if (
			recentAnalysis.length > 0 &&
			recentAnalysis[0].createdAt &&
			recentAnalysis[0].createdAt > oneHourAgo
		) {
			const timeSince = Math.round(
				(Date.now() - recentAnalysis[0].createdAt.getTime()) / 1000 / 60
			);
			throw new Error(
				`Symbol ${symbolUpper} was analyzed ${timeSince} minutes ago. Please wait at least 1 hour before re-analyzing the same symbol.`
			);
		}

		// Use throttle to prevent concurrent analyses and retry logic for rate limits
		return await analysisThrottle.execute(async () => {
			return await retryOnRateLimit(
				async () => {
					const workflow = mastra.getWorkflow('analyze-stock');
					if (!workflow) {
						throw new Error('analyze-stock workflow not found');
					}

					const run = await workflow.createRunAsync();
					const result = await run.start({
						inputData: { symbol: symbolUpper }
					});

					if (result.status !== 'success') {
						const error = result as { error?: { message?: string }; status: string };
						const errorMessage =
							error.error?.message || JSON.stringify(error.error || error.status);

						// Check if it's a rate limit error
						if (isRateLimitError(error.error)) {
							throw new Error(`Rate limit error: ${errorMessage}`);
						}

						throw new Error(`Analysis failed: ${errorMessage}`);
					}

					// Save report to database
					const [savedReport] = await db
						.insert(reports)
						.values({
							symbol: symbolUpper,
							decision: result.result.decision,
							layer1Data: result.result.context.layer1Data,
							layer2Reasoning: result.result.context.layer2Reasoning,
							layer3Rebuttals: result.result.context.layer3Rebuttals
						})
						.returning({ id: reports.id });

					const analysisResult = {
						success: true,
						reportId: savedReport.id,
						symbol: symbolUpper,
						decision: result.result.decision,
						timestamp: new Date().toISOString()
					};

					// Log activity
					await logActivity({
						activityType: 'analyze',
						symbol: symbolUpper,
						details: { decision: result.result.decision, reportId: savedReport.id }
					});

					return analysisResult;
				},
				{
					maxRetries: 3,
					initialDelayMs: 2000, // Start with 2 seconds
					maxDelayMs: 30000, // Max 30 seconds
					backoffMultiplier: 2
				}
			);
		});
	}
});

// ============================================================================
// Tool: Execute Trade
// ============================================================================

export const executeTradeTool = createTool({
	id: 'execute-trade',
	description: 'Execute a buy or sell order for a stock. Validates the trade before execution.',
	inputSchema: z
		.object({
			symbol: z.string().min(1).max(10),
			qty: z.number().positive(),
			side: z.enum(['buy', 'sell']),
			type: z.enum(['market', 'limit', 'stop', 'stop_limit']).default('market'),
			limitPrice: z.number().positive().nullable().optional(),
			stopPrice: z.number().positive().nullable().optional(),
			timeInForce: z.enum(['day', 'gtc', 'ioc', 'fok']).default('day'),
			reportId: z
				.string()
				.uuid()
				.nullable()
				.optional()
				.describe('Optional link to analysis report that triggered this trade')
		})
		.passthrough(),
	outputSchema: z.object({
		success: z.boolean(),
		orderId: z.string().uuid(),
		alpacaOrderId: z.string(),
		symbol: z.string(),
		side: z.string(),
		status: z.string(),
		message: z.string()
	}),
	execute: async ({
		context
	}): Promise<{
		success: boolean;
		orderId: string;
		alpacaOrderId: string;
		symbol: string;
		side: string;
		status: string;
		message: string;
	}> => {
		const workflow = mastra.getWorkflow('execute-trade');
		if (!workflow) {
			throw new Error('execute-trade workflow not found');
		}

		// Strip null values (convert to undefined) for workflow compatibility
		const cleanContext = {
			symbol: context.symbol,
			qty: context.qty,
			side: context.side,
			type: context.type,
			timeInForce: context.timeInForce,
			limitPrice: context.limitPrice ?? undefined,
			stopPrice: context.stopPrice ?? undefined,
			reportId: context.reportId ?? undefined
		};

		console.log(
			`[ExecuteTrade] Executing ${cleanContext.side} order for ${cleanContext.qty} shares of ${cleanContext.symbol}`
		);

		const run = await workflow.createRunAsync();
		const result = await run.start({
			inputData: cleanContext
		});

		if (result.status !== 'success') {
			const error = result as { error?: { message?: string }; status: string };
			const errorMessage = error.error?.message || JSON.stringify(error.error || error.status);
			throw new Error(`Trade execution failed: ${errorMessage}`);
		}

		const tradeResult = result.result;

		// Log activity
		await logActivity({
			activityType: 'trade',
			symbol: context.symbol.toUpperCase(),
			details: {
				side: context.side,
				qty: context.qty,
				type: context.type,
				orderId: tradeResult.orderId
			}
		});

		return tradeResult;
	}
});

// ============================================================================
// Tool: Get Portfolio Summary
// ============================================================================

export const getPortfolioSummaryTool = createTool({
	id: 'get-portfolio-summary',
	description:
		'Get a comprehensive summary of the trading account including cash, equity, buying power, positions, and recent orders. Takes no parameters.',
	inputSchema: z.object({}).passthrough(),
	outputSchema: z.object({
		account: z.object({
			cash: z.string(),
			equity: z.string(),
			buyingPower: z.string(),
			portfolioValue: z.string(),
			status: z.string()
		}),
		positions: z.array(
			z.object({
				symbol: z.string(),
				qty: z.string(),
				marketValue: z.string(),
				unrealizedPL: z.string(),
				unrealizedPLPC: z.string(),
				currentPrice: z.string()
			})
		),
		recentOrders: z.array(
			z.object({
				id: z.string(),
				symbol: z.string(),
				side: z.string(),
				qty: z.string(),
				status: z.string(),
				submittedAt: z.string()
			})
		)
	}),
	execute: async () => {
		const [account, positions, alpacaOrders] = await Promise.all([
			getAlpacaAccount(),
			getAlpacaPositions(),
			getAlpacaOrders('all')
		]);

		// Format currency values
		const formatCurrency = (value: string | number | undefined): string => {
			if (value === undefined || value === null) return '0.00';
			const num = typeof value === 'string' ? parseFloat(value) : value;
			return num.toFixed(2);
		};

		const formatValue = (value: string | number | undefined, decimals: number = 2): string => {
			if (value === undefined || value === null)
				return '0' + (decimals > 0 ? '.' + '0'.repeat(decimals) : '');
			const num = typeof value === 'string' ? parseFloat(value) : value;
			return num.toFixed(decimals);
		};

		// Get recent orders (last 10)
		const recentOrders = alpacaOrders
			.sort((a: { submitted_at?: string }, b: { submitted_at?: string }) => {
				const aTime = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
				const bTime = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
				return bTime - aTime;
			})
			.slice(0, 10)
			.map(
				(order: {
					id?: string;
					symbol?: string;
					side?: string;
					qty?: string | number;
					status?: string;
					submitted_at?: string;
				}) => ({
					id: order.id || '',
					symbol: order.symbol || '',
					side: order.side || '',
					qty: formatValue(order.qty, 0),
					status: order.status || '',
					submittedAt: order.submitted_at || new Date().toISOString()
				})
			);

		const portfolioSummary = {
			account: {
				cash: formatCurrency(account.cash),
				equity: formatCurrency(account.equity),
				buyingPower: formatCurrency(account.buying_power),
				portfolioValue: formatCurrency(account.portfolio_value || account.equity),
				status: account.status || 'UNKNOWN'
			},
			positions: positions.map(
				(pos: {
					symbol?: string;
					qty?: string | number;
					market_value?: string | number;
					unrealized_pl?: string | number;
					unrealized_plpc?: string | number;
					current_price?: string | number;
				}) => ({
					symbol: pos.symbol || '',
					qty: formatValue(pos.qty, 0),
					marketValue: formatValue(pos.market_value),
					unrealizedPL: formatValue(pos.unrealized_pl),
					unrealizedPLPC: formatValue(pos.unrealized_plpc, 4),
					currentPrice: formatValue(pos.current_price)
				})
			),
			recentOrders
		};

		// Log activity (monitoring)
		await logActivity({
			activityType: 'monitor',
			details: {
				cash: account.cash,
				equity: account.equity,
				positionsCount: positions.length
			}
		});

		return portfolioSummary;
	}
});

// ============================================================================
// Tool: Get Position Details
// ============================================================================

export const getPositionDetailsTool = createTool({
	id: 'get-position-details',
	description:
		'Get detailed information about a specific position including entry price, current price, P&L, and quantity.',
	inputSchema: z.object({
		symbol: z.string().min(1).max(10).describe('Stock symbol to get position details for')
	}),
	outputSchema: z.object({
		hasPosition: z.boolean(),
		position: z
			.object({
				symbol: z.string(),
				qty: z.string(),
				avgEntryPrice: z.string(),
				marketValue: z.string(),
				costBasis: z.string(),
				unrealizedPL: z.string(),
				unrealizedPLPC: z.string(),
				currentPrice: z.string()
			})
			.nullable()
	}),
	execute: async ({ context }) => {
		const { symbol } = context;
		const symbolUpper = symbol.toUpperCase();

		const position = await getAlpacaPosition(symbolUpper);

		if (!position) {
			return {
				hasPosition: false,
				position: null
			};
		}

		const formatValue = (value: string | number | undefined, decimals: number = 2): string => {
			if (value === undefined || value === null)
				return '0' + (decimals > 0 ? '.' + '0'.repeat(decimals) : '');
			const num = typeof value === 'string' ? parseFloat(value) : value;
			return num.toFixed(decimals);
		};

		return {
			hasPosition: true,
			position: {
				symbol: position.symbol || '',
				qty: formatValue(position.qty, 0),
				avgEntryPrice: formatValue(position.avg_entry_price),
				marketValue: formatValue(position.market_value),
				costBasis: formatValue(position.cost_basis),
				unrealizedPL: formatValue(position.unrealized_pl),
				unrealizedPLPC: formatValue(position.unrealized_plpc, 4),
				currentPrice: formatValue(position.current_price)
			}
		};
	}
});

// ============================================================================
// Tool: Get Analysis History
// ============================================================================

export const getAnalysisHistoryTool = createTool({
	id: 'get-analysis-history',
	description:
		'Get recent analysis reports for a symbol or all symbols. Useful for tracking analysis decisions over time. Call with empty object {} to get all recent analyses.',
	inputSchema: z.object({}).passthrough(), // Accept any object, including empty
	outputSchema: z.object({
		reports: z.array(
			z.object({
				id: z.string().uuid(),
				symbol: z.string(),
				decision: z.string(),
				createdAt: z.string()
			})
		)
	}),
	execute: async ({
		context
	}): Promise<{
		reports: Array<{
			id: string;
			symbol: string;
			decision: string;
			createdAt: string;
		}>;
	}> => {
		const contextObj = context as { symbol?: string; limit?: number };
		const symbol = contextObj?.symbol;
		const limit = contextObj?.limit || 10;

		const baseQuery = db
			.select({
				id: reports.id,
				symbol: reports.symbol,
				decision: reports.decision,
				createdAt: reports.createdAt
			})
			.from(reports);

		const userReports = symbol
			? await baseQuery
					.where(eq(reports.symbol, symbol.toUpperCase()))
					.orderBy(desc(reports.createdAt))
					.limit(limit)
			: await baseQuery.orderBy(desc(reports.createdAt)).limit(limit);

		return {
			reports: userReports.map((report) => ({
				id: report.id,
				symbol: report.symbol || '',
				decision: report.decision || 'HOLD',
				createdAt: report.createdAt?.toISOString() || new Date().toISOString()
			}))
		};
	}
});

// ============================================================================
// Tool: Get Current Price
// ============================================================================

export const getCurrentPriceTool = createTool({
	id: 'get-current-price',
	description: 'Get the current market price (quote) for a stock symbol.',
	inputSchema: z.object({
		symbol: z.string().min(1).max(10).describe('Stock symbol to get price for')
	}),
	outputSchema: z.object({
		symbol: z.string(),
		price: z.number().optional(),
		available: z.boolean(),
		message: z.string()
	}),
	execute: async ({ context }) => {
		const { symbol } = context;
		const symbolUpper = symbol.toUpperCase();

		try {
			const quote = await getLatestQuote(symbolUpper);
			// @ts-expect-error - quote types may be incomplete
			const price = quote?.ap || quote?.AskPrice || quote?.bp || quote?.BidPrice || undefined;

			if (price) {
				const numPrice = typeof price === 'string' ? parseFloat(price) : price;
				return {
					symbol: symbolUpper,
					price: numPrice,
					available: true,
					message: `Current price for ${symbolUpper}: $${numPrice.toFixed(2)}`
				};
			}

			return {
				symbol: symbolUpper,
				price: undefined,
				available: false,
				message: `Unable to get price for ${symbolUpper} (market may be closed)`
			};
		} catch (error) {
			return {
				symbol: symbolUpper,
				price: undefined,
				available: false,
				message: `Error fetching price for ${symbolUpper}: ${error instanceof Error ? error.message : 'Unknown error'}`
			};
		}
	}
});

// ============================================================================
// Tool: Calculate Position Size
// ============================================================================

export const calculatePositionSizeTool = createTool({
	id: 'calculate-position-size',
	description:
		'Calculate the appropriate position size (quantity) for a trade based on portfolio allocation percentage.',
	inputSchema: z.object({
		symbol: z.string().min(1).max(10),
		allocationPercent: z
			.number()
			.min(0)
			.max(100)
			.describe('Percentage of buying power to allocate (e.g., 5 for 5%)')
	}),
	outputSchema: z.object({
		symbol: z.string(),
		allocationPercent: z.number(),
		buyingPower: z.string(),
		targetValue: z.string(),
		estimatedPrice: z.number().optional(),
		recommendedQty: z.number().optional(),
		message: z.string()
	}),
	execute: async ({ context }) => {
		const { symbol, allocationPercent } = context;
		const symbolUpper = symbol.toUpperCase();

		const [account, quote] = await Promise.all([
			getAlpacaAccount(),
			getLatestQuote(symbolUpper).catch(() => null)
		]);

		const buyingPower = parseFloat(account.buying_power as string);
		const targetValue = buyingPower * (allocationPercent / 100);
		// @ts-expect-error - quote types may be incomplete
		const price = quote?.ap || quote?.AskPrice || undefined;

		if (!price) {
			return {
				symbol: symbolUpper,
				allocationPercent,
				buyingPower: buyingPower.toFixed(2),
				targetValue: targetValue.toFixed(2),
				estimatedPrice: undefined,
				recommendedQty: undefined,
				message: `Unable to get price for ${symbolUpper}. Cannot calculate position size.`
			};
		}

		const numPrice = typeof price === 'string' ? parseFloat(price) : price;
		const recommendedQty = Math.floor(targetValue / numPrice);

		return {
			symbol: symbolUpper,
			allocationPercent,
			buyingPower: buyingPower.toFixed(2),
			targetValue: targetValue.toFixed(2),
			estimatedPrice: numPrice,
			recommendedQty,
			message: `For ${allocationPercent}% allocation ($${targetValue.toFixed(2)}), buy ${recommendedQty} shares of ${symbolUpper} at ~$${numPrice.toFixed(2)}`
		};
	}
});

// ============================================================================
// Tool: Get Market Status
// ============================================================================

export const getMarketStatusTool = createTool({
	id: 'get-market-status',
	description:
		'Check if the stock market is currently open, and get time until market open/close. Market hours are 9:30 AM - 4:00 PM ET, Monday-Friday. Takes no parameters.',
	inputSchema: z.object({}).passthrough(),
	outputSchema: z.object({
		isOpen: z.boolean(),
		isMarketHours: z.boolean(), // True if within trading hours (9:30 AM - 4:00 PM ET)
		currentTime: z.string(),
		marketOpenTime: z.string(),
		marketCloseTime: z.string(),
		minutesUntilOpen: z.number().nullable(),
		minutesUntilClose: z.number().nullable(),
		dayOfWeek: z.string(),
		message: z.string()
	}),
	execute: async () => {
		const now = new Date();
		const etTime = new Date(
			now.toLocaleString('en-US', {
				timeZone: 'America/New_York'
			})
		);

		const dayOfWeek = etTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
		const hour = etTime.getHours();
		const minute = etTime.getMinutes();
		const currentMinutes = hour * 60 + minute;

		// Market hours: 9:30 AM (570 minutes) to 4:00 PM (960 minutes) ET
		const marketOpenMinutes = 9 * 60 + 30; // 570
		const marketCloseMinutes = 16 * 60; // 960

		const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday-Friday
		const isMarketHours =
			isWeekday && currentMinutes >= marketOpenMinutes && currentMinutes < marketCloseMinutes;

		// Calculate time until open/close
		let minutesUntilOpen: number | null = null;
		let minutesUntilClose: number | null = null;

		if (isWeekday) {
			if (currentMinutes < marketOpenMinutes) {
				// Before market open
				minutesUntilOpen = marketOpenMinutes - currentMinutes;
			} else if (currentMinutes >= marketOpenMinutes && currentMinutes < marketCloseMinutes) {
				// During market hours
				minutesUntilClose = marketCloseMinutes - currentMinutes;
			} else {
				// After market close
				minutesUntilOpen = 24 * 60 - currentMinutes + marketOpenMinutes; // Until next day's open
			}
		} else {
			// Weekend - calculate until next Monday's open
			const daysUntilMonday = dayOfWeek === 0 ? 1 : 7 - dayOfWeek + 1; // Sunday = 1 day, Saturday = 2 days
			minutesUntilOpen = daysUntilMonday * 24 * 60 - currentMinutes + marketOpenMinutes;
		}

		const marketOpenTime = `${String(Math.floor(marketOpenMinutes / 60)).padStart(2, '0')}:${String(marketOpenMinutes % 60).padStart(2, '0')} ET`;
		const marketCloseTime = `${String(Math.floor(marketCloseMinutes / 60)).padStart(2, '0')}:${String(marketCloseMinutes % 60).padStart(2, '0')} ET`;

		let message = '';
		if (isMarketHours) {
			message = `Market is OPEN. Closes in ${minutesUntilClose} minutes (${marketCloseTime}).`;
		} else if (isWeekday && currentMinutes < marketOpenMinutes) {
			message = `Market is CLOSED. Opens in ${minutesUntilOpen} minutes (${marketOpenTime}).`;
		} else if (isWeekday && currentMinutes >= marketCloseMinutes) {
			message = `Market is CLOSED. Opens tomorrow at ${marketOpenTime}.`;
		} else {
			message = `Market is CLOSED (weekend). Opens Monday at ${marketOpenTime}.`;
		}

		return {
			isOpen: isMarketHours,
			isMarketHours,
			currentTime: etTime.toISOString(),
			marketOpenTime,
			marketCloseTime,
			minutesUntilOpen,
			minutesUntilClose,
			dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
				dayOfWeek
			],
			message
		};
	}
});

// ============================================================================
// Export all tools
// ============================================================================

export const accountManagerTools = {
	triggerAnalysisTool,
	executeTradeTool,
	getPortfolioSummaryTool,
	getPositionDetailsTool,
	getAnalysisHistoryTool,
	getCurrentPriceTool,
	calculatePositionSizeTool,
	getMarketStatusTool
};
