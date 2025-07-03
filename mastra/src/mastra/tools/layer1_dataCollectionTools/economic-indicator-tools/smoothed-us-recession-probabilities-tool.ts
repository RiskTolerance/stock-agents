import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const smoothedUSRecessionProbabilities = await fmpApi.Economics.economicIndicators('smoothedUSRecessionProbabilities');
	return { smoothedUSRecessionProbabilities };
};

export const smoothedUsRecessionProbabilitiesTool = createTool({
	id: 'fetch-smoothed-us-recession-probabilities',
	description: 'Fetch Smoothed US Recession Probabilities data.',
	inputSchema: z.object({}),
	execute,
});
