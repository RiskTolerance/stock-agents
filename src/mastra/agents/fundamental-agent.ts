import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { vectorQueryTool } from '../tools/vector-query-tool';
import { fundamentalDataTool } from '../tools/fundamental-data-tool';

export const fundamentalAgent = new Agent({
  name: 'Fundamental Analysis Agent',
  instructions: `
    You are a financial analyst specializing in company fundamentals. 
    Fetch and interpret financial statements, earnings, and valuations. 
    Summarize key metrics and provide intrinsic value analysis. 
    Use the financialDataTool to fetch company data.
  `,
  model: openai('gpt-4o'),
  tools: { vectorQueryTool, fundamentalDataTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});