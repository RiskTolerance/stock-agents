import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const gdp = await fmpApi.Economics.economicIndicators('GDP');
	return { gdp };
};

export const gdpTool = createTool({
	id: 'fetch-gdp',
	description: 'Fetch Gross Domestic Product (GDP) data.',
	inputSchema: z.object({}),
	execute,
});
