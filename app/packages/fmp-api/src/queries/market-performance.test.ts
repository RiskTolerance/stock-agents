import { describe, it, expect } from 'vitest';
import { MarketPerformanceAPI } from './market-performance.js';

const apiKey = process.env.FMP_API_KEY;
const marketApi = apiKey ? MarketPerformanceAPI(apiKey) : null;

const TEST_EXCHANGE = 'NASDAQ';
const TEST_SECTOR = 'Technology';
const TEST_INDUSTRY = 'Software - Application';
const TEST_DATE = new Date('2024-01-01');
const TEST_FROM = new Date('2024-01-01');
const TEST_TO = new Date('2024-01-31');

// Skip all tests if FMP_API_KEY is not set
const runTests = process.env.FMP_API_KEY ? describe : describe.skip;

runTests(
	'Financial Modeling Prep - Market Performance API Integration Tests',
	() => {
		describe('Market Sector Performance History', () => {
			it('should fetch market sector performance history', async () => {
				const result = await marketApi!.marketSectorPerformanceHistory(
					TEST_FROM,
					TEST_TO,
					TEST_EXCHANGE,
					TEST_SECTOR
				);
				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);
				const item = result[0];
				expect(item).toHaveProperty('date');
				expect(item).toHaveProperty('sector', TEST_SECTOR);
				expect(item).toHaveProperty('exchange', TEST_EXCHANGE);
				expect(item).toHaveProperty('averageChange');
				expect(typeof item.averageChange).toBe('number');
			});
		});

		describe('Industry Performance History', () => {
			it('should fetch industry performance history', async () => {
				const result = await marketApi!.industryPerformanceHistory({
					options: {
						from: TEST_FROM,
						to: TEST_TO,
						exchange: TEST_EXCHANGE,
						industry: TEST_INDUSTRY,
					},
				});
				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);
				const item = result[0];
				expect(item).toHaveProperty('date');
				expect(item).toHaveProperty('industry', TEST_INDUSTRY);
				expect(item).toHaveProperty('exchange', TEST_EXCHANGE);
				expect(item).toHaveProperty('averageChange');
				expect(typeof item.averageChange).toBe('number');
			});
		});

		describe('Sector Price/Earnings History', () => {
			it('should fetch sector price/earnings history', async () => {
				const result = await marketApi!.sectorPriceEarningsHistory({
					options: {
						date: TEST_DATE,
						exchange: TEST_EXCHANGE,
						sector: TEST_SECTOR,
					},
				});
				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);
				const item = result[0];
				expect(item).toHaveProperty('date');
				expect(item).toHaveProperty('sector', TEST_SECTOR);
				expect(item).toHaveProperty('exchange', TEST_EXCHANGE);
				expect(item).toHaveProperty('pe');
				expect(typeof item.pe).toBe('number');
			});
		});

		describe('Industry Price/Earnings History', () => {
			it('should fetch industry price/earnings history', async () => {
				const result = await marketApi!.industryPriceEarningsHistory({
					options: {
						from: TEST_FROM,
						to: TEST_TO,
						exchange: TEST_EXCHANGE,
						industry: TEST_INDUSTRY,
					},
				});
				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);
				const item = result[0];
				expect(item).toHaveProperty('date');
				expect(item).toHaveProperty('industry', TEST_INDUSTRY);
				expect(item).toHaveProperty('exchange', TEST_EXCHANGE);
				expect(item).toHaveProperty('pe');
				expect(typeof item.pe).toBe('number');
			});
		});

		describe('Biggest Losers', () => {
			it('should fetch biggest losers', async () => {
				const result = await marketApi!.biggestLosers();
				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);
				const item = result[0];
				expect(item).toHaveProperty('symbol');
				expect(item).toHaveProperty('price');
				expect(item).toHaveProperty('name');
				expect(item).toHaveProperty('change');
				expect(item).toHaveProperty('changesPercentage');
				expect(item).toHaveProperty('exchange');
				expect(typeof item.price).toBe('number');
				expect(typeof item.change).toBe('number');
				expect(typeof item.changesPercentage).toBe('number');
			});
		});

		describe('Biggest Gainers', () => {
			it('should fetch biggest gainers', async () => {
				const result = await marketApi!.biggestGainers();
				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);
				const item = result[0];
				expect(item).toHaveProperty('symbol');
				expect(item).toHaveProperty('price');
				expect(item).toHaveProperty('name');
				expect(item).toHaveProperty('change');
				expect(item).toHaveProperty('changesPercentage');
				expect(item).toHaveProperty('exchange');
				expect(typeof item.price).toBe('number');
				expect(typeof item.change).toBe('number');
				expect(typeof item.changesPercentage).toBe('number');
			});
		});

		describe('Most Active', () => {
			it('should fetch most active', async () => {
				const result = await marketApi!.mostActive();
				expect(Array.isArray(result)).toBe(true);
				expect(result.length).toBeGreaterThan(0);
				const item = result[0];
				expect(item).toHaveProperty('symbol');
				expect(item).toHaveProperty('price');
				expect(item).toHaveProperty('name');
				expect(item).toHaveProperty('change');
				expect(item).toHaveProperty('changesPercentage');
				expect(item).toHaveProperty('exchange');
				expect(typeof item.price).toBe('number');
				expect(typeof item.change).toBe('number');
				expect(typeof item.changesPercentage).toBe('number');
			});
		});
	}
);
