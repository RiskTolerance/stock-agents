import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	const incomeStatementGrowthYearly =
		await fmpApi.Statements.incomeStatementGrowth(query, 2, 'annual');

	const incomeStatementGrowthQuarterly =
		await fmpApi.Statements.incomeStatementGrowth(query, 4, 'quarter');

	return {
		incomeStatementGrowthYearly,
		incomeStatementGrowthQuarterly,
	};
};

export const incomeStatementGrowthTool = createTool({
	id: 'fetch-financial-statement-growth-data',
	description:
		'Fetch financial statement growth data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
