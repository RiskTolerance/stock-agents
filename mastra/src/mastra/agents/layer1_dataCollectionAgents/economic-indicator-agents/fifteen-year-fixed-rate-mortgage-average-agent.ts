import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { fifteenYearFixedRateMortgageAverageTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/fifteen-year-fixed-rate-mortgage-average-tool.ts';

export const fifteenYearFixedRateMortgageAverageAgent = new Agent({
	name: '15-Year Fixed Rate Mortgage Average Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the 15-Year Fixed Rate Mortgage Average data provided via the fifteenYearFixedRateMortgageAverageTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the 15-Year Fixed Rate Mortgage Average data.
	
	Order of operations:

		Fetch data using the fifteenYearFixedRateMortgageAverageTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('o4-mini'),
	tools: { fifteenYearFixedRateMortgageAverageTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
