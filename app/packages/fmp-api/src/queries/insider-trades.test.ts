import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InsiderTradesAPI } from './insider-trades.js';
import { mockFetch, resetFetchMocks } from '../../test/utils/api-test-utils.js';

const apiKey = process.env.FMP_API_KEY!;
const insiderApi = InsiderTradesAPI(apiKey);

const TEST_SYMBOL = 'AAPL';
const TEST_OPTIONS = {
	from: new Date('2024-01-01'),
	to: new Date('2024-01-31'),
	reportingCik: '0000320193',
	companyCik: '0000320193',
	transactionType: 'Buy',
};

const mockInsiderTrades = [
	{
		symbol: TEST_SYMBOL,
		filingDate: '2024-01-10',
		transactionDate: '2024-01-09',
		reportingCik: '0000320193',
		companyCik: '0000320193',
		transactionType: 'Buy',
		securitiesOwned: 1000,
		reportingName: 'Tim Cook',
		typeOfOwner: 'Director',
		acquisitionOrDisposition: 'A',
		directOrIndirect: 'D',
		formType: '4',
		securitiesTransacted: 100,
		price: 150.0,
		securityName: 'Common Stock',
		url: 'https://www.sec.gov/Archives/edgar/data/0000320193/000032019324000001/xslF345X03/wk-form4_1673300000.xml',
	},
];

describe('InsiderTradesAPI', () => {
	beforeEach(() => {
		process.env.FMP_API_KEY = 'test-key';
	});
	afterEach(() => {
		resetFetchMocks();
	});

	it('should fetch insider trades for a symbol', async () => {
		const fetchMock = mockFetch([]);
		const result = await insiderApi.searchInsiderTrades(
			TEST_SYMBOL,
			TEST_OPTIONS
		);
		expect(fetchMock).toHaveBeenCalledOnce();
		expect(Array.isArray(result)).toBe(true);
	});

	it('should fetch insider trades with multiple options', async () => {
		const fetchMock = mockFetch(mockInsiderTrades);
		const result = await insiderApi.searchInsiderTrades(
			TEST_SYMBOL,
			TEST_OPTIONS
		);
		expect(fetchMock).toHaveBeenCalledOnce();
		expect(result).toEqual(mockInsiderTrades);
	});

	it('should handle fetch error', async () => {
		const error = new Error('Network error');
		const spy = vi.spyOn(global, 'fetch').mockRejectedValue(error);
		await expect(
			insiderApi.searchInsiderTrades(TEST_SYMBOL, TEST_OPTIONS)
		).rejects.toThrow('Network error');
		spy.mockRestore();
	});
});
