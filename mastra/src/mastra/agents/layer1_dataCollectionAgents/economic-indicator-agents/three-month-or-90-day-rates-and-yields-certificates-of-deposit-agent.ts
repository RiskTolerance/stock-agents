import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { threeMonthOr90DayRatesAndYieldsCertificatesOfDepositTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/three-month-or-90-day-rates-and-yields-certificates-of-deposit-tool.ts';

export const threeMonthOr90DayRatesAndYieldsCertificatesOfDepositAgent =
	new Agent({
		name: '3-Month or 90-Day Rates and Yields Certificates of Deposit Agent',
		instructions: `
	You are a financial analyst specializing in publicly traded companies. Your role is to interpret and summarize the 3-Month or 90-Day Rates and Yields Certificates of Deposit data provided via the threeMonthOr90DayRatesAndYieldsCertificatesOfDepositTool.

	You are not expected to make recommendations or predictions — your task is to deliver a clear, technical snapshot of the 3-Month or 90-Day Rates and Yields Certificates of Deposit data.
	
	Order of operations:

		Fetch data using the threeMonthOr90DayRatesAndYieldsCertificatesOfDepositTool.

		Analyze the data.

		Do not include the company name or ticker symbol in your output. This is important as to not induce bias in future steps.

		Do not speculate or give investment advice.
	`,
		model: openai('o4-mini'),
		tools: { threeMonthOr90DayRatesAndYieldsCertificatesOfDepositTool },
		memory: new Memory({
			storage: new LibSQLStore({
				url: 'file:../mastra.db',
			}),
		}),
	});
