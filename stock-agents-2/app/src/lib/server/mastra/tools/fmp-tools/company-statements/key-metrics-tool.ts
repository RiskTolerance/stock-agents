import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceKeyMetrics } from '../../../utils/data-reduction.js';

export const keyMetricsTool = createTool({
	id: 'fetch-key-metrics',
	description:
		'Fetch key metrics for a stock symbol (limited to 2 most recent periods to reduce token usage)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		limit: z
			.number()
			.default(2)
			.describe('Number of periods to fetch (default 2 to reduce token usage)')
	}),
	outputSchema: z.object({
		keyMetrics: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol } = context;
		// Always fetch only 2 periods and reduce data
		const keyMetrics = await fmpApi.Statements.keyMetrics(symbol, { period: 'annual', limit: 2 });
		return { keyMetrics: reduceKeyMetrics(keyMetrics) };
	}
});

