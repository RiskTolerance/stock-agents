import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { otherStatementTool } from '#tools/layer1_dataCollectionTools/company-statements-tools/other-statement-tool.ts';

export const otherStatementAgent = new Agent({
	name: 'Other Statement Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize other miscellaneous but important company statement data provided via the otherStatementTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the data.
	
	Order of operations:

		Fetch data using the otherStatementTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { otherStatementTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
