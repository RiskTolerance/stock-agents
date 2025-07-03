import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const realGDP = await fmpApi.Economics.economicIndicators('realGDP');
	return { realGDP };
};

export const realGdpTool = createTool({
	id: 'fetch-real-gdp',
	description: 'Fetch Real Gross Domestic Product (GDP) data.',
	inputSchema: z.object({}),
	execute,
});
