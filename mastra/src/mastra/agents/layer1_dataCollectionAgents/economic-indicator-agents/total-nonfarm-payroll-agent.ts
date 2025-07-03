import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { totalNonfarmPayrollTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/total-nonfarm-payroll-tool.ts';

export const totalNonfarmPayrollAgent = new Agent({
	name: 'Total Nonfarm Payroll Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Total Nonfarm Payroll data provided via the totalNonfarmPayrollTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Total Nonfarm Payroll data.
	
	Order of operations:

		Fetch data using the totalNonfarmPayrollTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('o4-mini'),
	tools: { totalNonfarmPayrollTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
