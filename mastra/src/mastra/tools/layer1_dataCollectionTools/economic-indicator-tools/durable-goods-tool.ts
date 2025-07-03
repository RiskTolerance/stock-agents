import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const durableGoods = await fmpApi.Economics.economicIndicators('durableGoods');
	return { durableGoods };
};

export const durableGoodsTool = createTool({
	id: 'fetch-durable-goods',
	description: 'Fetch Durable Goods data.',
	inputSchema: z.object({}),
	execute,
});
