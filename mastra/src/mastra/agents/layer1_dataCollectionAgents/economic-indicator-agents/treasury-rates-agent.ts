import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { treasuryRatesTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/treasury-rates-tool.ts';

export const treasuryRatesAgent = new Agent({
	name: 'Treasury Rates Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Treasury Rates data provided via the treasuryRatesTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Treasury Rates data.
	
	Order of operations:

		Fetch data using the treasuryRatesTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('o4-mini'),
	tools: { treasuryRatesTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
