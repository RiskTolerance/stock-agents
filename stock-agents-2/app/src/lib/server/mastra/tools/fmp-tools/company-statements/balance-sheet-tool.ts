import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceBalanceSheet } from '../../../utils/data-reduction.js';

export const balanceSheetTool = createTool({
	id: 'fetch-balance-sheet',
	description:
		'Fetch balance sheet data for a stock symbol (limited to 2 most recent periods to reduce token usage)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z
			.number()
			.default(2)
			.describe('Number of periods to fetch (default 2 to reduce token usage)')
	}),
	outputSchema: z.object({
		balanceSheet: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period } = context;
		// Always fetch only 2 periods and reduce data
		const balanceSheet = await fmpApi.Statements.balanceSheet(symbol, { period, limit: 2 });
		return { balanceSheet: reduceBalanceSheet(balanceSheet) };
	}
});

