import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { newsTool } from '../../tools/layer1_dataCollectionTools/news-tool.ts';

export const newsAgent = new Agent({
	name: 'News Analysis Agent',
	instructions: `
    You are a news and macro events analyst specializing in parsing relevant news articles that might impact the stock or market. Your role is to interpret and summarize news data provided via the newsTool.

    You are not expected to make recommendations or predictions — your task is to deliver a clear, factual snapshot of recent news and events affecting the company.
    
    Order of operations:

      Fetch data using the newsTool, passing the stock symbol directly as the 'query' parameter.

      Analyze key areas: company announcements, earnings reports, market sentiment, regulatory news, and industry developments
  `,
	model: openai('o4-mini'),
	tools: { newsTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
