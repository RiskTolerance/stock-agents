import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	// TODO: implement this endpoint for the evaluation workflow

	return {};
};

export const searchTool = createTool({
	id: 'fetch-search-data',
	description: 'Fetch search data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
