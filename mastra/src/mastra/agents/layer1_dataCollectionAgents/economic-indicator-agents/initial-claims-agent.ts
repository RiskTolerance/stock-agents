import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { initialClaimsTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/initial-claims-tool.ts';

export const initialClaimsAgent = new Agent({
	name: 'Initial Claims Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Initial Claims data provided via the initialClaimsTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Initial Claims data.
	
	Order of operations:

		Fetch data using the initialClaimsTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('o4-mini'),
	tools: { initialClaimsTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
