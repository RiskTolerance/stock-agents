import { describe, it, expect } from 'vitest';
import { AnalystAPI } from './analyst';

// Skip all tests if FMP_API_KEY is not set
const runTests = process.env.FMP_API_KEY ? describe : describe.skip;

runTests('Financial Modeling Prep - Analyst API Integration Tests', () => {
	const TEST_SYMBOL = 'AAPL'; // Using Apple as it's a well-covered stock

	describe('Financial Estimates', () => {
		it('should fetch financial estimates', async () => {
			const result = await AnalystAPI.financialEstimates(TEST_SYMBOL, {
				page: 1,
				limit: 5,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const estimate = result[0];
			expect(estimate).toHaveProperty('symbol', TEST_SYMBOL);
			expect(estimate).toHaveProperty('revenueLow');
			expect(estimate).toHaveProperty('revenueHigh');
			expect(estimate).toHaveProperty('revenueAvg');
			expect(estimate.revenueHigh).toBeGreaterThan(estimate.revenueLow);
		});

		it('should enforce limit < 10', async () => {
			await expect(
				AnalystAPI.financialEstimates(TEST_SYMBOL, { page: 1, limit: 10 })
			).rejects.toThrow('Limit must be less than 10');
		});

		it('should return empty array for invalid symbols', async () => {
			const result = await AnalystAPI.financialEstimates('INVALID_SYMBOL', {
				page: 1,
				limit: 1,
			});
			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(0);
		});
	});

	describe('Ratings', () => {
		it('should fetch rating snapshot', async () => {
			const result = await AnalystAPI.ratingSnapshot(TEST_SYMBOL);

			expect(Array.isArray(result)).toBe(true);
			expect(result[0]).toHaveProperty('symbol', TEST_SYMBOL);
			expect(result[0]).toHaveProperty('rating');
			expect(result[0]).toHaveProperty('overallScore');
		});

		it('should return empty array for invalid symbols', async () => {
			const result = await AnalystAPI.ratingSnapshot('INVALID_SYMBOL');
			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(0);
		});

		it('should fetch historical ratings', async () => {
			const result = await AnalystAPI.historicalRatings(TEST_SYMBOL, 5);

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeLessThanOrEqual(5);
			expect(result[0]).toHaveProperty('symbol', TEST_SYMBOL);
			expect(result[0]).toHaveProperty('date');
			expect(result[0]).toHaveProperty('rating');
		});
	});

	describe('Price Targets', () => {
		it('should fetch analyst price targets', async () => {
			const result = await AnalystAPI.analystPriceTarget(TEST_SYMBOL);

			expect(Array.isArray(result)).toBe(true);
			expect(result[0]).toHaveProperty('symbol', TEST_SYMBOL);
			expect(result[0]).toHaveProperty('lastMonthAvgPriceTarget');
			expect(result[0]).toHaveProperty('lastQuarterAvgPriceTarget');
			expect(result[0]).toHaveProperty('lastYearAvgPriceTarget');
		});

		it('should fetch price target consensus', async () => {
			const result = await AnalystAPI.analystPriceTargetConsensus(TEST_SYMBOL);

			expect(Array.isArray(result)).toBe(true);
			expect(result[0]).toHaveProperty('symbol', TEST_SYMBOL);
			expect(result[0]).toHaveProperty('targetHigh');
			expect(result[0]).toHaveProperty('targetLow');
			expect(result[0]).toHaveProperty('targetConsensus');
			expect(result[0].targetHigh).toBeGreaterThan(result[0].targetLow);
		});
	});

	describe('Stock Grades', () => {
		it('should fetch stock grades consensus', async () => {
			const result = await AnalystAPI.stockGradesConsensus(TEST_SYMBOL);

			expect(Array.isArray(result)).toBe(true);
			expect(result[0]).toHaveProperty('symbol', TEST_SYMBOL);
			expect(result[0]).toHaveProperty('strongBuy');
			expect(result[0]).toHaveProperty('buy');
			expect(result[0]).toHaveProperty('hold');
			expect(result[0]).toHaveProperty('sell');
			expect(result[0]).toHaveProperty('strongSell');
			expect(result[0]).toHaveProperty('consensus');
		});

		it('should fetch stock grade changes', async () => {
			const result = await AnalystAPI.stockGradeChanges(TEST_SYMBOL);

			expect(Array.isArray(result)).toBe(true);
			if (result.length > 0) {
				// Some stocks might not have recent grade changes
				expect(result[0]).toHaveProperty('symbol', TEST_SYMBOL);
				expect(result[0]).toHaveProperty('gradingCompany');
				expect(result[0]).toHaveProperty('previousGrade');
				expect(result[0]).toHaveProperty('newGrade');
			}
		});

		it('should fetch stock grade history', async () => {
			const result = await AnalystAPI.stockGradeHistory(TEST_SYMBOL, 5);

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeLessThanOrEqual(5);
			expect(result[0]).toHaveProperty('symbol', TEST_SYMBOL);
			expect(result[0]).toHaveProperty('analystRatingsBuy');
			expect(result[0]).toHaveProperty('analystRatingsHold');
			expect(result[0]).toHaveProperty('analystRatingsSell');
		});
	});
});
