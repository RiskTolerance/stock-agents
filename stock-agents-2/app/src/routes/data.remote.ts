import { query } from '$app/server';
import { z } from 'zod';
import { getFmpApi } from '$lib/server/mastra/tools/fmp-tools/utils.js';
import dayjs from 'dayjs';

const getChartDataSchema = z.object({
	symbol: z.string().min(1).max(10),
	days: z.number().min(1).max(365).default(90)
});

export const getChartData = query(getChartDataSchema, async ({ symbol, days }) => {
	const fmpApi = getFmpApi();
	const from = dayjs().subtract(days, 'day').toDate();
	const to = dayjs().toDate();

	try {
		const priceChartData = await fmpApi.Chart.light(symbol.toUpperCase(), { from, to });
		priceChartData.reverse();
		return {
			priceChart: priceChartData.map((item: { date: string | Date; price: number }) => ({
				date: new Date(item.date),
				price: item.price
			}))
		};
	} catch (error) {
		console.error('Error fetching chart data:', error);
		throw new Error('Failed to fetch chart data');
	}
});

