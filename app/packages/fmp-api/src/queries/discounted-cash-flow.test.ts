import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DiscountedCashFlowAPI } from './discounted-cash-flow.js';
import { mockFetch, resetFetchMocks } from '../../test/utils/api-test-utils.js';

const apiKey = process.env.FMP_API_KEY!;
const dcfApi = DiscountedCashFlowAPI(apiKey);

const TEST_SYMBOL = 'AAPL';

const mockDcfValuation = [
	{
		symbol: TEST_SYMBOL,
		date: '2024-01-01',
		dcf: 150.5,
		'Stock Price': 145.2,
	},
];

const mockLeveredDcf = [
	{
		symbol: TEST_SYMBOL,
		date: '2024-01-01',
		dcf: 140.1,
		'Stock Price': 145.2,
	},
];

describe('DiscountedCashFlowAPI', () => {
	beforeEach(() => {
		process.env.FMP_API_KEY = 'test-key';
	});
	afterEach(() => {
		resetFetchMocks();
	});

	it('should fetch DCF valuation', async () => {
		const fetchMock = mockFetch(mockDcfValuation);
		const result = await dcfApi.dcfValuation(TEST_SYMBOL);
		expect(fetchMock).toHaveBeenCalledOnce();
		expect(result).toEqual(mockDcfValuation);
	});

	it('should fetch levered DCF', async () => {
		const fetchMock = mockFetch(mockLeveredDcf);
		const result = await dcfApi.leveredDcf(TEST_SYMBOL);
		expect(fetchMock).toHaveBeenCalledOnce();
		expect(result).toEqual(mockLeveredDcf);
	});

	it('should handle fetch error', async () => {
		// Simulate fetch throwing
		const error = new Error('Network error');
		const spy = vi.spyOn(global, 'fetch').mockRejectedValue(error);
		await expect(dcfApi.dcfValuation(TEST_SYMBOL)).rejects.toThrow(
			'Network error'
		);
		spy.mockRestore();
	});
});
