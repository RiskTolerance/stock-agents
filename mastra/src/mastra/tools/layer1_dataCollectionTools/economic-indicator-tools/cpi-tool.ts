import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const cpi = await fmpApi.Economics.economicIndicators('CPI');
	return { cpi };
};

export const cpiTool = createTool({
	id: 'fetch-cpi',
	description: 'Fetch Consumer Price Index (CPI) data.',
	inputSchema: z.object({}),
	execute,
});
