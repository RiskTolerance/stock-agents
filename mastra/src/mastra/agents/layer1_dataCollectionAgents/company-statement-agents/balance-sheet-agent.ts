import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { balanceSheetTool } from '#tools/layer1_dataCollectionTools/company-statements-tools/balance-sheet-tool.ts';

export const balanceSheetAgent = new Agent({
	name: 'Balance Sheet Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the company's balance sheet data provided via the balanceSheetTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the company's balance sheet.
	
	Order of operations:

		Fetch data using the balanceSheetTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o-mini'),
	tools: { balanceSheetTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
