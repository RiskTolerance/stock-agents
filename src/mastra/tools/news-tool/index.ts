import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { fetchGNews } from './news-api';

const execute = async ({ context }: { context: any }) => {
  const query = context.query;
  // You can pass options if you want to override defaults, e.g.:
  // { lang: 'en', country: 'us', max: 10, ... }
  const news = await fetchGNews(query);
  return news;
};

export const newsTool = createTool({
  id: 'fetch-news-data',
  description: 'Fetch news articles and sentiment analysis regarding a stock or company for a given query using the GNews API. Examples: "Amazon Company News", "Tesla Company News", "Advanced Micro Devices Company News". Use the full company name in the query (e.g., "Advanced Micro Devices earnings report" instead of "AMD").',
  inputSchema: z.object({ query: z.string().describe('A natural language search query for the company or stock, e.g. "AMD earnings report"') }),
  outputSchema: z.any(),
  execute
});

export type NewsArticle = Record<string, unknown>; 