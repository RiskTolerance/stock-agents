import { createFmpApi } from 'fmp-api';
import { FMP_API_KEY } from '$env/static/private';
import type { PageServerLoad } from './$types';
import dayjs from 'dayjs';

export const load: PageServerLoad = async () => {
	// const data = await createFmpApi(FMP_API_KEY).Analyst.analystPriceTarget('AAPL');
	const fmpApi = createFmpApi(FMP_API_KEY);
	const priceChartData = await fmpApi.Chart.light('AAPL', {
		from: dayjs().subtract(30, 'day').format('YYYY-MM-DD') as unknown as Date,
		to: dayjs().format('YYYY-MM-DD') as unknown as Date // TODO: change types to string
	});
	// since the api returns the latest data first, we need to reverse the array for the chart to render in chronological order
	priceChartData.reverse();
	const priceChart = priceChartData.map((item) => ({
		date: item.date,
		price: item.price
	}));
	return {
		priceChart
	};
};
