import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { insiderTradesTool } from '#tools/layer1_dataCollectionTools/insider-trades-tool.ts';

export const insiderAgent = new Agent({
	name: 'Insider Trades Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the insider trading activity provided via the insiderTradesTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of insider trading activity.
	
	Order of operations:

		Fetch data using the insiderTradesTool.

		Analyze the insider trading data, focusing on the volume and direction (buys vs. sells) of trades.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('o4-mini'),
	tools: { insiderTradesTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
