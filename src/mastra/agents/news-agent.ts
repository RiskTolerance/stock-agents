import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { newsTool } from '../tools/news-tool'; // Uncomment and implement as needed

export const newsAgent = new Agent({
  name: 'News Analysis Agent',
  instructions: `
    You are a news and macro events analyst. Parse relevant news articles, economic indicators, or press releases that might impact the stock or market. Summarize and assess the significance of news for the target stock. Use the newsTool to fetch news data.
  `,
  model: openai('gpt-3.5-turbo'),
  tools: { newsTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});
