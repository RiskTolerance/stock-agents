import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';
import dayjs from 'dayjs';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	const stockNews = await fmpApi.News.stockNews(query, {
		from: dayjs().subtract(1, 'month').toDate(),
		to: dayjs().toDate(),
		page: 0,
		limit: 20,
	});

	const stockGradeNews = await fmpApi.News.stockGradeNews(query, {
		page: 0,
		limit: 20,
	});

	const priceTargetNews = await fmpApi.News.priceTargetNews(query, 20);

	return {
		stockNews,
		stockGradeNews,
		priceTargetNews,
	};
};

export const newsTool = createTool({
	id: 'fetch-news-data',
	description: 'Fetch news data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
