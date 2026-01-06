import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from './utils.js';

export const discountedCashFlowTool = createTool({
	id: 'fetch-discounted-cash-flow-data',
	description:
		'Fetch discounted cash flow (DCF) valuation data for a stock symbol. Used for fundamental valuation analysis.',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol (e.g., AAPL)')
	}),
	outputSchema: z.object({
		dcfValuation: z.any(),
		leveredDcf: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const symbol = context.symbol.toUpperCase();

		// Fetch DCF data in parallel
		const [dcfValuation, leveredDcf] = await Promise.all([
			fmpApi.DiscountedCashFlow.dcfValuation(symbol),
			fmpApi.DiscountedCashFlow.leveredDcf(symbol)
		]);

		// Return raw data (DCF data is typically small and already structured)
		return {
			dcfValuation: dcfValuation || null,
			leveredDcf: leveredDcf || null
		};
	}
});

