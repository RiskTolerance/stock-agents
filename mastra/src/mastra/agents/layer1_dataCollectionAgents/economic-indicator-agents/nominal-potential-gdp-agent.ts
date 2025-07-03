import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { nominalPotentialGdpTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/nominal-potential-gdp-tool.ts';

export const nominalPotentialGdpAgent = new Agent({
	name: 'Nominal Potential GDP Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Nominal Potential Gross Domestic Product (GDP) data provided via the nominalPotentialGdpTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Nominal Potential GDP data.
	
	Order of operations:

		Fetch data using the nominalPotentialGdpTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('o4-mini'),
	tools: { nominalPotentialGdpTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
