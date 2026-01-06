import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceGrowthData } from '../../../utils/data-reduction.js';

export const cashFlowGrowthTool = createTool({
	id: 'fetch-cash-flow-growth',
	description: 'Fetch cash flow statement growth metrics for a stock symbol (reduced data)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period')
	}),
	outputSchema: z.object({
		cashFlowGrowth: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period } = context;
		const cashFlowGrowth = await fmpApi.Statements.cashFlowStatementGrowth(symbol, 2, period);
		return { cashFlowGrowth: reduceGrowthData(cashFlowGrowth) };
	}
});

