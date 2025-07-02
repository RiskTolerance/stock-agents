import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	return {};
};

export const broadMarketPerformanceTool = createTool({
	id: 'fetch-broad-market-performance-data',
	description: 'Fetch broad market performance data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
