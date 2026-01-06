import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceGrowthData } from '../../../utils/data-reduction.js';

export const incomeStatementGrowthTool = createTool({
	id: 'fetch-income-statement-growth',
	description:
		'Fetch income statement growth metrics for a stock symbol (limited to 2 most recent periods to reduce token usage)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z
			.number()
			.default(2)
			.describe('Number of periods to fetch (default 2 to reduce token usage)')
	}),
	outputSchema: z.object({
		incomeStatementGrowth: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period } = context;
		// Always fetch only 2 periods and reduce data
		const incomeStatementGrowth = await fmpApi.Statements.incomeStatementGrowth(symbol, 2, period);
		return { incomeStatementGrowth: reduceGrowthData(incomeStatementGrowth) };
	}
});

