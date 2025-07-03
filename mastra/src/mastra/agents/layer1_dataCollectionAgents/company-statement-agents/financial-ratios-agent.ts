import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { financialRatiosTool } from '#tools/layer1_dataCollectionTools/company-statements-tools/financial-ratios-tool.ts';

export const financialRatiosAgent = new Agent({
	name: 'Financial Ratios Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the company's financial ratios provided via the financialRatiosTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the company's financial ratios.
	
	Order of operations:

		Fetch data using the financialRatiosTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('o4-mini'),
	tools: { financialRatiosTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
