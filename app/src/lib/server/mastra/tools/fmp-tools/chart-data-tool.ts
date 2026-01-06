import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi, getDateDaysAgo, getToday } from './utils.js';

export const chartDataTool = createTool({
	id: 'fetch-chart-data',
	description: 'Fetch historical price data for charting',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		days: z.number().default(365).describe('Number of days of history')
	}),
	outputSchema: z.object({
		priceHistory: z.any()
	}),
	execute: async ({ context }) => {
		const { symbol, days } = context;
		console.log(`[Chart Data Tool] Executing for symbol: ${symbol}, days: ${days}`);
		
		const fmpApi = getFmpApi();

		const from = getDateDaysAgo(days);
		const to = getToday();

		const priceHistory = await fmpApi.Chart.full(symbol, { from, to });

		return { priceHistory };
	}
});

