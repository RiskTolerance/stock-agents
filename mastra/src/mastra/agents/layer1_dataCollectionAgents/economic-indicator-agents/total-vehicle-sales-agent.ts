import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { totalVehicleSalesTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/total-vehicle-sales-tool.ts';

export const totalVehicleSalesAgent = new Agent({
	name: 'Total Vehicle Sales Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Total Vehicle Sales data provided via the totalVehicleSalesTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Total Vehicle Sales data.
	
	Order of operations:

		Fetch data using the totalVehicleSalesTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { totalVehicleSalesTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
