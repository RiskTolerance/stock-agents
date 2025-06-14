import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

export const technicalAgent = new Agent({
  name: 'Technical Analysis Agent',
  instructions: `
    You analyze price patterns and technical indicators to detect trends and signals. Use time-series data and technical indicator libraries to detect trends or signals (e.g. moving average crosses, RSI overbought/oversold).
  `,
  model: openai('gpt-4o-mini'),
  tools: {},
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});
