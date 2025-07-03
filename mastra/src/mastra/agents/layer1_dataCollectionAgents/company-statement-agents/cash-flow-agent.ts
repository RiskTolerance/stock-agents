import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { cashFlowTool } from '#tools/layer1_dataCollectionTools/company-statements-tools/cash-flow-tool.ts';

export const cashFlowAgent = new Agent({
	name: 'Cash Flow Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the company's cash flow data provided via the cashFlowTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the company's cash flow.
	
	Order of operations:

		Fetch data using the cashFlowTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { cashFlowTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
