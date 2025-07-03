import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const realGDPPerCapita = await fmpApi.Economics.economicIndicators('realGDPPerCapita');
	return { realGDPPerCapita };
};

export const realGdpPerCapitaTool = createTool({
	id: 'fetch-real-gdp-per-capita',
	description: 'Fetch Real Gross Domestic Product (GDP) Per Capita data.',
	inputSchema: z.object({}),
	execute,
});
