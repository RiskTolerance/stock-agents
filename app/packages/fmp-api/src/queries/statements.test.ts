import { describe, it, expect } from 'vitest';
import { StatementsAPI } from './statements.js';

const apiKey = process.env.FMP_API_KEY;
const statementsApi = apiKey ? StatementsAPI(apiKey) : null;

const TEST_SYMBOL = 'AAPL';
const TEST_LIMIT = 1;
const TEST_PERIOD = 'annual';

// Skip all tests if FMP_API_KEY is not set
const runTests = process.env.FMP_API_KEY ? describe : describe.skip;

runTests('Financial Modeling Prep - Statements API Integration Tests', () => {
	describe('Income Statement', () => {
		it('should fetch income statement', async () => {
			const result = await statementsApi!.incomeStatement(TEST_SYMBOL, {
				limit: TEST_LIMIT,
				period: TEST_PERIOD,
			});
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('date');
			expect(item).toHaveProperty('reportedCurrency');
		});
	});

	describe('Balance Sheet', () => {
		it('should fetch balance sheet', async () => {
			const result = await statementsApi!.balanceSheet(TEST_SYMBOL, {
				limit: TEST_LIMIT,
				period: TEST_PERIOD,
			});
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('date');
			expect(item).toHaveProperty('reportedCurrency');
		});
	});

	describe('Cash Flow Statement', () => {
		it('should fetch cash flow statement', async () => {
			const result = await statementsApi!.cashFlowStatement(TEST_SYMBOL, {
				limit: TEST_LIMIT,
				period: TEST_PERIOD,
			});
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('date');
			expect(item).toHaveProperty('reportedCurrency');
		});
	});

	describe('Key Metrics', () => {
		it('should fetch key metrics', async () => {
			const result = await statementsApi!.keyMetrics(TEST_SYMBOL, {
				limit: TEST_LIMIT,
				period: 'annual',
			});
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('marketCap');
			expect(typeof item.marketCap).toBe('number');
		});
	});

	describe('Financial Ratios', () => {
		it('should fetch financial ratios', async () => {
			const result = await statementsApi!.financialRatios(TEST_SYMBOL, {
				limit: TEST_LIMIT,
				period: 'annual',
			});
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('grossProfitMargin');
			expect(typeof item.grossProfitMargin).toBe('number');
		});
	});

	describe('Key Metrics TTM', () => {
		it('should fetch key metrics TTM', async () => {
			const result = await statementsApi!.keyMetricsTtm(TEST_SYMBOL);
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('marketCap');
			expect(typeof item.marketCap).toBe('number');
		});
	});

	describe('Financial Ratios TTM', () => {
		it('should fetch financial ratios TTM', async () => {
			const result = await statementsApi!.financialRatiosTtm(TEST_SYMBOL);
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('grossProfitMarginTTM');
			expect(typeof item.grossProfitMarginTTM).toBe('number');
		});
	});

	describe('Financial Scores', () => {
		it('should fetch financial scores', async () => {
			const result = await statementsApi!.financialScores(TEST_SYMBOL);
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('altmanZScore');
			expect(typeof item.altmanZScore).toBe('number');
		});
	});

	describe('Owner Earnings', () => {
		it('should fetch owner earnings', async () => {
			const result = await statementsApi!.ownerEarnings(
				TEST_SYMBOL,
				TEST_LIMIT
			);
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('ownersEarnings');
			expect(typeof item.ownersEarnings).toBe('number');
		});
	});

	describe('Enterprise Values', () => {
		it('should fetch enterprise values', async () => {
			const result = await statementsApi!.enterpriseValues(
				TEST_SYMBOL,
				TEST_LIMIT,
				TEST_PERIOD
			);
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('enterpriseValue');
			expect(typeof item.enterpriseValue).toBe('number');
		});
	});

	describe('Income Statement Growth', () => {
		it('should fetch income statement growth', async () => {
			const result = await statementsApi!.incomeStatementGrowth(
				TEST_SYMBOL,
				TEST_LIMIT,
				TEST_PERIOD
			);
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('growthRevenue');
			expect(typeof item.growthRevenue).toBe('number');
		});
	});

	describe('Balance Sheet Growth', () => {
		it('should fetch balance sheet growth', async () => {
			const result = await statementsApi!.balanceSheetGrowth(
				TEST_SYMBOL,
				TEST_LIMIT,
				TEST_PERIOD
			);
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('growthCashAndCashEquivalents');
			expect(typeof item.growthCashAndCashEquivalents).toBe('number');
		});
	});

	describe('Cash Flow Statement Growth', () => {
		it('should fetch cash flow statement growth', async () => {
			const result = await statementsApi!.cashFlowStatementGrowth(
				TEST_SYMBOL,
				TEST_LIMIT,
				TEST_PERIOD
			);
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			const item = result[0];
			expect(item).toHaveProperty('symbol', TEST_SYMBOL);
			expect(item).toHaveProperty('growthNetIncome');
			expect(typeof item.growthNetIncome).toBe('number');
		});
	});
});
