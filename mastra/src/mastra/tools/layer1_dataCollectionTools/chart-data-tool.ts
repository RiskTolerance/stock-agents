import { createTool } from '@mastra/core/tools';
import dayjs from 'dayjs';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;
	// TODO: there are probably some technical indicators that can be calculated from this data. Returning time series data is not optimal.
	const chartLight = await fmpApi.Chart.light(query, {
		from: dayjs().subtract(1, 'month').toDate(),
		to: dayjs().toDate(),
	});

	return {
		chartLight,
	};
};

export const chartDataTool = createTool({
	id: 'fetch-chart-data',
	description: 'Fetch chart data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
