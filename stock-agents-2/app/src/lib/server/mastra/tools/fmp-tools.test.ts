import { describe, it, expect, beforeAll } from 'vitest';
import { createFmpApi } from '../../../../../packages/fmp-api/src/index.js';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Test the FMP API directly (without Mastra tool wrapper)
// This validates that the fmp-api package works correctly with current API

const TEST_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'];

// We'll use the API key from environment
let fmpApi: ReturnType<typeof createFmpApi>;

beforeAll(() => {
	const apiKey = process.env.FMP_API_KEY;
	if (!apiKey) {
		throw new Error('FMP_API_KEY environment variable is required for tests. Add it to .env file.');
	}
	fmpApi = createFmpApi(apiKey);
});

// ============================================================================
// Validation Helpers
// ============================================================================

function validateArray(result: any, minLength: number = 0, description: string = 'result') {
	expect(Array.isArray(result), `${description} should be an array`).toBe(true);
	if (minLength > 0) {
		expect(result.length, `${description} should have at least ${minLength} items`).toBeGreaterThanOrEqual(minLength);
	}
	return result.length > 0;
}

function validateNumber(value: any, fieldName: string, allowZero: boolean = true) {
	expect(typeof value, `${fieldName} should be a number`).toBe('number');
	if (!allowZero) {
		expect(value, `${fieldName} should not be zero`).not.toBe(0);
	}
	expect(Number.isFinite(value), `${fieldName} should be a finite number`).toBe(true);
}

function validateString(value: any, fieldName: string, minLength: number = 1) {
	expect(typeof value, `${fieldName} should be a string`).toBe('string');
	expect(value.length, `${fieldName} should have length >= ${minLength}`).toBeGreaterThanOrEqual(minLength);
}

function validateDate(value: any, fieldName: string) {
	expect(value instanceof Date || typeof value === 'string', `${fieldName} should be a Date or string`).toBe(true);
	if (value instanceof Date) {
		expect(Number.isFinite(value.getTime()), `${fieldName} should be a valid date`).toBe(true);
	}
}

// ============================================================================
// Analyst API Tests
// ============================================================================

describe('Analyst API', () => {
	TEST_SYMBOLS.forEach((symbol) => {
		describe(`Symbol: ${symbol}`, () => {
			it('should fetch financial estimates with valid data', async () => {
				const result = await fmpApi.Analyst.financialEstimates(symbol, { page: 0, limit: 5 });

				if (validateArray(result, 0, 'financial estimates')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					validateString(item.symbol, 'symbol');
					if (item.revenueAvg !== null && item.revenueAvg !== undefined) {
						validateNumber(item.revenueAvg, 'revenueAvg', true);
					}
					if (item.epsAvg !== null && item.epsAvg !== undefined) {
						validateNumber(item.epsAvg, 'epsAvg', true);
					}
				}
			});

			it('should fetch rating snapshot with valid data', async () => {
				const result = await fmpApi.Analyst.ratingSnapshot(symbol);

				if (validateArray(result, 0, 'rating snapshot')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					validateString(item.rating, 'rating');
					validateNumber(item.overallScore, 'overallScore', true);
					expect(item.overallScore).toBeGreaterThanOrEqual(0);
					expect(item.overallScore).toBeLessThanOrEqual(100);
				}
			});

			it('should fetch historical ratings with valid data', async () => {
				const result = await fmpApi.Analyst.historicalRatings(symbol, 5);

				if (validateArray(result, 0, 'historical ratings')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					validateString(item.rating, 'rating');
					validateDate(item.date, 'date');
					validateNumber(item.overallScore, 'overallScore', true);
				}
			});

			it('should fetch analyst price target with valid data', async () => {
				const result = await fmpApi.Analyst.analystPriceTarget(symbol);

				if (validateArray(result, 0, 'analyst price target')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					if (item.lastMonthAvgPriceTarget !== null && item.lastMonthAvgPriceTarget !== undefined) {
						validateNumber(item.lastMonthAvgPriceTarget, 'lastMonthAvgPriceTarget', true);
						// Price target can be zero if no analysts provided targets
						if (item.lastMonthAvgPriceTarget > 0) {
							expect(item.lastMonthAvgPriceTarget).toBeGreaterThan(0);
						}
					}
				}
			});

			it('should fetch analyst price target consensus with valid data', async () => {
				const result = await fmpApi.Analyst.analystPriceTargetConsensus(symbol);

				if (validateArray(result, 0, 'price target consensus')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					if (item.targetConsensus !== null && item.targetConsensus !== undefined) {
						validateNumber(item.targetConsensus, 'targetConsensus', false);
						expect(item.targetConsensus).toBeGreaterThan(0);
					}
					if (item.targetHigh !== null && item.targetHigh !== undefined) {
						validateNumber(item.targetHigh, 'targetHigh', false);
						expect(item.targetHigh).toBeGreaterThan(0);
					}
					if (item.targetLow !== null && item.targetLow !== undefined) {
						validateNumber(item.targetLow, 'targetLow', false);
						expect(item.targetLow).toBeGreaterThan(0);
					}
					// High should be >= Low
					if (item.targetHigh && item.targetLow) {
						expect(item.targetHigh).toBeGreaterThanOrEqual(item.targetLow);
					}
				}
			});

			it('should fetch stock grades consensus with valid data', async () => {
				const result = await fmpApi.Analyst.stockGradesConsensus(symbol);

				if (validateArray(result, 0, 'stock grades consensus')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					validateString(item.consensus, 'consensus');
					expect(typeof item.strongBuy).toBe('number');
					expect(typeof item.buy).toBe('number');
					expect(typeof item.hold).toBe('number');
					expect(typeof item.sell).toBe('number');
					expect(typeof item.strongSell).toBe('number');
				}
			});
		});
	});
});

// ============================================================================
// Company API Tests
// ============================================================================

describe('Company API', () => {
	TEST_SYMBOLS.forEach((symbol) => {
		describe(`Symbol: ${symbol}`, () => {
			it('should fetch company profile with valid data', { timeout: 15000 }, async () => {
				const result = await fmpApi.Company.profile(symbol);

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);
				const item = result[0];
				expect(item).toHaveProperty('symbol', symbol);
				validateString(item.companyName, 'companyName');
				validateString(item.sector, 'sector');
				validateString(item.industry, 'industry');
				if (item.description) {
					validateString(item.description, 'description', 10);
				}
				validateNumber(item.price, 'price', false);
				expect(item.price).toBeGreaterThan(0);
				if (item.marketCap) {
					validateNumber(item.marketCap, 'marketCap', false);
					expect(item.marketCap).toBeGreaterThan(0);
				}
			});

			it('should fetch market cap with valid data', async () => {
				const result = await fmpApi.Company.marketCap(symbol);

				if (validateArray(result, 0, 'market cap')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					validateNumber(item.marketCap, 'marketCap', false);
					expect(item.marketCap).toBeGreaterThan(0);
					validateDate(item.date, 'date');
				}
			});
		});
	});
});

// ============================================================================
// Statements API Tests
// ============================================================================

describe('Statements API', () => {
	TEST_SYMBOLS.forEach((symbol) => {
		describe(`Symbol: ${symbol}`, () => {
			it('should fetch income statement with valid data', { timeout: 10000 }, async () => {
				const result = await fmpApi.Statements.incomeStatement(symbol, {
					period: 'annual',
					limit: 3
				});

				if (validateArray(result, 1, 'income statement')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					validateDate(item.date, 'date');
					validateNumber(item.revenue, 'revenue', true);
					validateNumber(item.netIncome, 'netIncome', true);
					if (item.eps !== null && item.eps !== undefined) {
						validateNumber(item.eps, 'eps', true);
					}
				}
			});

			it('should fetch balance sheet with valid data', { timeout: 10000 }, async () => {
				const result = await fmpApi.Statements.balanceSheet(symbol, {
					period: 'annual',
					limit: 3
				});

				if (validateArray(result, 1, 'balance sheet')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					validateDate(item.date, 'date');
					validateNumber(item.totalAssets, 'totalAssets', false);
					validateNumber(item.totalLiabilities, 'totalLiabilities', true);
					validateNumber(item.totalStockholdersEquity, 'totalStockholdersEquity', true);
					expect(item.totalAssets).toBeGreaterThan(0);
				}
			});

			it('should fetch cash flow statement with valid data', async () => {
				const result = await fmpApi.Statements.cashFlowStatement(symbol, {
					period: 'annual',
					limit: 3
				});

				if (validateArray(result, 1, 'cash flow statement')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					validateDate(item.date, 'date');
					if (item.operatingCashFlow !== null && item.operatingCashFlow !== undefined) {
						validateNumber(item.operatingCashFlow, 'operatingCashFlow', true);
					}
					if (item.freeCashFlow !== null && item.freeCashFlow !== undefined) {
						validateNumber(item.freeCashFlow, 'freeCashFlow', true);
					}
				}
			});

			it('should fetch financial ratios with valid data', async () => {
				const result = await fmpApi.Statements.financialRatios(symbol);

				if (validateArray(result, 0, 'financial ratios')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					if (item.currentRatio !== null && item.currentRatio !== undefined) {
						validateNumber(item.currentRatio, 'currentRatio', true);
						expect(item.currentRatio).toBeGreaterThan(0);
					}
					if (item.debtToEquityRatio !== null && item.debtToEquityRatio !== undefined) {
						validateNumber(item.debtToEquityRatio, 'debtToEquityRatio', true);
						expect(item.debtToEquityRatio).toBeGreaterThanOrEqual(0);
					}
					if (item.priceToEarningsRatio !== null && item.priceToEarningsRatio !== undefined) {
						validateNumber(item.priceToEarningsRatio, 'priceToEarningsRatio', true);
						expect(item.priceToEarningsRatio).toBeGreaterThan(0);
					}
				}
			});

			it('should fetch key metrics with valid data', async () => {
				const result = await fmpApi.Statements.keyMetrics(symbol, {
					period: 'annual',
					limit: 3
				});

				if (validateArray(result, 1, 'key metrics')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					validateDate(item.date, 'date');
					if (item.marketCap !== null && item.marketCap !== undefined) {
						validateNumber(item.marketCap, 'marketCap', false);
						expect(item.marketCap).toBeGreaterThan(0);
					}
					if (item.returnOnEquity !== null && item.returnOnEquity !== undefined) {
						validateNumber(item.returnOnEquity, 'returnOnEquity', true);
					}
				}
			});

			it('should fetch financial scores with valid data', async () => {
				const result = await fmpApi.Statements.financialScores(symbol);

				if (validateArray(result, 0, 'financial scores')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					if (item.altmanZScore !== null && item.altmanZScore !== undefined) {
						validateNumber(item.altmanZScore, 'altmanZScore', true);
					}
					if (item.piotroskiScore !== null && item.piotroskiScore !== undefined) {
						validateNumber(item.piotroskiScore, 'piotroskiScore', true);
						expect(item.piotroskiScore).toBeGreaterThanOrEqual(0);
						expect(item.piotroskiScore).toBeLessThanOrEqual(9);
					}
				}
			});
		});
	});
});

// ============================================================================
// News API Tests
// ============================================================================

describe('News API', () => {
	TEST_SYMBOLS.forEach((symbol) => {
		describe(`Symbol: ${symbol}`, () => {
			it('should fetch stock news with valid data', async () => {
				const result = await fmpApi.News.stockNews(symbol, { limit: 10 });

				if (validateArray(result, 0, 'stock news')) {
					const item = result[0];
					// News may include related symbols, so just check it has a symbol
					expect(item).toHaveProperty('symbol');
					validateString(item.symbol, 'symbol');
					validateString(item.title, 'title', 5);
					validateString(item.url, 'url', 10);
					validateDate(item.publishedDate, 'publishedDate');
					if (item.text) {
						validateString(item.text, 'text', 10);
					}
				}
			});

			it('should fetch price target news with valid data', async () => {
				const result = await fmpApi.News.priceTargetNews(symbol, 10);

				if (validateArray(result, 0, 'price target news')) {
					const item = result[0];
					// News may include related symbols
					expect(item).toHaveProperty('symbol');
					validateString(item.symbol, 'symbol');
					validateString(item.newsTitle, 'newsTitle', 5);
					if (item.priceTarget !== null && item.priceTarget !== undefined) {
						validateNumber(item.priceTarget, 'priceTarget', false);
						expect(item.priceTarget).toBeGreaterThan(0);
					}
				}
			});
		});
	});
});

// ============================================================================
// Technical API Tests
// ============================================================================

describe('Technical API', () => {
	const from = new Date();
	from.setDate(from.getDate() - 90); // Last 90 days
	const to = new Date();

	TEST_SYMBOLS.forEach((symbol) => {
		describe(`Symbol: ${symbol}`, () => {
			it('should fetch quote with valid data', { timeout: 10000 }, async () => {
				const result = await fmpApi.Technical.quote(symbol);

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);
				const item = result[0];
				expect(item).toHaveProperty('symbol', symbol);
				validateNumber(item.price, 'price', false);
				expect(item.price).toBeGreaterThan(0);
				validateNumber(item.volume, 'volume', true);
				expect(item.volume).toBeGreaterThanOrEqual(0);
				if (item.marketCap) {
					validateNumber(item.marketCap, 'marketCap', false);
					expect(item.marketCap).toBeGreaterThan(0);
				}
			});

			it('should fetch SMA with valid data', async () => {
				const result = await fmpApi.Technical.simpleMovingAverage(symbol, {
					periodLength: 20,
					timeframe: '1day',
					from,
					to
				});

				if (validateArray(result, 0, 'SMA')) {
					const item = result[0];
					validateNumber(item.sma, 'sma', false);
					expect(item.sma).toBeGreaterThan(0);
					validateNumber(item.close, 'close', false);
					expect(item.close).toBeGreaterThan(0);
				}
			});

			it('should fetch RSI with valid data', async () => {
				const result = await fmpApi.Technical.relativeStrengthIndex(symbol, {
					periodLength: 14,
					timeframe: '1day',
					from,
					to
				});

				if (validateArray(result, 0, 'RSI')) {
					const item = result[0];
					validateNumber(item.rsi, 'rsi', true);
					expect(item.rsi).toBeGreaterThanOrEqual(0);
					expect(item.rsi).toBeLessThanOrEqual(100);
				}
			});
		});
	});
});

// ============================================================================
// Chart API Tests
// ============================================================================

describe('Chart API', () => {
	const from = new Date();
	from.setDate(from.getDate() - 30); // Last 30 days
	const to = new Date();

	TEST_SYMBOLS.forEach((symbol) => {
		describe(`Symbol: ${symbol}`, () => {
			it('should fetch full chart data with valid data', async () => {
				const result = await fmpApi.Chart.full(symbol, { from, to });

				if (validateArray(result, 1, 'chart data')) {
					const item = result[0];
					expect(item).toHaveProperty('symbol', symbol);
					validateDate(item.date, 'date');
					validateNumber(item.open, 'open', false);
					validateNumber(item.high, 'high', false);
					validateNumber(item.low, 'low', false);
					validateNumber(item.close, 'close', false);
					validateNumber(item.volume, 'volume', true);
					// High should be >= Low
					expect(item.high).toBeGreaterThanOrEqual(item.low);
					// Close should be between Low and High
					expect(item.close).toBeGreaterThanOrEqual(item.low);
					expect(item.close).toBeLessThanOrEqual(item.high);
				}
			});
		});
	});
});

// ============================================================================
// Market Performance API Tests (no symbol needed)
// ============================================================================

describe('Market Performance API', () => {
	it('should fetch biggest gainers with valid data', { timeout: 10000 }, async () => {
		const result = await fmpApi.MarketPerformance.biggestGainers();

		if (validateArray(result, 1, 'biggest gainers')) {
			const item = result[0];
			validateString(item.symbol, 'symbol');
			validateNumber(item.price, 'price', false);
			expect(item.price).toBeGreaterThan(0);
			validateNumber(item.changesPercentage, 'changesPercentage', true);
		}
	});

	it('should fetch biggest losers with valid data', { timeout: 10000 }, async () => {
		const result = await fmpApi.MarketPerformance.biggestLosers();

		if (validateArray(result, 1, 'biggest losers')) {
			const item = result[0];
			validateString(item.symbol, 'symbol');
			validateNumber(item.price, 'price', false);
			expect(item.price).toBeGreaterThan(0);
			validateNumber(item.changesPercentage, 'changesPercentage', true);
		}
	});

	it('should fetch most active with valid data', { timeout: 10000 }, async () => {
		const result = await fmpApi.MarketPerformance.mostActive();

		if (validateArray(result, 1, 'most active')) {
			const item = result[0];
			validateString(item.symbol, 'symbol');
			validateNumber(item.price, 'price', false);
			expect(item.price).toBeGreaterThan(0);
			validateNumber(item.changesPercentage, 'changesPercentage', true);
		}
	});
});
