import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { newsTool } from '../../tools/layer1_dataCollectionTools/news-tool.ts';

export const newsAgent = new Agent({
	name: 'News Analysis Agent',
	instructions: `
    You are a news and macro events analyst. Parse relevant news articles that might impact the stock or market. Summarize and assess the significance of news for the target stock. 
    Given a stock symbol, generate a natural language search query that will find the most relevant news for that company or its stock (e.g., "AMD earnings report", "Nvidia AI chips", "Tesla stock price drop"). Pass this query to the newsTool as the 'query' parameter.
    
    For example:
    - If the symbol is "AMD", you might generate: "Advanced Micro Devices news"
    - If the symbol is "TSLA", you might generate: "Tesla news"
  `,
	model: openai('o4-mini'),
	tools: { newsTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
