import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import {
	getAccount as getAlpacaAccount,
	getPosition as getAlpacaPosition,
	getLatestQuote,
	submitOrder as submitAlpacaOrder,
	type OrderParams
} from '../../alpaca/index.js';
import { db } from '../../db/index.js';
import { orders } from '../../db/schema.js';

// ============================================================================
// Schema Definitions
// ============================================================================

const tradeInputSchema = z.object({
	symbol: z.string().min(1).max(10),
	qty: z.number().positive(),
	side: z.enum(['buy', 'sell']),
	type: z.enum(['market', 'limit', 'stop', 'stop_limit']).default('market'),
	limitPrice: z.number().positive().nullable().optional(),
	stopPrice: z.number().positive().nullable().optional(),
	timeInForce: z.enum(['day', 'gtc', 'ioc', 'fok']).default('day'),
	reportId: z.string().uuid().nullable().optional() // Optional link to analysis report
}).passthrough();

const tradeContextSchema = z.object({
	symbol: z.string(),
	qty: z.number(),
	side: z.string(),
	type: z.string(),
	timeInForce: z.string(),
	accountCash: z.string(),
	buyingPower: z.string(),
	currentPrice: z.number().optional(),
	hasPosition: z.boolean(),
	positionQty: z.number().optional(),
	validated: z.boolean()
});

// ============================================================================
// Step 1: Validate Trade
// ============================================================================

const validateTradeStep = createStep({
	id: 'validate-trade',
	inputSchema: tradeInputSchema,
	outputSchema: z.object({
		context: tradeContextSchema,
		validationErrors: z.array(z.string()),
		originalInput: tradeInputSchema
	}),
	execute: async ({ inputData }) => {
		const { symbol, qty, side, type, limitPrice, stopPrice } = inputData;
		const symbolUpper = symbol.toUpperCase();
		const validationErrors: string[] = [];
		
		console.log(`[ExecuteTradeWorkflow] Validating ${side} order for ${qty} shares of ${symbolUpper}`);

		// Fetch account and position data in parallel
		const [account, position, quote] = await Promise.all([
			getAlpacaAccount(),
			getAlpacaPosition(symbolUpper),
			getLatestQuote(symbolUpper).catch(() => null)
		]);

		const accountCash = parseFloat(account.cash as string);
		const buyingPower = parseFloat(account.buying_power as string);
		const currentPrice = quote
			? parseFloat((quote as any).ap || (quote as any).AskPrice || '0')
			: undefined;

		// Validation checks
		if (side === 'buy') {
			// Check buying power (only if we have a current price)
			// If market is closed, we can't estimate cost, so skip this check
			if (currentPrice) {
				const estimatedCost = currentPrice * qty;
				if (estimatedCost > buyingPower) {
					validationErrors.push(
						`Insufficient buying power. Estimated cost: $${estimatedCost.toFixed(2)}, available: $${buyingPower.toFixed(2)}`
					);
				}
			}

			// Check account status
			if (account.status !== 'ACTIVE') {
				validationErrors.push(`Account status is ${account.status}, must be ACTIVE to trade`);
			}
		} else if (side === 'sell') {
			// Check if position exists
			if (!position) {
				validationErrors.push(`No position found for ${symbolUpper}. Cannot sell shares you don't own.`);
			} else {
				const positionQty = parseFloat(position.qty as string);
				if (qty > positionQty) {
					validationErrors.push(
						`Cannot sell ${qty} shares. Only ${positionQty} shares available in position.`
					);
				}
			}
		}

		// Validate order type requirements
		if (type === 'limit' && !limitPrice) {
			validationErrors.push('Limit price is required for limit orders');
		}

		if (type === 'stop' && !stopPrice) {
			validationErrors.push('Stop price is required for stop orders');
		}

		if (type === 'stop_limit' && (!limitPrice || !stopPrice)) {
			validationErrors.push('Both limit price and stop price are required for stop-limit orders');
		}

		// Check if we have a valid price for market orders
		// Note: Market may be closed, so we'll allow market orders even without a quote
		// Alpaca will handle the execution when market opens
		if (type === 'market' && !currentPrice) {
			console.warn(`Unable to get current price for ${symbolUpper}. Proceeding with market order (market may be closed).`);
		}

		const context: z.infer<typeof tradeContextSchema> = {
			symbol: symbolUpper,
			qty,
			side,
			type,
			timeInForce: inputData.timeInForce,
			accountCash: accountCash.toFixed(2),
			buyingPower: buyingPower.toFixed(2),
			currentPrice,
			hasPosition: !!position,
			positionQty: position ? parseFloat(position.qty as string) : undefined,
			validated: validationErrors.length === 0
		};

		return {
			context,
			validationErrors,
			originalInput: inputData
		};
	}
});

// ============================================================================
// Step 2: Execute Trade
// ============================================================================

const executeTradeStep = createStep({
	id: 'execute-trade',
	inputSchema: z.object({
		context: tradeContextSchema,
		validationErrors: z.array(z.string()),
		originalInput: tradeInputSchema
	}),
	outputSchema: z.object({
		order: z.object({
			id: z.string(),
			symbol: z.string(),
			qty: z.string(),
			side: z.string(),
			type: z.string(),
			status: z.string(),
			filledQty: z.string().optional(),
			filledAvgPrice: z.string().optional(),
			submittedAt: z.string()
		}),
		context: tradeContextSchema
	}),
	execute: async ({ inputData }) => {
		const { context, validationErrors, originalInput } = inputData;

		// If validation failed, throw error
		if (validationErrors.length > 0) {
			throw new Error(`Trade validation failed: ${validationErrors.join('; ')}`);
		}

		// Prepare order parameters
		const orderParams: OrderParams = {
			symbol: context.symbol,
			qty: context.qty,
			side: context.side as 'buy' | 'sell',
			type: context.type as 'market' | 'limit' | 'stop' | 'stop_limit',
			time_in_force: context.timeInForce as 'day' | 'gtc' | 'ioc' | 'fok'
		};

		if (originalInput.limitPrice) {
			orderParams.limit_price = originalInput.limitPrice;
		}

		if (originalInput.stopPrice) {
			orderParams.stop_price = originalInput.stopPrice;
		}

		// Submit order to Alpaca
		console.log(`[ExecuteTradeWorkflow] Submitting order to Alpaca:`, orderParams);
		const alpacaOrder = await submitAlpacaOrder(orderParams);
		console.log(`[ExecuteTradeWorkflow] Order submitted:`, alpacaOrder.id, alpacaOrder.status);

		// Format order response
		const order = {
			id: alpacaOrder.id || '',
			symbol: alpacaOrder.symbol || context.symbol,
			qty: alpacaOrder.qty || context.qty.toString(),
			side: alpacaOrder.side || context.side,
			type: alpacaOrder.type || context.type,
			status: alpacaOrder.status || 'new',
			filledQty: alpacaOrder.filled_qty || undefined,
			filledAvgPrice: alpacaOrder.filled_avg_price || undefined,
			submittedAt: alpacaOrder.submitted_at || new Date().toISOString()
		};

		return {
			order,
			context,
			originalInput
		};
	}
});

// ============================================================================
// Step 3: Save Order to Database
// ============================================================================

const saveOrderStep = createStep({
	id: 'save-order',
	inputSchema: z.object({
		order: z.object({
			id: z.string(),
			symbol: z.string(),
			qty: z.string(),
			side: z.string(),
			type: z.string(),
			status: z.string(),
			filledQty: z.string().optional(),
			filledAvgPrice: z.string().optional(),
			submittedAt: z.string()
		}),
		context: tradeContextSchema,
		originalInput: tradeInputSchema
	}),
	outputSchema: z.object({
		orderId: z.string(),
		alpacaOrderId: z.string(),
		symbol: z.string(),
		side: z.string(),
		status: z.string()
	}),
	execute: async ({ inputData }) => {
		const { order, originalInput } = inputData;

		// Save order to database
		const [savedOrder] = await db
			.insert(orders)
			.values({
				alpacaOrderId: order.id,
				symbol: order.symbol,
				side: order.side.toLowerCase(),
				qty: order.qty,
				type: order.type.toLowerCase(),
				status: order.status.toLowerCase(),
				filledQty: order.filledQty || null,
				filledAvgPrice: order.filledAvgPrice || null,
				reportId: originalInput.reportId || null
				// userId: null, // TODO: Add authentication
			})
			.returning();

		return {
			orderId: savedOrder.id,
			alpacaOrderId: savedOrder.alpacaOrderId || order.id,
			symbol: savedOrder.symbol,
			side: savedOrder.side,
			status: savedOrder.status,
			qty: order.qty // Pass qty through for final message
		};
	}
});

// ============================================================================
// Main Workflow
// ============================================================================

export const executeTradeWorkflow = createWorkflow({
	id: 'execute-trade',
	inputSchema: tradeInputSchema,
	outputSchema: z.object({
		success: z.boolean(),
		orderId: z.string(),
		alpacaOrderId: z.string(),
		symbol: z.string(),
		side: z.string(),
		status: z.string(),
		message: z.string()
	})
})
	.then(validateTradeStep)
	.then(executeTradeStep)
	.then(saveOrderStep)
	.then(
		createStep({
			id: 'format-result',
			inputSchema: z.object({
				orderId: z.string(),
				alpacaOrderId: z.string(),
				symbol: z.string(),
				side: z.string(),
				status: z.string(),
				qty: z.string()
			}),
			outputSchema: z.object({
				success: z.boolean(),
				orderId: z.string(),
				alpacaOrderId: z.string(),
				symbol: z.string(),
				side: z.string(),
				status: z.string(),
				message: z.string()
			}),
			execute: async ({ inputData }) => {
				return {
					success: true,
					orderId: inputData.orderId,
					alpacaOrderId: inputData.alpacaOrderId,
					symbol: inputData.symbol,
					side: inputData.side,
					status: inputData.status,
					message: `${inputData.side.toUpperCase()} order for ${inputData.qty} shares of ${inputData.symbol} submitted successfully`
				};
			}
		})
	)
	.commit();

