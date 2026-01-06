import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceBalanceSheetGrowth } from '../../../utils/data-reduction.js';

export const balanceSheetGrowthTool = createTool({
	id: 'fetch-balance-sheet-growth',
	description: 'Fetch balance sheet growth metrics for a stock symbol (reduced data)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period')
	}),
	outputSchema: z.object({
		balanceSheetGrowth: z.any()
	}),
	execute: async ({ context }) => {
		const { symbol, period } = context;
		console.log(`[Balance Sheet Growth Tool] Executing for symbol: ${symbol}, period: ${period}`);
		
		const fmpApi = getFmpApi();
		const balanceSheetGrowth = await fmpApi.Statements.balanceSheetGrowth(symbol, 2, period);
		return { balanceSheetGrowth: reduceBalanceSheetGrowth(balanceSheetGrowth) };
	}
});

