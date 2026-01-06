import { describe, it, expect } from 'vitest';
import { TechnicalAPI } from './technical-indicators.js';
import dayjs from 'dayjs';

const apiKey = process.env.FMP_API_KEY!;
const technicalApi = TechnicalAPI(apiKey);

// Skip all tests if FMP_API_KEY is not set
const runTests = process.env.FMP_API_KEY ? describe : describe.skip;

runTests(
	'Financial Modeling Prep - Technical Indicators API Integration Tests',
	() => {
		const TEST_SYMBOL = 'AAPL';
		const TEST_FROM = dayjs().subtract(60, 'days').toDate(); // Need enough data for longer period lengths
		const TEST_TO = dayjs().toDate();
		const TEST_PERIOD = 14; // Common period length for many indicators
		const TEST_TIMEFRAME = '1day';

		describe('Moving Averages', () => {
			const commonOptions = {
				periodLength: TEST_PERIOD,
				timeframe: TEST_TIMEFRAME,
				from: TEST_FROM,
				to: TEST_TO,
			};

			it('should fetch Simple Moving Average (SMA)', async () => {
				const result = await technicalApi.simpleMovingAverage(
					TEST_SYMBOL,
					commonOptions
				);

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);

				const dataPoint = result[0];
				validateMovingAverageBase(dataPoint);
				expect(typeof dataPoint.sma).toBe('number');
				expect(dataPoint.sma).toBeGreaterThan(0);
			});

			it('should fetch Exponential Moving Average (EMA)', async () => {
				const result = await technicalApi.exponentialMovingAverage(
					TEST_SYMBOL,
					commonOptions
				);

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);

				const dataPoint = result[0];
				validateMovingAverageBase(dataPoint);
				expect(typeof dataPoint.ema).toBe('number');
				expect(dataPoint.ema).toBeGreaterThan(0);
			});

			it('should fetch Weighted Moving Average (WMA)', async () => {
				const result = await technicalApi.weightedMovingAverage(
					TEST_SYMBOL,
					commonOptions
				);

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);

				const dataPoint = result[0];
				validateMovingAverageBase(dataPoint);
				expect(typeof dataPoint.wma).toBe('number');
				expect(dataPoint.wma).toBeGreaterThan(0);
			});

			it('should fetch Double Exponential Moving Average (DEMA)', async () => {
				const result = await technicalApi.doubleExponentialMovingAverage(
					TEST_SYMBOL,
					commonOptions
				);

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);

				const dataPoint = result[0];
				validateMovingAverageBase(dataPoint);
				expect(typeof dataPoint.dema).toBe('number');
				expect(dataPoint.dema).toBeGreaterThan(0);
			});

			it('should fetch Triple Exponential Moving Average (TEMA)', async () => {
				const result = await technicalApi.tripleExponentialMovingAverage(
					TEST_SYMBOL,
					commonOptions
				);

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);

				const dataPoint = result[0];
				validateMovingAverageBase(dataPoint);
				expect(typeof dataPoint.tema).toBe('number');
				expect(dataPoint.tema).toBeGreaterThan(0);
			});
		});

		describe('Momentum Indicators', () => {
			const commonOptions = {
				periodLength: TEST_PERIOD,
				timeframe: TEST_TIMEFRAME,
				from: TEST_FROM,
				to: TEST_TO,
			};

			it('should fetch Relative Strength Index (RSI)', async () => {
				const result = await technicalApi.relativeStrengthIndex(
					TEST_SYMBOL,
					commonOptions
				);

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);

				const dataPoint = result[0];
				validateMovingAverageBase(dataPoint);
				expect(typeof dataPoint.rsi).toBe('number');

				// RSI should be between 0 and 100
				expect(dataPoint.rsi).toBeGreaterThanOrEqual(0);
				expect(dataPoint.rsi).toBeLessThanOrEqual(100);
			});

			it('should fetch Williams %R', async () => {
				const result = await technicalApi.williamsR(TEST_SYMBOL, commonOptions);

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);

				const dataPoint = result[0];
				validateMovingAverageBase(dataPoint);
				expect(typeof dataPoint.williams).toBe('number');

				// Williams %R should be between -100 and 0
				expect(dataPoint.williams).toBeGreaterThanOrEqual(-100);
				expect(dataPoint.williams).toBeLessThanOrEqual(0);
			});
		});

		describe('Trend Indicators', () => {
			it('should fetch Average Directional Index (ADX)', async () => {
				const result = await technicalApi.averageDirectionalIndex(TEST_SYMBOL, {
					periodLength: TEST_PERIOD,
					timeframe: TEST_TIMEFRAME,
					from: TEST_FROM,
					to: TEST_TO,
				});

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);

				const dataPoint = result[0];
				validateMovingAverageBase(dataPoint);
				expect(typeof dataPoint.adx).toBe('number');

				// ADX should be between 0 and 100
				expect(dataPoint.adx).toBeGreaterThanOrEqual(0);
				expect(dataPoint.adx).toBeLessThanOrEqual(100);
			});
		});

		describe('Volatility Indicators', () => {
			it('should fetch Standard Deviation', async () => {
				const result = await technicalApi.standardDeviation(TEST_SYMBOL, {
					periodLength: TEST_PERIOD,
					timeframe: TEST_TIMEFRAME,
					from: TEST_FROM,
					to: TEST_TO,
				});

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);

				const dataPoint = result[0];
				validateMovingAverageBase(dataPoint);
				expect(typeof dataPoint.standardDeviation).toBe('number');
				expect(dataPoint.standardDeviation).toBeGreaterThan(0);
			});
		});

		describe('Quote', () => {
			it('should fetch current quote', async () => {
				const result = await technicalApi.quote(TEST_SYMBOL);

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBe(1);

				const quote = result[0];
				expect(quote.symbol).toBe(TEST_SYMBOL);
				expect(quote.name).toBeTruthy();
				expect(typeof quote.price).toBe('number');
				expect(typeof quote.changePercentage).toBe('number');
				expect(typeof quote.volume).toBe('number');
				expect(typeof quote.marketCap).toBe('number');

				// Price should be between day's high and low
				expect(quote.price).toBeLessThanOrEqual(quote.dayHigh);
				expect(quote.price).toBeGreaterThanOrEqual(quote.dayLow);

				// Year range should contain day range
				expect(quote.yearHigh).toBeGreaterThanOrEqual(quote.dayHigh);
				expect(quote.yearLow).toBeLessThanOrEqual(quote.dayLow);

				// Moving averages should be positive
				expect(quote.priceAvg50).toBeGreaterThan(0);
				expect(quote.priceAvg200).toBeGreaterThan(0);
			});
		});
	}
);

// Helper function to validate common fields in moving average responses
function validateMovingAverageBase(dataPoint: any) {
	expect(typeof dataPoint.open).toBe('number');
	expect(typeof dataPoint.high).toBe('number');
	expect(typeof dataPoint.low).toBe('number');
	expect(typeof dataPoint.close).toBe('number');
	expect(typeof dataPoint.volume).toBe('number');

	// Basic price relationships
	expect(dataPoint.high).toBeGreaterThanOrEqual(dataPoint.low);
	expect(dataPoint.open).toBeGreaterThanOrEqual(dataPoint.low);
	expect(dataPoint.open).toBeLessThanOrEqual(dataPoint.high);
	expect(dataPoint.close).toBeGreaterThanOrEqual(dataPoint.low);
	expect(dataPoint.close).toBeLessThanOrEqual(dataPoint.high);

	// Volume should be non-negative
	expect(dataPoint.volume).toBeGreaterThanOrEqual(0);
}
