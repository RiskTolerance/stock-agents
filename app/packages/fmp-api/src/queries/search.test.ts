import { describe, it, expect } from 'vitest';
import { SearchAPI } from './search.js';

const apiKey = process.env.FMP_API_KEY!;
const searchApi = SearchAPI(apiKey);

describe('SearchAPI', () => {
	it('should fetch stocks using the stock screener with basic options', async () => {
		const result = await searchApi.stockScreener({
			options: {
				marketCapMoreThan: 100000000000, // > 100B
				betaMoreThan: 1,
				volumeMoreThan: 1000000,
				isActivelyTrading: true,
				limit: 5,
				sector: 'Technology',
			},
		});
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result.length).toBeLessThanOrEqual(5);

		const stock = result[0];
		expect(stock).toHaveProperty('symbol');
		expect(stock).toHaveProperty('companyName');
		expect(stock).toHaveProperty('marketCap');
		expect(stock.marketCap).toBeGreaterThan(100000000000);
		expect(stock).toHaveProperty('sector', 'Technology');
		expect(stock).toHaveProperty('beta');
		expect(stock.beta).toBeGreaterThan(1);
		expect(stock).toHaveProperty('price');
		expect(stock).toHaveProperty('volume');
		expect(stock.volume).toBeGreaterThan(1000000);
		expect(stock).toHaveProperty('isActivelyTrading', true);
	});

	it('should fetch stocks with specific industry', async () => {
		const result = await searchApi.stockScreener({
			options: {
				sector: 'Technology',
				industry: 'Software - Application',
				isActivelyTrading: true,
				limit: 3,
			},
		});
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result.length).toBeLessThanOrEqual(3);

		for (const stock of result) {
			expect(stock.sector).toBe('Technology');
			expect(stock.industry).toBe('Software - Application');
		}
	});

	it('should return an empty array for overly restrictive criteria', async () => {
		const result = await searchApi.stockScreener({
			options: {
				marketCapMoreThan: 1000000000000000, // Unrealistic market cap
				isActivelyTrading: true,
				limit: 5,
			},
		});
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBe(0);
	});

	it('should work with ETF and Fund filters', async () => {
		const result = await searchApi.stockScreener({
			options: {
				isEtf: true,
				isActivelyTrading: true,
				limit: 2,
				exchange: 'NASDAQ',
			},
		});
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result.length).toBeLessThanOrEqual(2);
		for (const stock of result) {
			expect(stock.isEtf).toBe(true);
			expect(stock.exchangeShortName).toBe('NASDAQ');
		}
	});
});