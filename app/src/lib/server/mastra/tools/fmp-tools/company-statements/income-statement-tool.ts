import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceIncomeStatement } from '../../../utils/data-reduction.js';

export const incomeStatementTool = createTool({
	id: 'fetch-income-statement',
	description:
		'Fetch income statement data for a stock symbol (limited to 2 most recent periods to reduce token usage)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z
			.number()
			.default(2)
			.describe('Number of periods to fetch (default 2 to reduce token usage)')
	}),
	outputSchema: z.object({
		incomeStatement: z.any()
	}),
	execute: async ({ context }) => {
		const { symbol, period } = context;
		console.log(`[Income Statement Tool] Executing for symbol: ${symbol}, period: ${period}`);
		
		const fmpApi = getFmpApi();
		// Always fetch only 2 periods and reduce data
		const incomeStatement = await fmpApi.Statements.incomeStatement(symbol, { period, limit: 2 });
		return { incomeStatement: reduceIncomeStatement(incomeStatement) };
	}
});

