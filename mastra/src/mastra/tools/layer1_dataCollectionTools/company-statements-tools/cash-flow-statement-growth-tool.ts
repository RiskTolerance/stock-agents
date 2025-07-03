import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	const cashFlowStatementGrowthQuarterly =
		await fmpApi.Statements.cashFlowStatementGrowth(query, 4, 'quarter');
	const cashFlowStatementGrowthYearly =
		await fmpApi.Statements.cashFlowStatementGrowth(query, 2, 'annual');

	return {
		cashFlowStatementGrowthQuarterly,
		cashFlowStatementGrowthYearly,
	};
};

export const cashFlowStatementGrowthTool = createTool({
	id: 'fetch-cash-flow-statement-growth-data',
	description:
		'Fetch cash flow statement growth data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
