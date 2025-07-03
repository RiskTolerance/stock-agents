import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const nominalPotentialGDP = await fmpApi.Economics.economicIndicators('nominalPotentialGDP');
	return { nominalPotentialGDP };
};

export const nominalPotentialGdpTool = createTool({
	id: 'fetch-nominal-potential-gdp',
	description: 'Fetch Nominal Potential Gross Domestic Product (GDP) data.',
	inputSchema: z.object({}),
	execute,
});
