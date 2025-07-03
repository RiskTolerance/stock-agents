import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	// sadly we can only get annual reports on the starter plan 😭
	const keyMetrics_TwoYears = await fmpApi.Statements.keyMetrics(query, {
		limit: 2,
		period: 'annual',
	});

	const keyMetrics_TrailingTwelveMonths = await fmpApi.Statements.keyMetricsTtm(
		query
	);

	return {
		keyMetrics_TwoYears,
		keyMetrics_TrailingTwelveMonths,
	};
};

export const keyMetricsTool = createTool({
	id: 'fetch-key-metrics-data',
	description: 'Fetch key metrics data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
