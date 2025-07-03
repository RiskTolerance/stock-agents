import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const retailSales = await fmpApi.Economics.economicIndicators('retailSales');
	return { retailSales };
};

export const retailSalesTool = createTool({
	id: 'fetch-retail-sales',
	description: 'Fetch Retail Sales data.',
	inputSchema: z.object({}),
	execute,
});
