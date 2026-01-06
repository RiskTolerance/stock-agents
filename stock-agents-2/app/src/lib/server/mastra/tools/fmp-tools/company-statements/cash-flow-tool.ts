import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceCashFlow } from '../../../utils/data-reduction.js';

export const cashFlowTool = createTool({
	id: 'fetch-cash-flow',
	description:
		'Fetch cash flow statement data for a stock symbol (limited to 2 most recent periods to reduce token usage)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z
			.number()
			.default(2)
			.describe('Number of periods to fetch (default 2 to reduce token usage)')
	}),
	outputSchema: z.object({
		cashFlow: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period } = context;
		// Always fetch only 2 periods and reduce data
		const cashFlow = await fmpApi.Statements.cashFlowStatement(symbol, { period, limit: 2 });
		return { cashFlow: reduceCashFlow(cashFlow) };
	}
});

