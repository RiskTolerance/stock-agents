import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Boilerplate for news tool
export const newsTool = createTool({
  id: 'fetch-news-data',
  description: 'Fetch news articles for a given stock symbol',
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.any(),
  execute: async ({ context }) => {
    // TODO: Implement API call to fetch news articles
    return [];
  },
});

export type NewsArticle = Record<string, unknown>; 