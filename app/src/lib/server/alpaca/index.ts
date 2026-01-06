import Alpaca from '@alpacahq/alpaca-trade-api';
import { env } from '$env/dynamic/private';

if (!env.ALPACA_API_KEY) throw new Error('ALPACA_API_KEY is not set');
if (!env.ALPACA_API_SECRET) throw new Error('ALPACA_API_SECRET is not set');

export const alpaca = new Alpaca({
	keyId: env.ALPACA_API_KEY,
	secretKey: env.ALPACA_API_SECRET,
	paper: env.ALPACA_PAPER !== 'false' // Default to paper trading
});

// ============================================================================
// Account & Portfolio
// ============================================================================

export async function getAccount() {
	return alpaca.getAccount();
}

export async function getPositions() {
	return alpaca.getPositions();
}

export async function getPosition(symbol: string) {
	try {
		return await alpaca.getPosition(symbol);
	} catch {
		return null; // No position exists
	}
}

// ============================================================================
// Orders
// ============================================================================

export interface OrderParams {
	symbol: string;
	qty: number;
	side: 'buy' | 'sell';
	type: 'market' | 'limit' | 'stop' | 'stop_limit';
	time_in_force: 'day' | 'gtc' | 'ioc' | 'fok';
	limit_price?: number;
	stop_price?: number;
}

export async function submitOrder(params: OrderParams) {
	return alpaca.createOrder(params);
}

export async function getOrders(status: 'open' | 'closed' | 'all' = 'all') {
	// @ts-expect-error - Alpaca types are overly strict, status alone works
	return alpaca.getOrders({ status });
}

export async function getOrder(orderId: string) {
	return alpaca.getOrder(orderId);
}

export async function cancelOrder(orderId: string) {
	return alpaca.cancelOrder(orderId);
}

export async function cancelAllOrders() {
	return alpaca.cancelAllOrders();
}

// ============================================================================
// Market Data
// ============================================================================

export async function getLatestQuote(symbol: string) {
	const quotes = await alpaca.getLatestQuotes([symbol]);
	return quotes.get(symbol);
}

export async function getLatestTrade(symbol: string) {
	const trades = await alpaca.getLatestTrades([symbol]);
	return trades.get(symbol);
}

// ============================================================================
// Helpers
// ============================================================================

export async function calculateOrderQty(
	symbol: string,
	allocation: number // e.g., 0.05 = 5% of portfolio
): Promise<number> {
	const [account, quote] = await Promise.all([getAccount(), getLatestQuote(symbol)]);

	const buyingPower = parseFloat(account.buying_power);
	const targetValue = buyingPower * allocation;
	// @ts-expect-error - quote.ap is the ask price (types may be incomplete)
	const price = quote?.ap ?? quote?.AskPrice ?? 0;

	if (price <= 0) {
		throw new Error(`Unable to get price for ${symbol}`);
	}

	return Math.floor(targetValue / price);
}

