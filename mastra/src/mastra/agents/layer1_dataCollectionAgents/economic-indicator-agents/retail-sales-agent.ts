import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { retailSalesTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/retail-sales-tool.ts';

export const retailSalesAgent = new Agent({
	name: 'Retail Sales Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Retail Sales data provided via the retailSalesTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Retail Sales data.
	
	Order of operations:

		Fetch data using the retailSalesTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('o4-mini'),
	tools: { retailSalesTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
