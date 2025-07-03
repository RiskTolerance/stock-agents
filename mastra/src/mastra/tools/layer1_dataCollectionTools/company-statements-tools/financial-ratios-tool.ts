import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	// sadly we can only get annual reports on the starter plan 😭
	const financialRatiosYearly = await fmpApi.Statements.financialRatios(query, {
		limit: 2,
		period: 'annual',
	});

	return {
		financialRatiosYearly,
	};
};

export const financialRatiosTool = createTool({
	id: 'fetch-financial-ratios-data',
	description: 'Fetch financial ratios data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
