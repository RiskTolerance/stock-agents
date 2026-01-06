import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi, getDateDaysAgo, getToday } from './utils.js';
import { reduceInsiderTrading } from '../../utils/data-reduction.js';

export const insiderDataTool = createTool({
	id: 'fetch-insider-data',
	description: 'Fetch insider trading activity for a stock (reduced data)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		insiderTrades: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const symbol = context.symbol;

		// Search insider trades for the last 90 days only (reduced from 180)
		const from = getDateDaysAgo(90);
		const to = getToday();

		const insiderTrades = await fmpApi.InsiderTrades.searchInsiderTrades(symbol, {
			from,
			to
		});

		// Apply data reduction
		return { insiderTrades: reduceInsiderTrading(insiderTrades) };
	}
});

