import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { federalFundsTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/federal-funds-tool.ts';

export const federalFundsAgent = new Agent({
	name: 'Federal Funds Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Federal Funds data provided via the federalFundsTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Federal Funds data.
	
	Order of operations:

		Fetch data using the federalFundsTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { federalFundsTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
