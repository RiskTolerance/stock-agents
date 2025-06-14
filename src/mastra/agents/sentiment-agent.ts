import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

export const sentimentAgent = new Agent({
  name: 'Sentiment Analysis Agent',
  instructions: `
    You analyze recent news, social media, and analyst opinions to gauge market sentiment. Track the market mood and short-term sentiment drivers.
  `,
  model: openai('gpt-4o-mini'),
  tools: {},
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});
