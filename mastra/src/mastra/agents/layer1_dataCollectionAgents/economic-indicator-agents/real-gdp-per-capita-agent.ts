import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { realGdpPerCapitaTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/real-gdp-per-capita-tool.ts';

export const realGdpPerCapitaAgent = new Agent({
	name: 'Real GDP Per Capita Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Real Gross Domestic Product (GDP) Per Capita data provided via the realGdpPerCapitaTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Real GDP Per Capita data.
	
	Order of operations:

		Fetch data using the realGdpPerCapitaTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { realGdpPerCapitaTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
