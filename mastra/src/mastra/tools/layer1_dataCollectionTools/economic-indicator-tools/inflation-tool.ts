import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const inflation = await fmpApi.Economics.economicIndicators('inflation');
	return { inflation };
};

export const inflationTool = createTool({
	id: 'fetch-inflation',
	description: 'Fetch Inflation data.',
	inputSchema: z.object({}),
	execute,
});
