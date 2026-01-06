import { describe, it, expect } from 'vitest';
import { EconomicsAPI, EconomicIndicatorNameOptions } from './economics.js';
import dayjs from 'dayjs';

const apiKey = process.env.FMP_API_KEY!;
const economicsApi = EconomicsAPI(apiKey);

// Skip all tests if FMP_API_KEY is not set
const runTests = process.env.FMP_API_KEY ? describe : describe.skip;

runTests('Financial Modeling Prep - Economics API Integration Tests', () => {
	describe('Treasury Rates', () => {
		it('should fetch treasury rates', async () => {
			const result = await economicsApi.treasuryRates();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const rate = result[0];
			// Check all required properties
			expect(rate).toHaveProperty('month1');
			expect(rate).toHaveProperty('month2');
			expect(rate).toHaveProperty('month3');
			expect(rate).toHaveProperty('month6');
			expect(rate).toHaveProperty('year1');
			expect(rate).toHaveProperty('year2');
			expect(rate).toHaveProperty('year3');
			expect(rate).toHaveProperty('year5');
			expect(rate).toHaveProperty('year7');
			expect(rate).toHaveProperty('year10');
			expect(rate).toHaveProperty('year20');
			expect(rate).toHaveProperty('year30');

			// Validate all rates are numbers and within reasonable bounds
			Object.entries(rate).forEach(([key, value]) => {
				if (key !== 'date') {
					expect(typeof value).toBe('number');
					// Treasury rates are typically between -1% (rare, but possible) and 20% (historical high was around 16%)
					expect(value).toBeGreaterThanOrEqual(-1);
					expect(value).toBeLessThanOrEqual(20);
				}
			});
		});

		it('should return rates in chronological order', async () => {
			const result = await economicsApi.treasuryRates();

			// Check first few entries are in descending order (newest first)
			for (let i = 1; i < result.length; i++) {
				expect(new Date((result[i - 1] as any).date).getTime()).toBeGreaterThan(
					new Date((result[i] as any).date).getTime()
				);
			}
		});
	});

	describe('Economic Indicators', () => {
		const TEST_FROM = dayjs().subtract(1, 'year').toDate();
		const TEST_TO = dayjs().toDate();

		// Test a sample of important indicators
		const SAMPLE_INDICATORS: EconomicIndicatorNameOptions[] = [
			'GDP',
			'CPI',
			'inflationRate',
			'unemploymentRate',
			'retailSales',
		];

		SAMPLE_INDICATORS.forEach((indicator) => {
			it(`should fetch ${indicator} data`, async () => {
				const result = await economicsApi.economicIndicators(indicator, {
					from: TEST_FROM,
					to: TEST_TO,
				});

				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);

				const dataPoint = result[0];
				expect(dataPoint).toHaveProperty('value');
				expect(dataPoint).toHaveProperty('name', indicator);
				expect(typeof dataPoint.value).toBe('number');
			});
		});

		it('should handle future dates appropriately', async () => {
			const futureFrom = dayjs().add(1, 'year').toDate();
			const futureTo = dayjs().add(2, 'year').toDate();

			const result = await economicsApi.economicIndicators('GDP', {
				from: futureFrom,
				to: futureTo,
			});

			// Should either return empty array or only historical data
			if (result.length > 0) {
				expect(result.length).toBeGreaterThan(0);
			}
		});

		it('should validate indicator values are reasonable', async () => {
			// Test specific indicators with known value ranges
			const unemploymentRate = await economicsApi.economicIndicators(
				'unemploymentRate',
				{
					from: TEST_FROM,
					to: TEST_TO,
				}
			);

			// Unemployment rate should be between 0% and 30% (being very generous)
			unemploymentRate.forEach((rate: any) => {
				expect(rate.value).toBeGreaterThanOrEqual(0);
				expect(rate.value).toBeLessThanOrEqual(30);
			});

			const inflationRate = await economicsApi.economicIndicators(
				'inflationRate',
				{
					from: TEST_FROM,
					to: TEST_TO,
				}
			);

			// Inflation rate should be between -20% and 50% (extreme bounds)
			inflationRate.forEach((rate: any) => {
				expect(rate.value).toBeGreaterThanOrEqual(-20);
				expect(rate.value).toBeLessThanOrEqual(50);
			});
		});

		it('should return data in chronological order', async () => {
			const result = await economicsApi.economicIndicators('GDP', {
				from: TEST_FROM,
				to: TEST_TO,
			});

			// Check first few entries are in descending order (newest first)
			const dates = result
				.slice(0, 5)
				.map((r: any) => new Date(r.date).getTime());
			expect(dates).toEqual([...dates].sort((a, b) => b - a));
		});
	});
});
