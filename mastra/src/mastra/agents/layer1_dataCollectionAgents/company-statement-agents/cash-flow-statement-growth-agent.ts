import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { cashFlowStatementGrowthTool } from '#tools/layer1_dataCollectionTools/company-statements-tools/cash-flow-statement-growth-tool.ts';

export const cashFlowStatementGrowthAgent = new Agent({
	name: 'Cash Flow Growth Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the company's cash flow growth data provided via the cashFlowStatementGrowthTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the company's cash flow growth.
	
	Order of operations:

		Fetch data using the cashFlowStatementGrowthTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('o4-mini'),
	tools: { cashFlowStatementGrowthTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
