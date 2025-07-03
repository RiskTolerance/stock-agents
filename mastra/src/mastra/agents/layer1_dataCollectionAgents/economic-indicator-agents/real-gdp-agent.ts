import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { realGdpTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/real-gdp-tool.ts';

export const realGdpAgent = new Agent({
	name: 'Real GDP Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Real Gross Domestic Product (GDP) data provided via the realGdpTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Real GDP data.
	
	Order of operations:

		Fetch data using the realGdpTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { realGdpTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
