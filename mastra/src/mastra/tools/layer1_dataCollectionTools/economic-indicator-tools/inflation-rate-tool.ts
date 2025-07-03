import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const inflationRate = await fmpApi.Economics.economicIndicators('inflationRate');
	return { inflationRate };
};

export const inflationRateTool = createTool({
	id: 'fetch-inflation-rate',
	description: 'Fetch Inflation Rate data.',
	inputSchema: z.object({}),
	execute,
});
