import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { incomeStatementGrowthTool } from '#tools/layer1_dataCollectionTools/company-statements-tools/income-statement-growth-tool.ts';

export const incomeStatementGrowthAgent = new Agent({
	name: 'Income Statement Growth Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the company's income statement growth data provided via the incomeStatementGrowthTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the company's income statement growth.
	
	Order of operations:

		Fetch data using the incomeStatementGrowthTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { incomeStatementGrowthTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
