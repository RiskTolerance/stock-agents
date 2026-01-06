import { describe, it, expect } from 'vitest';
import { DirectoryAPI } from './directory.js';

const apiKey = process.env.FMP_API_KEY!;
const directoryApi = DirectoryAPI(apiKey);

// Skip all tests if FMP_API_KEY is not set
const runTests = process.env.FMP_API_KEY ? describe : describe.skip;

runTests('Financial Modeling Prep - Directory API Integration Tests', () => {
	describe('Company Symbol List', () => {
		it('should fetch company symbols', async () => {
			const result = await directoryApi.companySymbolList();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const company = result[0];
			expect(company).toHaveProperty('symbol');
			expect(company).toHaveProperty('companyName');
			expect(typeof company.symbol).toBe('string');
			expect(typeof company.companyName).toBe('string');
			expect(company.symbol).not.toBe('');
			expect(company.companyName).not.toBe('');

			// Check for well-known companies
			const appleEntry = result.find((c: any) => c.symbol === 'AAPL');
			expect(appleEntry).toBeDefined();
			expect(appleEntry?.companyName).toContain('Apple');
		});
	});

	describe('Company Financial Symbol List', () => {
		it('should fetch financial symbols', async () => {
			const result = await directoryApi.companyFinancialSymbolList();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const company = result[0];
			expect(company).toHaveProperty('symbol');
			expect(company).toHaveProperty('companyName');
			expect(company).toHaveProperty('tradingCurrency');
			expect(company).toHaveProperty('reportingCurrency');

			// Validate currency formats
			expect(company.tradingCurrency).toMatch(/^[A-Z]{3}$/); // e.g., USD, EUR
			expect(company.reportingCurrency).toMatch(/^[A-Z]{3}$/);
		});
	});

	describe('Actively Trading List', () => {
		it('should fetch actively trading companies', async () => {
			const result = await directoryApi.activelyTradingList();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const company = result[0];
			expect(company).toHaveProperty('symbol');
			expect(company).toHaveProperty('name');
			expect(typeof company.symbol).toBe('string');
			expect(typeof company.name).toBe('string');
			expect(company.symbol).not.toBe('');
			expect(company.name).not.toBe('');

			// Ensure major companies are in the active list
			const hasActiveCompanies = result.some((c: any) =>
				['AAPL', 'MSFT', 'GOOGL', 'AMZN'].includes(c.symbol)
			);
			expect(hasActiveCompanies).toBe(true);
		});
	});

	describe('Available Sectors', () => {
		it('should fetch available sectors', async () => {
			const result = await directoryApi.availableSectors();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const sector = result[0];
			expect(sector).toHaveProperty('sector'); // Note: API returns 'industry' even for sectors
			expect(typeof sector.sector).toBe('string');
			expect(sector.sector).not.toBe('');

			// Check for common sectors
			const commonSectors = ['Technology', 'Healthcare', 'Financial Services'];
			const hasSomeSectors = result.some((s: any) =>
				commonSectors.some((common) => s.sector.includes(common))
			);
			expect(hasSomeSectors).toBe(true);
		});
	});

	describe('Available Industries', () => {
		it('should fetch available industries', async () => {
			const result = await directoryApi.availableIndustries();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const industry = result[0];
			expect(industry).toHaveProperty('industry');
			expect(typeof industry.industry).toBe('string');
			expect(industry.industry).not.toBe('');

			// Check for common industries
			const commonIndustries = ['Software', 'Banks', 'Biotechnology'];
			const hasSomeIndustries = result.some((i: any) =>
				commonIndustries.some((common) => i.industry.includes(common))
			);
			expect(hasSomeIndustries).toBe(true);
		});
	});

	describe('Data Consistency', () => {
		it('should have more industries than sectors', async () => {
			const sectors = await directoryApi.availableSectors();
			const industries = await directoryApi.availableIndustries();

			expect(industries.length).toBeGreaterThan(sectors.length);
		});

		it('should have actively trading symbols in the main symbol list', async () => {
			const allSymbols = await directoryApi.companySymbolList();
			const activeSymbols = await directoryApi.activelyTradingList();

			// Take a sample of active symbols and verify they're in the main list
			activeSymbols.slice(0, 10).forEach((activeCompany: any) => {
				expect(
					allSymbols.some((s: any) => s.symbol === activeCompany.symbol)
				).toBe(true);
			});
		});
	});
});
