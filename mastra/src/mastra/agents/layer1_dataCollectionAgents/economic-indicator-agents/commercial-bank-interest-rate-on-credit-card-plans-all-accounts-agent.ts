import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { commercialBankInterestRateOnCreditCardPlansAllAccountsTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/commercial-bank-interest-rate-on-credit-card-plans-all-accounts-tool.ts';

export const commercialBankInterestRateOnCreditCardPlansAllAccountsAgent = new Agent({
	name: 'Commercial Bank Interest Rate on Credit Card Plans All Accounts Agent',
	instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the Commercial Bank Interest Rate on Credit Card Plans All Accounts data provided via the commercialBankInterestRateOnCreditCardPlansAllAccountsTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the Commercial Bank Interest Rate on Credit Card Plans All Accounts data.
	
	Order of operations:

		Fetch data using the commercialBankInterestRateOnCreditCardPlansAllAccountsTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
	model: openai('gpt-4o'),
	tools: { commercialBankInterestRateOnCreditCardPlansAllAccountsTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
