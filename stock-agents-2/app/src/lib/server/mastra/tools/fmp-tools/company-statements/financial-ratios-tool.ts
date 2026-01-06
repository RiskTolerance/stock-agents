import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceFinancialRatios } from '../../../utils/data-reduction.js';

export const financialRatiosTool = createTool({
	id: 'fetch-financial-ratios',
	description: 'Fetch financial ratios for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		ratios: z.any()
	}),
	execute: async ({ context }) => {
		const { symbol } = context;
		console.log(`[Financial Ratios Tool] Executing for symbol: ${symbol}`);
		
		const fmpApi = getFmpApi();
		const ratios = await fmpApi.Statements.financialRatios(symbol);
		return { ratios: reduceFinancialRatios(ratios) };
	}
});

