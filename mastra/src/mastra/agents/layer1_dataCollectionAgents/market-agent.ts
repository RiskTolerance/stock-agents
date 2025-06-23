import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
// TODO: Implement and import the real marketDataTool
// import { marketDataTool } from '#tools/layer1_dataCollectionTools/market-tool.ts';

export const marketAgent = new Agent({
	name: 'Market Data Agent',
	instructions: `
	You are a financial analyst specializing in market data analysis of public companies. Your role is to interpret and summarize raw market data provided via the marketDataTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the company's current market standing.
	
	Order of operations:

		Fetch data using the marketDataTool.

		Analyze the key market data and trends.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice
	`,
	model: openai('gpt-4o'),
	tools: {
		/* marketDataTool */
	},
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
