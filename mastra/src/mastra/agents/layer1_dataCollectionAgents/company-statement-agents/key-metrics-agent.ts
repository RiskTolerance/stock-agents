import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { keyMetricsTool } from '#tools/layer1_dataCollectionTools/company-statements-tools/key-metrics-tool.ts';

export const keyMetricsAgent = new Agent({
	name: 'Key Metrics Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the company's key metrics provided via the keyMetricsTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the company's key metrics.
	
	Order of operations:

		Fetch data using the keyMetricsTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { keyMetricsTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
