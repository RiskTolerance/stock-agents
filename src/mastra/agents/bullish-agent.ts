import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { vectorQueryTool } from '../tools/vector-query-tool';

export const bullishAgent = new Agent({
  name: 'Bullish Research Agent',
  instructions: `
    You argue the bull case for the stock, using all available analyses from memory. 
    Retrieve supportive evidence and form a pro-investment argument. 
    Use the vectorQueryTool to pull relevant facts.
  `,
  model: openai('gpt-4o'), // Placeholder for reasoning LLM
  tools: { vectorQueryTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
}); 