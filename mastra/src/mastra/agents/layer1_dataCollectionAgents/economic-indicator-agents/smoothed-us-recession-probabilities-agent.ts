import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { smoothedUsRecessionProbabilitiesTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/smoothed-us-recession-probabilities-tool.ts';

export const smoothedUsRecessionProbabilitiesAgent = new Agent({
	name: 'Smoothed US Recession Probabilities Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Smoothed US Recession Probabilities data provided via the smoothedUsRecessionProbabilitiesTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Smoothed US Recession Probabilities data.
	
	Order of operations:

		Fetch data using the smoothedUsRecessionProbabilitiesTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { smoothedUsRecessionProbabilitiesTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
