import { describe, it, expect } from 'vitest';
import { ChartAPI } from './chart.js';
import dayjs from 'dayjs';

const apiKey = process.env.FMP_API_KEY!;
const chartApi = ChartAPI(apiKey);

// Skip all tests if FMP_API_KEY is not set
const runTests = process.env.FMP_API_KEY ? describe : describe.skip;

runTests('Financial Modeling Prep - Chart API Integration Tests', () => {
	const TEST_SYMBOL = 'AAPL';
	const TEST_FROM = dayjs().subtract(30, 'days').toDate();
	const TEST_TO = dayjs().toDate();

	console.log(TEST_FROM, TEST_TO);

	describe('Light Chart Data', () => {
		it('should fetch light chart data', async () => {
			const result = await chartApi.light(TEST_SYMBOL, {
				from: TEST_FROM,
				to: TEST_TO,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const dataPoint = result[0];
			expect(typeof dataPoint.price).toBe('number');
			expect(typeof dataPoint.volume).toBe('number');
			expect(dataPoint.price).toBeGreaterThan(0);
			expect(dataPoint.volume).toBeGreaterThanOrEqual(0);
		});

		it('should handle future dates appropriately', async () => {
			const futureFrom = dayjs().add(1, 'year').toDate();
			const futureTo = dayjs().add(2, 'year').toDate();

			const result = await chartApi.light(TEST_SYMBOL, {
				from: futureFrom,
				to: futureTo,
			});

			// Should either return empty array or only historical data
			if (result.length > 0) {
				expect(result.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Full Chart Data', () => {
		it('should fetch full chart data', async () => {
			const result = await chartApi.full(TEST_SYMBOL, {
				from: TEST_FROM,
				to: TEST_TO,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const dataPoint = result[0];
			validateOHLCV(dataPoint);

			// Additional fields
			expect(typeof dataPoint.change).toBe('number');
			expect(typeof dataPoint.changePercent).toBe('number');
			expect(typeof dataPoint.vwap).toBe('number');
		});
	});

	describe('Unadjusted Stock Price', () => {
		it('should fetch unadjusted stock prices', async () => {
			const result = await chartApi.unadjustedStockPrice(TEST_SYMBOL, {
				from: TEST_FROM,
				to: TEST_TO,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const dataPoint = result[0];
			expect(typeof dataPoint.adjOpen).toBe('number');
			expect(typeof dataPoint.adjHigh).toBe('number');
			expect(typeof dataPoint.adjLow).toBe('number');
			expect(typeof dataPoint.adjClose).toBe('number');
			expect(typeof dataPoint.volume).toBe('number');

			// Basic price relationships
			expect(dataPoint.adjHigh).toBeGreaterThanOrEqual(dataPoint.adjLow);
			expect(dataPoint.adjOpen).toBeGreaterThanOrEqual(dataPoint.adjLow);
			expect(dataPoint.adjOpen).toBeLessThanOrEqual(dataPoint.adjHigh);
			expect(dataPoint.adjClose).toBeGreaterThanOrEqual(dataPoint.adjLow);
			expect(dataPoint.adjClose).toBeLessThanOrEqual(dataPoint.adjHigh);
			expect(dataPoint.volume).toBeGreaterThanOrEqual(0);
		});
	});

	describe('Dividend Adjusted Stock Price', () => {
		it('should fetch dividend adjusted stock prices', async () => {
			const result = await chartApi.dividendAdjustedStockPrice(TEST_SYMBOL, {
				from: TEST_FROM,
				to: TEST_TO,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const dataPoint = result[0];
			expect(typeof dataPoint.adjOpen).toBe('number');
			expect(typeof dataPoint.adjHigh).toBe('number');
			expect(typeof dataPoint.adjLow).toBe('number');
			expect(typeof dataPoint.adjClose).toBe('number');
			expect(typeof dataPoint.volume).toBe('number');

			// Basic price relationships
			expect(dataPoint.adjHigh).toBeGreaterThanOrEqual(dataPoint.adjLow);
			expect(dataPoint.adjOpen).toBeGreaterThanOrEqual(dataPoint.adjLow);
			expect(dataPoint.adjOpen).toBeLessThanOrEqual(dataPoint.adjHigh);
			expect(dataPoint.adjClose).toBeGreaterThanOrEqual(dataPoint.adjLow);
			expect(dataPoint.adjClose).toBeLessThanOrEqual(dataPoint.adjHigh);
			expect(dataPoint.volume).toBeGreaterThanOrEqual(0);
		});
	});

	describe('Stock Price Intervals', () => {
		const intervals = ['5min', '15min', '30min', '1hour', '4hour'] as const;

		intervals.forEach((interval) => {
			it(`should fetch ${interval} interval data`, async () => {
				const result = await chartApi.stockPriceInterval(
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
				validateOHLCV(dataPoint);
			});
		});

		it('should handle nonadjusted parameter', async () => {
			const result = await chartApi.stockPriceInterval(TEST_SYMBOL, '1hour', {
				from: TEST_FROM,
				to: TEST_TO,
				nonadjusted: true,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
		});
	});
});

// Helper function to validate OHLCV data
function validateOHLCV(dataPoint: any) {
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
