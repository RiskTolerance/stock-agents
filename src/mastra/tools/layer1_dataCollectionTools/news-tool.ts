import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { NewsAPI } from '#apis/financialModelingPrep/news.ts';
import dayjs from 'dayjs';

const execute = async ({ context }: { context: any }) => {
	const query = context.query;
	const from = dayjs().subtract(1, 'month').toDate();
	const to = dayjs().toDate();
	const stockNews = await NewsAPI.stockNews(query, {
		from,
		to,
		page: 1,
		limit: 10,
	});
	const pressReleases = await NewsAPI.pressReleases(query, {
		from,
		to,
		page: 1,
		limit: 10,
	});
	const priceTargetNews = await NewsAPI.priceTargetNews(query, 10);
	const stockGradeNews = await NewsAPI.stockGradeNews(query, {
		page: 1,
		limit: 10,
	});
	return {
		stockNews,
		pressReleases,
		priceTargetNews,
		stockGradeNews,
	};
};

export const newsTool = createTool({
	id: 'fetch-news-data',
	description:
		'Fetch news articles, press releases, price target news, and stock grade news for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	outputSchema: z.any(),
	execute,
});

export type NewsArticle = Record<string, unknown>;
