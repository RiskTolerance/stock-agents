import { query, command } from '$app/server';
import { z } from 'zod';
import {
	getAccount as getAlpacaAccount,
	getPositions as getAlpacaPositions,
	getPosition as getAlpacaPosition,
	getOrders as getAlpacaOrders,
	submitOrder as submitAlpacaOrder,
	cancelOrder as cancelAlpacaOrder
} from '$lib/server/alpaca';

/**
 * Get Alpaca account information
 */
export const getAccount = query(async () => {
		try {
			const account = await getAlpacaAccount();
			
			// Alpaca returns numbers, convert to strings with 2 decimal places
			const formatCurrency = (value: string | number | undefined): string => {
				if (value === undefined || value === null) return '0.00';
				const num = typeof value === 'string' ? parseFloat(value) : value;
				return num.toFixed(2);
			};
			
			return {
				account: {
					id: account.id || '',
					cash: formatCurrency(account.cash),
					portfolioValue: formatCurrency(account.portfolio_value || account.equity),
					buyingPower: formatCurrency(account.buying_power),
					equity: formatCurrency(account.equity),
					lastEquity: formatCurrency(account.last_equity || account.equity),
					daytradeCount: account.daytrade_count || 0,
					patternDayTrader: account.pattern_day_trader || false,
					status: account.status || 'UNKNOWN'
				}
			};
		} catch (error) {
			console.error('Error fetching Alpaca account:', error);
			throw new Error(`Failed to fetch account: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
});

/**
 * Get all positions
 */
export const getPositions = query(async () => {
		try {
			const positions = await getAlpacaPositions();
			
			// Helper to format numeric values
			const formatValue = (value: string | number | undefined, decimals: number = 2): string => {
				if (value === undefined || value === null) return '0' + (decimals > 0 ? '.' + '0'.repeat(decimals) : '');
				const num = typeof value === 'string' ? parseFloat(value) : value;
				return num.toFixed(decimals);
			};
			
			return {
				positions: positions.map((pos) => ({
					symbol: pos.symbol || '',
					qty: formatValue(pos.qty, 0),
					avgEntryPrice: formatValue(pos.avg_entry_price),
					marketValue: formatValue(pos.market_value),
					costBasis: formatValue(pos.cost_basis),
					unrealizedPL: formatValue(pos.unrealized_pl),
					unrealizedPLPC: formatValue(pos.unrealized_plpc, 4), // Percentage with 4 decimals
					currentPrice: formatValue(pos.current_price),
					side: pos.side || 'long'
				}))
			};
		} catch (error) {
			console.error('Error fetching Alpaca positions:', error);
			throw new Error(`Failed to fetch positions: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
});

/**
 * Get a single position by symbol
 */
export const getPosition = query(
	z.object({ symbol: z.string().min(1).max(10) }),
	async ({ symbol }) => {
		const position = await getAlpacaPosition(symbol.toUpperCase());
		
		if (!position) {
			return { position: null };
		}
		
		return {
			position: {
				symbol: position.symbol || '',
				qty: position.qty || '0',
				avgEntryPrice: position.avg_entry_price || '0.00',
				marketValue: position.market_value || '0.00',
				costBasis: position.cost_basis || '0.00',
				unrealizedPL: position.unrealized_pl || '0.00',
				unrealizedPLPC: position.unrealized_plpc || '0.00',
				currentPrice: position.current_price || '0.00',
				side: position.side || 'long'
			}
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
		try {
			const { status = 'all', limit = 50 } = params ?? {};
			const orders = await getAlpacaOrders(status);
			
			// Sort by submitted_at descending and limit
			const sortedOrders = orders
				.sort((a, b) => {
					const aTime = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
					const bTime = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
					return bTime - aTime;
				})
				.slice(0, limit);
			
			// Helper to format values
			const formatValue = (value: string | number | undefined, decimals: number = 2): string => {
				if (value === undefined || value === null) return '0' + (decimals > 0 ? '.' + '0'.repeat(decimals) : '');
				const num = typeof value === 'string' ? parseFloat(value) : value;
				return num.toFixed(decimals);
			};
			
			return {
				orders: sortedOrders.map((order) => ({
					id: order.id || '',
					symbol: order.symbol || '',
					qty: formatValue(order.qty, 0),
					side: order.side || '',
					type: order.type || '',
					status: order.status || '',
					filledQty: formatValue(order.filled_qty, 0),
					filledAvgPrice: order.filled_avg_price ? formatValue(order.filled_avg_price) : null,
					submittedAt: order.submitted_at || new Date().toISOString(),
					filledAt: order.filled_at || null
				}))
			};
		} catch (error) {
			console.error('Error fetching Alpaca orders:', error);
			throw new Error(`Failed to fetch orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
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
		try {
			const orderParams: any = {
				symbol: symbol.toUpperCase(),
				qty,
				side,
				type,
				time_in_force: timeInForce
			};
			
			if (limitPrice) {
				orderParams.limit_price = limitPrice;
			}
			
			if (stopPrice) {
				orderParams.stop_price = stopPrice;
			}
			
			const order = await submitAlpacaOrder(orderParams);
			
			return {
				success: true,
				order: {
					id: order.id || '',
					symbol: order.symbol || symbol.toUpperCase(),
					qty: order.qty || qty.toString(),
					side: order.side || side,
					type: order.type || type,
					status: order.status || 'new',
					submittedAt: order.submitted_at || new Date().toISOString()
				}
			};
		} catch (error) {
			console.error('Error submitting Alpaca order:', error);
			throw new Error(`Failed to submit order: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
);

/**
 * Cancel an order
 */
export const cancelOrder = command(
	z.object({ orderId: z.string() }),
	async ({ orderId }) => {
		try {
			await cancelAlpacaOrder(orderId);
			return { success: true, orderId };
		} catch (error) {
			console.error('Error canceling Alpaca order:', error);
			throw new Error(`Failed to cancel order: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
);

