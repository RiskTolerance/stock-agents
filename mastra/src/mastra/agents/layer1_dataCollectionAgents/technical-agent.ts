import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { technicalIndicatorTool } from '#tools/layer1_dataCollectionTools/technical-indicator-tool.ts';

export const technicalAgent = new Agent({
	name: 'Technical Analysis Agent',
	instructions: `
	You are a financial analyst specializing in technical analysis of public companies. Your role is to interpret and summarize raw technical data provided via the technicalDataTool.

    You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the company’s current technical standing.
    
    Order of operations:

      Fetch data using the technicalDataTool.

      Analyze key areas: revenue, profit margins, earnings per share, free cash flow, debt levels, and liquidity
	`,
	model: openai('gpt-4o'),
	tools: { technicalIndicatorTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
