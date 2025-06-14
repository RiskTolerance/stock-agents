import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { vectorQueryTool } from '../tools/vector-query-tool';

export const decisionAgent = new Agent({
  name: 'Trader/Decision Agent',
  instructions: `
    You synthesize all agent inputs and decide the final action (Buy, Sell, Hold). 
    Aggregate votes, apply weighting, and ensure risk constraints are met. 
    Use the vectorQueryTool to read agent conclusions from memory.
  `,
  model: openai('gpt-4o'), // Placeholder for powerful LLM
  tools: { vectorQueryTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
}); 