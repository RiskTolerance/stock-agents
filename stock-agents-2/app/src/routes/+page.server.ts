import type { PageServerLoad } from './$types';
import { getFmpApi } from '$lib/server/mastra/tools/fmp-tools/utils.js';
import dayjs from 'dayjs';

export const load: PageServerLoad = async () => {
	const fmpApi = getFmpApi();
	const defaultSymbol = 'GOOGL';
	const daysBack = 90;

	// Fetch chart data for default symbol (90 days)
	const from = dayjs().subtract(daysBack, 'day').toDate();
	const to = dayjs().toDate();

	try {
		const priceChartData = await fmpApi.Chart.light(defaultSymbol, {
			from,
			to
		});

		// Reverse array since API returns latest data first
		priceChartData.reverse();

		// Transform to chart format
		const priceChart = priceChartData.map((item) => ({
			date: new Date(item.date),
			price: item.price
		}));

		return {
			priceChart,
			defaultSymbol
		};
	} catch (error) {
		console.error('Error fetching chart data:', error);
		// Return empty array on error
		return {
			priceChart: [],
			defaultSymbol
		};
	}
};

