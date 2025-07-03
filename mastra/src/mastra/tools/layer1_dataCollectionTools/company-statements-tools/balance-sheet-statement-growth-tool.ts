import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	const balanceSheetStatementGrowthQuarterly =
		await fmpApi.Statements.balanceSheetGrowth(query, 4, 'quarter');
	const balanceSheetStatementGrowthYearly =
		await fmpApi.Statements.balanceSheetGrowth(query, 2, 'annual');

	return {
		balanceSheetStatementGrowthQuarterly,
		balanceSheetStatementGrowthYearly,
	};
};

export const balanceSheetStatementGrowthTool = createTool({
	id: 'fetch-balance-sheet-statement-growth-data',
	description:
		'Fetch balance sheet statement growth data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
