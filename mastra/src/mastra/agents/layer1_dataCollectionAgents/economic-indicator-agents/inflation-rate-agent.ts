import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { inflationRateTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/inflation-rate-tool.ts';

export const inflationRateAgent = new Agent({
	name: 'Inflation Rate Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Inflation Rate data provided via the inflationRateTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Inflation Rate data.
	
	Order of operations:

		Fetch data using the inflationRateTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { inflationRateTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
