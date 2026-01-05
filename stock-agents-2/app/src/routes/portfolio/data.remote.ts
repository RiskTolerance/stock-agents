import { query, command } from '$app/server';
import { z } from 'zod';
// import { alpaca } from '$lib/server/alpaca';

/**
 * Get Alpaca account information
 */
export const getAccount = query(async () => {
	// Placeholder - will integrate with Alpaca once set up
	// const account = await alpaca.getAccount();
	return {
		account: {
			id: 'placeholder',
			cash: '100000.00',
			portfolioValue: '100000.00',
			buyingPower: '200000.00',
			equity: '100000.00',
			lastEquity: '99500.00',
			daytradeCount: 0,
			patternDayTrader: false,
			status: 'ACTIVE'
		} as {
			id: string;
			cash: string;
			portfolioValue: string;
			buyingPower: string;
			equity: string;
			lastEquity: string;
			daytradeCount: number;
			patternDayTrader: boolean;
			status: string;
		}
	};
});

/**
 * Get all positions
 */
export const getPositions = query(async () => {
	// Placeholder - will integrate with Alpaca once set up
	// const positions = await alpaca.getPositions();
	return {
		positions: [] as Array<{
			symbol: string;
			qty: string;
			avgEntryPrice: string;
			marketValue: string;
			costBasis: string;
			unrealizedPL: string;
			unrealizedPLPC: string;
			currentPrice: string;
			side: string;
		}>
	};
});

/**
 * Get a single position by symbol
 */
export const getPosition = query(
	z.object({ symbol: z.string().min(1).max(10) }),
	async ({ symbol }) => {
		// Placeholder - will integrate with Alpaca once set up
		// const position = await alpaca.getPosition(symbol);
		return {
			position: null as {
				symbol: string;
				qty: string;
				avgEntryPrice: string;
				marketValue: string;
				costBasis: string;
				unrealizedPL: string;
				unrealizedPLPC: string;
				currentPrice: string;
				side: string;
			} | null
		};
	}
);

/**
 * Get recent orders
 */
export const getOrders = query(
	z.object({
		status: z.enum(['open', 'closed', 'all']).default('all'),
		limit: z.number().min(1).max(500).default(50)
	}).optional(),
	async (params) => {
		const { status = 'all', limit = 50 } = params ?? {};
		// Placeholder - will integrate with Alpaca once set up
		// const orders = await alpaca.getOrders({ status, limit });
		return {
			orders: [] as Array<{
				id: string;
				symbol: string;
				qty: string;
				side: string;
				type: string;
				status: string;
				filledQty: string;
				filledAvgPrice: string | null;
				submittedAt: string;
				filledAt: string | null;
			}>
		};
	}
);

/**
 * Submit a new order
 */
export const submitOrder = command(
	z.object({
		symbol: z.string().min(1).max(10),
		qty: z.number().positive(),
		side: z.enum(['buy', 'sell']),
		type: z.enum(['market', 'limit', 'stop', 'stop_limit']).default('market'),
		limitPrice: z.number().positive().optional(),
		stopPrice: z.number().positive().optional(),
		timeInForce: z.enum(['day', 'gtc', 'ioc', 'fok']).default('day')
	}),
	async ({ symbol, qty, side, type, limitPrice, stopPrice, timeInForce }) => {
		// Placeholder - will integrate with Alpaca once set up
		// const order = await alpaca.submitOrder({
		//   symbol,
		//   qty,
		//   side,
		//   type,
		//   limit_price: limitPrice,
		//   stop_price: stopPrice,
		//   time_in_force: timeInForce
		// });
		return {
			success: true,
			order: {
				id: 'placeholder-order-id',
				symbol,
				qty: qty.toString(),
				side,
				type,
				status: 'pending_new',
				submittedAt: new Date().toISOString()
			}
		};
	}
);

/**
 * Cancel an order
 */
export const cancelOrder = command(
	z.object({ orderId: z.string() }),
	async ({ orderId }) => {
		// Placeholder - will integrate with Alpaca once set up
		// await alpaca.cancelOrder(orderId);
		return { success: true, orderId };
	}
);

