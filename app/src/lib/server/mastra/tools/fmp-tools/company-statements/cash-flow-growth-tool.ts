import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceCashFlowGrowth } from '../../../utils/data-reduction.js';

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
		const { symbol, period } = context;
		console.log(`[Cash Flow Growth Tool] Executing for symbol: ${symbol}, period: ${period}`);
		
		const fmpApi = getFmpApi();
		const cashFlowGrowth = await fmpApi.Statements.cashFlowStatementGrowth(symbol, 2, period);
		return { cashFlowGrowth: reduceCashFlowGrowth(cashFlowGrowth) };
	}
});

