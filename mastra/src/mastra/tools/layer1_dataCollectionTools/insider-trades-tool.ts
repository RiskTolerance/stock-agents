import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';
import dayjs from 'dayjs';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	const insiderTrades = await fmpApi.InsiderTrades.searchInsiderTrades(query, {
		from: dayjs().subtract(1, 'month').toDate(),
		to: dayjs().toDate(),
	});

	return {
		insiderTrades,
	};
};

export const insiderTradesTool = createTool({
	id: 'fetch-insider-trades-data',
	description: 'Fetch insider trades data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
