import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

export const riskAgent = new Agent({
  name: 'Risk Management Agent',
  instructions: `
    You monitor and evaluate risk metrics of proposed trades. Calculate volatility, downside risk, and check compliance with risk limits. Flag if the aggregated decision would exceed risk thresholds.
  `,
  model: openai('gpt-4o-mini'),
  tools: {},
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});
