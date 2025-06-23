import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
// TODO: Implement and import the real financialsDataTool
// import { financialsDataTool } from '#tools/layer1_dataCollectionTools/financials-tool.ts';

export const financialsAgent = new Agent({
	name: 'Financials Data Agent',
	instructions: `
	You are a financial analyst specializing in company financials. Your role is to interpret and summarize raw financial data provided via the financialsDataTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the company's current financial standing.
	
	Order of operations:

		Fetch data using the financialsDataTool.

		Analyze the key financial metrics and trends.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice
	`,
	model: openai('gpt-4o'),
	tools: {
		/* financialsDataTool */
	},
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
