import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const totalVehicleSales = await fmpApi.Economics.economicIndicators('totalVehicleSales');
	return { totalVehicleSales };
};

export const totalVehicleSalesTool = createTool({
	id: 'fetch-total-vehicle-sales',
	description: 'Fetch Total Vehicle Sales data.',
	inputSchema: z.object({}),
	execute,
});
