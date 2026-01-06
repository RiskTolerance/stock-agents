import { createTool } from '@mastra/core/tools';
import { createFmpApi } from '../../../../../packages/fmp-api/src/index.js';
import { z } from 'zod';
import { env } from '$env/dynamic/private';
import {
	reduceIncomeStatement,
	reduceBalanceSheet,
	reduceCashFlow,
	reduceFinancialRatios,
	reduceKeyMetrics,
	reduceGrowthData,
	reduceAnalystEstimates,
	reduceAnalystRatings,
	reducePriceTargets,
	reduceCompanyProfile,
	reduceQuote,
	reduceNews,
	reduceInsiderTrading,
	reduceTechnicalIndicators,
	reduceFinancialScores
} from '../utils/data-reduction.js';

// ============================================================================
// FMP API Client
// ============================================================================

let fmpApiInstance: ReturnType<typeof createFmpApi> | null = null;

export function getFmpApi() {
	if (!env.FMP_API_KEY) throw new Error('FMP_API_KEY is not set');
	if (!fmpApiInstance) {
		fmpApiInstance = createFmpApi(env.FMP_API_KEY);
	}
	return fmpApiInstance;
}

// ============================================================================
// Date Helpers
// ============================================================================

function getToday(): Date {
	return new Date();
}

function getDateDaysAgo(days: number): Date {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date;
}

// ============================================================================
// Analyst Data Tool
// ============================================================================

export const analystDataTool = createTool({
	id: 'fetch-analyst-data',
	description: 'Fetch analyst ratings, price targets, and estimates for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol (e.g., AAPL)')
	}),
	outputSchema: z.object({
		estimates: z.any(),
		ratings: z.any(),
		priceTarget: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const symbol = context.symbol;

		// Fetch with minimal limits
		const [financialEstimates, ratingSnapshot, analystPriceTargetConsensus] = await Promise.all([
			fmpApi.Analyst.financialEstimates(symbol, { page: 0, limit: 3 }),
			fmpApi.Analyst.ratingSnapshot(symbol),
			fmpApi.Analyst.analystPriceTargetConsensus(symbol)
		]);

		// Apply data reduction to minimize tokens
		return {
			estimates: reduceAnalystEstimates(financialEstimates),
			ratings: reduceAnalystRatings(ratingSnapshot ? [ratingSnapshot] : []),
			priceTarget: reducePriceTargets(analystPriceTargetConsensus)
		};
	}
});

// ============================================================================
// Company Data Tool
// ============================================================================

export const companyDataTool = createTool({
	id: 'fetch-company-data',
	description: 'Fetch company profile, market cap, and quote information',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		profile: z.any(),
		quote: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const symbol = context.symbol;

		const [profile, quote] = await Promise.all([
			fmpApi.Company.profile(symbol),
			fmpApi.Technical.quote(symbol)
		]);

		// Apply data reduction to minimize tokens
		return {
			profile: reduceCompanyProfile(profile),
			quote: reduceQuote(quote)
		};
	}
});

// ============================================================================
// Financial Statements Tool
// ============================================================================

// ============================================================================
// Individual Statement Tools
// ============================================================================

export const incomeStatementTool = createTool({
	id: 'fetch-income-statement',
	description:
		'Fetch income statement data for a stock symbol (limited to 2 most recent periods to reduce token usage)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z
			.number()
			.default(2)
			.describe('Number of periods to fetch (default 2 to reduce token usage)')
	}),
	outputSchema: z.object({
		incomeStatement: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period } = context;
		// Always fetch only 2 periods and reduce data
		const incomeStatement = await fmpApi.Statements.incomeStatement(symbol, { period, limit: 2 });
		return { incomeStatement: reduceIncomeStatement(incomeStatement) };
	}
});

export const balanceSheetTool = createTool({
	id: 'fetch-balance-sheet',
	description:
		'Fetch balance sheet data for a stock symbol (limited to 2 most recent periods to reduce token usage)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z
			.number()
			.default(2)
			.describe('Number of periods to fetch (default 2 to reduce token usage)')
	}),
	outputSchema: z.object({
		balanceSheet: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period } = context;
		// Always fetch only 2 periods and reduce data
		const balanceSheet = await fmpApi.Statements.balanceSheet(symbol, { period, limit: 2 });
		return { balanceSheet: reduceBalanceSheet(balanceSheet) };
	}
});

export const cashFlowTool = createTool({
	id: 'fetch-cash-flow',
	description:
		'Fetch cash flow statement data for a stock symbol (limited to 2 most recent periods to reduce token usage)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z
			.number()
			.default(2)
			.describe('Number of periods to fetch (default 2 to reduce token usage)')
	}),
	outputSchema: z.object({
		cashFlow: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period } = context;
		// Always fetch only 2 periods and reduce data
		const cashFlow = await fmpApi.Statements.cashFlowStatement(symbol, { period, limit: 2 });
		return { cashFlow: reduceCashFlow(cashFlow) };
	}
});

export const financialRatiosTool = createTool({
	id: 'fetch-financial-ratios',
	description: 'Fetch financial ratios for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		ratios: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol } = context;
		const ratios = await fmpApi.Statements.financialRatios(symbol);
		return { ratios: reduceFinancialRatios(ratios) };
	}
});

export const keyMetricsTool = createTool({
	id: 'fetch-key-metrics',
	description:
		'Fetch key metrics for a stock symbol (limited to 2 most recent periods to reduce token usage)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		limit: z
			.number()
			.default(2)
			.describe('Number of periods to fetch (default 2 to reduce token usage)')
	}),
	outputSchema: z.object({
		keyMetrics: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol } = context;
		// Always fetch only 2 periods and reduce data
		const keyMetrics = await fmpApi.Statements.keyMetrics(symbol, { period: 'annual', limit: 2 });
		return { keyMetrics: reduceKeyMetrics(keyMetrics) };
	}
});

export const otherStatementTool = createTool({
	id: 'fetch-other-statement',
	description: 'Fetch financial scores (Altman Z-score, Piotroski score) for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		financialScores: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol } = context;
		const financialScores = await fmpApi.Statements.financialScores(symbol);
		return { financialScores: reduceFinancialScores(financialScores) };
	}
});

export const incomeStatementGrowthTool = createTool({
	id: 'fetch-income-statement-growth',
	description:
		'Fetch income statement growth metrics for a stock symbol (limited to 2 most recent periods to reduce token usage)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z
			.number()
			.default(2)
			.describe('Number of periods to fetch (default 2 to reduce token usage)')
	}),
	outputSchema: z.object({
		incomeStatementGrowth: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period } = context;
		// Always fetch only 2 periods and reduce data
		const incomeStatementGrowth = await fmpApi.Statements.incomeStatementGrowth(symbol, 2, period);
		return { incomeStatementGrowth: reduceGrowthData(incomeStatementGrowth) };
	}
});

export const balanceSheetGrowthTool = createTool({
	id: 'fetch-balance-sheet-growth',
	description: 'Fetch balance sheet growth metrics for a stock symbol (reduced data)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period')
	}),
	outputSchema: z.object({
		balanceSheetGrowth: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period } = context;
		const balanceSheetGrowth = await fmpApi.Statements.balanceSheetGrowth(symbol, 2, period);
		return { balanceSheetGrowth: reduceGrowthData(balanceSheetGrowth) };
	}
});

export const cashFlowGrowthTool = createTool({
	id: 'fetch-cash-flow-growth',
	description: 'Fetch cash flow statement growth metrics for a stock symbol (reduced data)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period')
	}),
	outputSchema: z.object({
		cashFlowGrowth: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period } = context;
		const cashFlowGrowth = await fmpApi.Statements.cashFlowStatementGrowth(symbol, 2, period);
		return { cashFlowGrowth: reduceGrowthData(cashFlowGrowth) };
	}
});

// ============================================================================
// News Tool
// ============================================================================

export const newsDataTool = createTool({
	id: 'fetch-news-data',
	description: 'Fetch recent news headlines for a stock (reduced data)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		news: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol } = context;

		// Only fetch stock news with small limit
		const stockNews = await fmpApi.News.stockNews(symbol, { limit: 5 });

		// Apply data reduction
		return { news: reduceNews(stockNews) };
	}
});

// ============================================================================
// Insider Trading Tool
// ============================================================================

export const insiderDataTool = createTool({
	id: 'fetch-insider-data',
	description: 'Fetch insider trading activity for a stock (reduced data)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		insiderTrades: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const symbol = context.symbol;

		// Search insider trades for the last 90 days only (reduced from 180)
		const from = getDateDaysAgo(90);
		const to = getToday();

		const insiderTrades = await fmpApi.InsiderTrades.searchInsiderTrades(symbol, {
			from,
			to
		});

		// Apply data reduction
		return { insiderTrades: reduceInsiderTrading(insiderTrades) };
	}
});

// ============================================================================
// Technical Indicators Tool
// ============================================================================

export const technicalDataTool = createTool({
	id: 'fetch-technical-data',
	description: 'Fetch technical indicators including moving averages, RSI, and ADX (reduced data)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		quote: z.any(),
		sma50: z.any(),
		sma200: z.any(),
		ema20: z.any(),
		rsi14: z.any(),
		adx14: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const symbol = context.symbol;

		// Only get last 30 days for technical indicators (reduced from 365)
		const from = getDateDaysAgo(30);
		const to = getToday();
		const timeframe = '1day';

		const [quote, sma50, sma200, ema20, rsi14, adx14] = await Promise.all([
			fmpApi.Technical.quote(symbol),
			fmpApi.Technical.simpleMovingAverage(symbol, { periodLength: 50, timeframe, from, to }),
			fmpApi.Technical.simpleMovingAverage(symbol, { periodLength: 200, timeframe, from, to }),
			fmpApi.Technical.exponentialMovingAverage(symbol, { periodLength: 20, timeframe, from, to }),
			fmpApi.Technical.relativeStrengthIndex(symbol, { periodLength: 14, timeframe, from, to }),
			fmpApi.Technical.averageDirectionalIndex(symbol, { periodLength: 14, timeframe, from, to })
		]);

		// Apply data reduction - only keep most recent values
		return {
			quote: reduceQuote(quote),
			sma50: reduceTechnicalIndicators(sma50),
			sma200: reduceTechnicalIndicators(sma200),
			ema20: reduceTechnicalIndicators(ema20),
			rsi14: reduceTechnicalIndicators(rsi14),
			adx14: reduceTechnicalIndicators(adx14)
		};
	}
});

// ============================================================================
// Chart Data Tool
// ============================================================================

export const chartDataTool = createTool({
	id: 'fetch-chart-data',
	description: 'Fetch historical price data for charting',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		days: z.number().default(365).describe('Number of days of history')
	}),
	outputSchema: z.object({
		priceHistory: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, days } = context;

		const from = getDateDaysAgo(days);
		const to = getToday();

		const priceHistory = await fmpApi.Chart.full(symbol, { from, to });

		return { priceHistory };
	}
});

// ============================================================================
// Economic Data Tool
// ============================================================================

export const economicDataTool = createTool({
	id: 'fetch-economic-data',
	description: 'Fetch key economic indicators (reduced data)',
	inputSchema: z.object({
		indicators: z
			.array(z.enum(['GDP', 'CPI', 'unemploymentRate', 'federalFunds']))
			.default(['GDP', 'CPI', 'unemploymentRate'])
			.describe('Economic indicators to fetch')
	}),
	outputSchema: z.object({
		treasuryRates: z.any(),
		economicIndicators: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { indicators } = context;

		// Only get last 30 days (reduced from 365)
		const from = getDateDaysAgo(30);
		const to = getToday();

		// Fetch treasury rates
		const treasuryRates = await fmpApi.Economics.treasuryRates({ from, to });

		// Fetch each economic indicator (limit to most recent data point)
		const economicIndicatorResults = await Promise.all(
			indicators.map(async (indicator) => {
				const data = await fmpApi.Economics.economicIndicators(indicator, { from, to });
				// Only keep most recent value
				return { indicator, value: Array.isArray(data) && data[0] ? data[0] : data };
			})
		);

		const economicIndicators = Object.fromEntries(
			economicIndicatorResults.map(({ indicator, value }) => [indicator, value])
		);

		// Only return most recent treasury rate
		return {
			treasuryRates: Array.isArray(treasuryRates) ? treasuryRates.slice(0, 1) : treasuryRates,
			economicIndicators
		};
	}
});

// ============================================================================
// Market Performance Tool
// ============================================================================

export const marketPerformanceTool = createTool({
	id: 'fetch-market-performance',
	description: 'Fetch market performance summary (reduced data). Takes no parameters.',
	inputSchema: z.object({}).passthrough(),
	outputSchema: z.object({
		biggestGainers: z.any(),
		biggestLosers: z.any(),
		mostActive: z.any()
	}),
	execute: async () => {
		const fmpApi = getFmpApi();

		const [biggestGainers, biggestLosers, mostActive] = await Promise.all([
			fmpApi.MarketPerformance.biggestGainers(),
			fmpApi.MarketPerformance.biggestLosers(),
			fmpApi.MarketPerformance.mostActive()
		]);

		// Only keep top 3 of each and reduce fields
		const reduceMarketData = (data: unknown[]) =>
			(data || []).slice(0, 3).map((item) => {
				const i = item as Record<string, unknown>;
				return {
					symbol: i.symbol,
					price: i.price,
					change: i.changesPercentage
				};
			});

		return {
			biggestGainers: reduceMarketData(biggestGainers),
			biggestLosers: reduceMarketData(biggestLosers),
			mostActive: reduceMarketData(mostActive)
		};
	}
});

// ============================================================================
// Export all tools
// ============================================================================

export const fmpTools = {
	analystDataTool,
	companyDataTool,
	incomeStatementTool,
	balanceSheetTool,
	cashFlowTool,
	financialRatiosTool,
	keyMetricsTool,
	otherStatementTool,
	incomeStatementGrowthTool,
	balanceSheetGrowthTool,
	cashFlowGrowthTool,
	newsDataTool,
	insiderDataTool,
	technicalDataTool,
	chartDataTool,
	economicDataTool,
	marketPerformanceTool
};
