import { describe, it, expect } from 'vitest';
import { CompanyAPI } from './company';

// Skip all tests if FMP_API_KEY is not set
const runTests = process.env.FMP_API_KEY ? describe : describe.skip;

runTests('Financial Modeling Prep - Company API Integration Tests', () => {
	const TEST_SYMBOL = 'AAPL'; // Using Apple as it's a well-documented company

	describe('Company Profile', () => {
		it('should fetch company profile', async () => {
			const result = await CompanyAPI.profile(TEST_SYMBOL);

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(1);

			const profile = result[0];
			expect(profile.symbol).toBe(TEST_SYMBOL);
			expect(profile.companyName).toBe('Apple Inc.');
			expect(profile.currency).toBe('USD');
			expect(profile.exchange).toBe('NASDAQ');
			expect(profile.industry).toBeTruthy();
			expect(profile.sector).toBeTruthy();
			expect(profile.country).toBe('US');

			// Market data
			expect(typeof profile.price).toBe('number');
			expect(typeof profile.marketCap).toBe('number');
			expect(typeof profile.beta).toBe('number');
			expect(typeof profile.volume).toBe('number');
			expect(typeof profile.averageVolume).toBe('number');
			expect(profile.isActivelyTrading).toBe(true);

			// Company details
			expect(profile.cik).toBeTruthy();
			expect(profile.isin).toBeTruthy();
			expect(profile.cusip).toBeTruthy();
			expect(profile.website).toMatch(/^https?:\/\//);
			expect(profile.description).toBeTruthy();
			expect(profile.fullTimeEmployees).toBeTruthy();
			expect(profile.address).toBeTruthy();
			expect(profile.city).toBeTruthy();
			expect(profile.state).toBeTruthy();
			expect(profile.zip).toBeTruthy();

			// Company type flags
			expect(typeof profile.isEtf).toBe('boolean');
			expect(typeof profile.isAdr).toBe('boolean');
			expect(typeof profile.isFund).toBe('boolean');
		});
	});

	describe('Employee Count', () => {
		it('should fetch current employee count', async () => {
			const result = await CompanyAPI.employeeCount(TEST_SYMBOL, 1);

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(1);

			const data = result[0];
			expect(data.symbol).toBe(TEST_SYMBOL);
			expect(data.companyName).toBeTruthy();
			expect(data.cik).toBeTruthy();
			expect(typeof data.employeeCount).toBe('number');
			expect(data.employeeCount).toBeGreaterThan(0);

			// Form type should be a valid SEC form
			expect(data.formType).toMatch(/^10-[KQ]/);
		});

		it('should fetch historical employee counts', async () => {
			const result = await CompanyAPI.historicalEmployeeCount(TEST_SYMBOL, 5);

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			expect(result.length).toBeLessThanOrEqual(5);

			const data = result[0];
			expect(data.symbol).toBe(TEST_SYMBOL);
			expect(data.companyName).toBeTruthy();
			expect(data.cik).toBeTruthy();
			expect(typeof data.employeeCount).toBe('number');
			expect(data.employeeCount).toBeGreaterThan(0);

			// Employee count should be reasonable (not decrease too drastically)
			for (let i = 1; i < result.length; i++) {
				const currentCount = result[i - 1].employeeCount;
				const previousCount = result[i].employeeCount;
				// Allow for up to 50% decrease between reports
				expect(currentCount).toBeGreaterThan(previousCount * 0.5);
			}
		});
	});

	describe('Market Cap', () => {
		it('should fetch market cap', async () => {
			const result = await CompanyAPI.marketCap(TEST_SYMBOL);

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(1);

			const data = result[0];
			expect(data.symbol).toBe(TEST_SYMBOL);
			expect(typeof data.marketCap).toBe('number');
			expect(data.marketCap).toBeGreaterThan(0);

			// Market cap should be reasonable for Apple (>$1T as of 2024)
			expect(data.marketCap).toBeGreaterThan(1e12);
		});
	});
});
