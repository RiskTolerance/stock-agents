import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { inflationTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/inflation-tool.ts';

export const inflationAgent = new Agent({
	name: 'Inflation Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Inflation data provided via the inflationTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Inflation data.
	
	Order of operations:

		Fetch data using the inflationTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { inflationTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
