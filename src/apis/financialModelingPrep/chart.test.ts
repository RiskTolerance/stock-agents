import { describe, it, expect } from 'vitest';
import { ChartAPI } from './chart';
import dayjs from 'dayjs';

// Skip all tests if FMP_API_KEY is not set
const runTests = process.env.FMP_API_KEY ? describe : describe.skip;

runTests('Financial Modeling Prep - Chart API Integration Tests', () => {
	const TEST_SYMBOL = 'AAPL';
	// Using fixed dates to ensure consistent tests
	const TEST_FROM = new Date('2024-01-01');
	const TEST_TO = new Date('2024-01-31');

	describe('Light Chart Data', () => {
		it('should fetch light chart data', async () => {
			const result = await ChartAPI.light(TEST_SYMBOL, {
				from: TEST_FROM,
				to: TEST_TO,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const dataPoint = result[0];
			expect(dataPoint).toHaveProperty('symbol', TEST_SYMBOL);
			expect(dataPoint).toHaveProperty('date');
			expect(dataPoint).toHaveProperty('price');
			expect(dataPoint).toHaveProperty('volume');
			expect(typeof dataPoint.price).toBe('number');
			expect(typeof dataPoint.volume).toBe('number');
		});

		it('should return empty array for invalid symbol', async () => {
			const result = await ChartAPI.light('INVALID_SYMBOL', {
				from: TEST_FROM,
				to: TEST_TO,
			});
			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(0);
		});
	});

	describe('Full Chart Data', () => {
		it('should fetch full chart data', async () => {
			const result = await ChartAPI.full(TEST_SYMBOL, {
				from: TEST_FROM,
				to: TEST_TO,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const dataPoint = result[0];
			expect(dataPoint).toHaveProperty('symbol', TEST_SYMBOL);
			expect(dataPoint).toHaveProperty('date');
			expect(dataPoint).toHaveProperty('open');
			expect(dataPoint).toHaveProperty('high');
			expect(dataPoint).toHaveProperty('low');
			expect(dataPoint).toHaveProperty('close');
			expect(dataPoint).toHaveProperty('volume');
			expect(dataPoint).toHaveProperty('change');
			expect(dataPoint).toHaveProperty('changePercent');
			expect(dataPoint).toHaveProperty('vwap');

			// Validate price relationships
			expect(dataPoint.high).toBeGreaterThanOrEqual(dataPoint.low);
			expect(dataPoint.high).toBeGreaterThanOrEqual(dataPoint.open);
			expect(dataPoint.high).toBeGreaterThanOrEqual(dataPoint.close);
			expect(dataPoint.open).toBeGreaterThanOrEqual(dataPoint.low);
			expect(dataPoint.close).toBeGreaterThanOrEqual(dataPoint.low);
		});
	});

	describe('Unadjusted Stock Price', () => {
		it('should fetch unadjusted stock prices', async () => {
			const result = await ChartAPI.unadjustedStockPrice(TEST_SYMBOL, {
				from: TEST_FROM,
				to: TEST_TO,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const dataPoint = result[0];
			expect(dataPoint).toHaveProperty('symbol', TEST_SYMBOL);
			expect(dataPoint).toHaveProperty('date');
			expect(dataPoint).toHaveProperty('adjOpen');
			expect(dataPoint).toHaveProperty('adjHigh');
			expect(dataPoint).toHaveProperty('adjLow');
			expect(dataPoint).toHaveProperty('adjClose');
			expect(dataPoint).toHaveProperty('volume');

			// Validate price relationships
			expect(dataPoint.adjHigh).toBeGreaterThanOrEqual(dataPoint.adjLow);
			expect(dataPoint.adjHigh).toBeGreaterThanOrEqual(dataPoint.adjOpen);
			expect(dataPoint.adjHigh).toBeGreaterThanOrEqual(dataPoint.adjClose);
		});
	});

	describe('Dividend Adjusted Stock Price', () => {
		it('should fetch dividend adjusted stock prices', async () => {
			const result = await ChartAPI.dividendAdjustedStockPrice(TEST_SYMBOL, {
				from: TEST_FROM,
				to: TEST_TO,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const dataPoint = result[0];
			expect(dataPoint).toHaveProperty('symbol', TEST_SYMBOL);
			expect(dataPoint).toHaveProperty('date');
			expect(dataPoint).toHaveProperty('adjOpen');
			expect(dataPoint).toHaveProperty('adjHigh');
			expect(dataPoint).toHaveProperty('adjLow');
			expect(dataPoint).toHaveProperty('adjClose');
			expect(dataPoint).toHaveProperty('volume');

			// Validate price relationships
			expect(dataPoint.adjHigh).toBeGreaterThanOrEqual(dataPoint.adjLow);
			expect(dataPoint.adjHigh).toBeGreaterThanOrEqual(dataPoint.adjOpen);
			expect(dataPoint.adjHigh).toBeGreaterThanOrEqual(dataPoint.adjClose);
		});
	});

	describe('Stock Price Intervals', () => {
		const intervals = ['5min', '15min', '30min', '1hour', '4hour'] as const;

		intervals.forEach((interval) => {
			it(`should fetch ${interval} interval data`, async () => {
				const result = await ChartAPI.stockPriceInterval(
					TEST_SYMBOL,
					interval,
					{
						from: TEST_FROM,
						to: TEST_TO,
					}
				);

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);

				const dataPoint = result[0];
				expect(dataPoint).toHaveProperty('date');
				expect(dataPoint).toHaveProperty('open');
				expect(dataPoint).toHaveProperty('high');
				expect(dataPoint).toHaveProperty('low');
				expect(dataPoint).toHaveProperty('close');
				expect(dataPoint).toHaveProperty('volume');

				// Validate price relationships
				expect(dataPoint.high).toBeGreaterThanOrEqual(dataPoint.low);
				expect(dataPoint.high).toBeGreaterThanOrEqual(dataPoint.open);
				expect(dataPoint.high).toBeGreaterThanOrEqual(dataPoint.close);
			});
		});

		it('should handle nonadjusted parameter', async () => {
			const result = await ChartAPI.stockPriceInterval(TEST_SYMBOL, '1hour', {
				from: TEST_FROM,
				to: TEST_TO,
				nonadjusted: true,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe('Date Range Validation', () => {
		it('should not return future data points', async () => {
			const futureFrom = new Date('2025-01-01');
			const futureTo = new Date('2025-12-31');
			const now = new Date();

			console.log('Future dates test:', {
				formattedFrom: dayjs(futureFrom).format('YYYY-MM-DD'),
				formattedTo: dayjs(futureTo).format('YYYY-MM-DD'),
				today: dayjs(now).format('YYYY-MM-DD'),
			});

			const result = await ChartAPI.light(TEST_SYMBOL, {
				from: futureFrom,
				to: futureTo,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0); // API returns recent data instead of empty array

			// Verify that no returned data points are in the future
			const futureDataPoints = result.filter((point) =>
				dayjs(point.date).isAfter(now)
			);
			expect(futureDataPoints).toHaveLength(0);

			if (result.length > 0) {
				console.log('Data returned for future date range:', {
					resultLength: result.length,
					firstDate: dayjs(result[0].date).format('YYYY-MM-DD'),
					lastDate: dayjs(result[result.length - 1].date).format('YYYY-MM-DD'),
				});
			}
		});

		it('should handle very old dates', async () => {
			const oldFrom = new Date('1900-01-01');
			const oldTo = new Date('1900-12-31');

			console.log('Old dates test:', {
				formattedFrom: dayjs(oldFrom).format('YYYY-MM-DD'),
				formattedTo: dayjs(oldTo).format('YYYY-MM-DD'),
			});

			const result = await ChartAPI.light(TEST_SYMBOL, {
				from: oldFrom,
				to: oldTo,
			});

			if (result.length > 0) {
				console.log('Unexpected data for old dates:', {
					resultLength: result.length,
					firstDate: dayjs(result[0].date).format('YYYY-MM-DD'),
					lastDate: dayjs(result[result.length - 1].date).format('YYYY-MM-DD'),
				});
			}

			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(0); // Expecting no data for very old dates
		});
	});
});
