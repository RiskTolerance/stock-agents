import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceGrowthData } from '../../../utils/data-reduction.js';

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
		const fmpApi = getFmpApi();
		const { symbol, period } = context;
		const balanceSheetGrowth = await fmpApi.Statements.balanceSheetGrowth(symbol, 2, period);
		return { balanceSheetGrowth: reduceGrowthData(balanceSheetGrowth) };
	}
});

