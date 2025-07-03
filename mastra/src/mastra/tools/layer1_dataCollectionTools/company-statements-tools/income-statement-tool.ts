import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	const incomeStatementQuarterly = await fmpApi.Statements.incomeStatement(
		query,
		{
			limit: 4,
			period: 'quarter',
		}
	);

	const incomeStatementAnnual = await fmpApi.Statements.incomeStatement(query, {
		limit: 2,
		period: 'annual',
	});

	return {
		incomeStatementQuarterly,
		incomeStatementAnnual,
	};
};

export const incomeStatementTool = createTool({
	id: 'fetch-income-statement-data',
	description: 'Fetch income statement data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
