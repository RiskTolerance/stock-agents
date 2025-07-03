import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const industrialProductionTotalIndex = await fmpApi.Economics.economicIndicators('industrialProductionTotalIndex');
	return { industrialProductionTotalIndex };
};

export const industrialProductionTotalIndexTool = createTool({
	id: 'fetch-industrial-production-total-index',
	description: 'Fetch Industrial Production Total Index data.',
	inputSchema: z.object({}),
	execute,
});
