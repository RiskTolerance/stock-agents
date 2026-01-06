import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from './utils.js';
import { reduceNews } from '../../utils/data-reduction.js';

export const newsDataTool = createTool({
	id: 'fetch-news-data',
	description: 'Fetch recent news headlines for a stock (reduced data)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		news: z.any()
	}),
	execute: async ({ context }) => {
		const { symbol } = context;
		console.log(`[News Data Tool] Executing for symbol: ${symbol}`);
		
		const fmpApi = getFmpApi();

		// Only fetch stock news with small limit
		const stockNews = await fmpApi.News.stockNews(symbol, { limit: 5 });

		// Apply data reduction
		return { news: reduceNews(stockNews) };
	}
});

