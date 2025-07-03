import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const unemploymentRate = await fmpApi.Economics.economicIndicators('unemploymentRate');
	return { unemploymentRate };
};

export const unemploymentRateTool = createTool({
	id: 'fetch-unemployment-rate',
	description: 'Fetch Unemployment Rate data.',
	inputSchema: z.object({}),
	execute,
});
