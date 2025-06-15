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
    Fetch and interpret financial data using the financialDataTool. 
    Summarize the financial data in a concise manner. Your response should be short, technical, and to the point. You are not to make any recommendations or predictions based on the data.
    Do not include the name of the company or the compnay stock symbol in your response.
  `,
  model: openai('gpt-4o'),
  tools: { fundamentalDataTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});