import { describe, it, expect } from 'vitest';
import { NewsAPI } from './news.js';
import dayjs from 'dayjs';

const apiKey = process.env.FMP_API_KEY!;
const newsApi = NewsAPI(apiKey);

// Skip all tests if FMP_API_KEY is not set
const runTests = process.env.FMP_API_KEY ? describe : describe.skip;

runTests('Financial Modeling Prep - News API Integration Tests', () => {
	const TEST_SYMBOL = 'AAPL'; // Using Apple as it's a high-profile stock with regular news
	const TEST_FROM = dayjs().subtract(30, 'days').toDate();
	const TEST_TO = dayjs().toDate();

	describe('Stock News', () => {
		it('should fetch stock news for a symbol', async () => {
			const result = await newsApi.stockNews(TEST_SYMBOL, {
				from: TEST_FROM,
				to: TEST_TO,
				page: 0,
				limit: 10,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			expect(result.length).toBeLessThanOrEqual(10);

			const article = result[0];
			expect(article.symbol).toBe(TEST_SYMBOL);
			expect(article.publisher).toBeTruthy();
			expect(article.title).toBeTruthy();
			expect(article.text).toBeTruthy();
			expect(article.url.startsWith('http')).toBe(true);
		});

		it('should handle pagination correctly', async () => {
			const page1 = await newsApi.stockNews(TEST_SYMBOL, {
				from: TEST_FROM,
				to: TEST_TO,
				page: 0,
				limit: 5,
			});

			const page2 = await newsApi.stockNews(TEST_SYMBOL, {
				from: TEST_FROM,
				to: TEST_TO,
				page: 1,
				limit: 5,
			});

			expect(page1.length).toBeLessThanOrEqual(5);
			expect(page2.length).toBeLessThanOrEqual(5);

			// Ensure pages don't overlap
			const page1Urls = new Set(page1.map((a) => a.url));
			const page2Urls = new Set(page2.map((a) => a.url));
			const intersection = [...page1Urls].filter((url) => page2Urls.has(url));
			expect(intersection.length).toBe(0);
		});
	});

	describe('Price Target News', () => {
		it('should fetch price target updates', async () => {
			const result = await newsApi.priceTargetNews(TEST_SYMBOL, 10);

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			expect(result.length).toBeLessThanOrEqual(10);

			const update = result[0];
			expect(update.symbol).toBe(TEST_SYMBOL);
			expect(update.analystName).toBeDefined();
			expect(update.analystCompany).toBeTruthy();
			expect(update.priceTarget).toBeGreaterThan(0);
			expect(update.adjPriceTarget).toBeGreaterThan(0);
			expect(update.priceWhenPosted).toBeGreaterThan(0);
			expect(update.newsURL.startsWith('http')).toBe(true);
		});
	});

	describe('Stock Grade News', () => {
		it('should fetch analyst grade updates', async () => {
			const result = await newsApi.stockGradeNews(TEST_SYMBOL, {
				page: 0,
				limit: 10,
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			expect(result.length).toBeLessThanOrEqual(10);

			const grade = result[0];
			expect(grade.symbol).toBe(TEST_SYMBOL);
			expect(grade.gradingCompany).toBeTruthy();
			expect(grade.newGrade).toBeTruthy();
			expect(grade.action).toBeTruthy();
			expect(grade.priceWhenPosted).toBeGreaterThan(0);
			expect(grade.newsURL.startsWith('http')).toBe(true);
		});

		it('should handle pagination correctly', async () => {
			const page1 = await newsApi.stockGradeNews(TEST_SYMBOL, {
				page: 0,
				limit: 5,
			});

			const page2 = await newsApi.stockGradeNews(TEST_SYMBOL, {
				page: 1,
				limit: 5,
			});

			expect(page1.length).toBeLessThanOrEqual(5);
			expect(page2.length).toBeLessThanOrEqual(5);

			// Ensure pages don't overlap
			const page1Urls = new Set(page1.map((a) => a.newsURL));
			const page2Urls = new Set(page2.map((a) => a.newsURL));
			const intersection = [...page1Urls].filter((url) => page2Urls.has(url));
			expect(intersection.length).toBe(0);
		});
	});
});
