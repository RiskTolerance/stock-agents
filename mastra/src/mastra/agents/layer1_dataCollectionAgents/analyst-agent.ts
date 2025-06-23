import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { analystDataTool } from '#tools/layer1_dataCollectionTools/analyst-tool.ts';

export const analystAgent = new Agent({
	name: 'Analyst Analysis Agent',
	instructions: `
	You are a financial analyst specializing in fundamental analysis of public companies. Your role is to interpret and summarize the sentiment and conclusions of analyst data provided via the analystDataTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the company’s current financial standing.
	
	Order of operations:

		Fetch data using the analystDataTool.

		Analyze the sentiment and conclusions of the analyst data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice
	`,
	model: openai('gpt-4o'),
	tools: { analystDataTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
