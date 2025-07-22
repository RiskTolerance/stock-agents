import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	const cashFlowQuarterly = await fmpApi.Statements.cashFlowStatement(query, {
		limit: 4,
		period: 'quarter',
	});

	const cashFlowAnnual = await fmpApi.Statements.cashFlowStatement(query, {
		limit: 2,
		period: 'annual',
	});

	return {
		cashFlowQuarterly,
		cashFlowAnnual,
	};
};

export const cashFlowTool = createTool({
	id: 'fetch-cash-flow-data',
	description: 'Fetch cash flow data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
