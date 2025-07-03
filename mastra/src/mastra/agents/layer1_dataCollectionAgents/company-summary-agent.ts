import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { companySummaryTool } from '../../tools/layer1_dataCollectionTools/company-summary-tool.ts';

export const companySummaryAgent = new Agent({
	name: 'Company Overview Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the basic company data provided via the companyDataTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the company and associated data (profile, market cap, employee count, historical employee count).
	
	Order of operations:

		Fetch data using the companyDataTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('o4-mini'),
	tools: { companySummaryTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
