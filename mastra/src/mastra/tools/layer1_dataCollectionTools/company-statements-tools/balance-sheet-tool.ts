import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	const balanceSheetQuarterly = await fmpApi.Statements.balanceSheet(query, {
		limit: 4,
		period: 'quarter',
	});

	const balanceSheetAnnual = await fmpApi.Statements.balanceSheet(query, {
		limit: 2,
		period: 'annual',
	});

	return {
		balanceSheetQuarterly,
		balanceSheetAnnual,
	};
};

export const balanceSheetTool = createTool({
	id: 'fetch-balance-sheet-data',
	description: 'Fetch balance sheet data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
