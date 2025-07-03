import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

// TODO: implement this endpoint for the evaluation workflow

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	return {};
};

export const directoryTool = createTool({
	id: 'fetch-directory-data',
	description: 'Fetch directory data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
