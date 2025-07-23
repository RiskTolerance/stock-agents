import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { analystAgent } from '../agents/layer1_dataCollectionAgents/analyst-agent.ts';
import { companySummaryAgent } from '../agents/layer1_dataCollectionAgents/company-summary-agent.ts';
import { insiderAgent } from '../agents/layer1_dataCollectionAgents/insider-agent.ts';
// import { marketSentimentAgent } from '../agents/layer1_dataCollectionAgents/market-sentiment-agent.ts';
import { newsAgent } from '../agents/layer1_dataCollectionAgents/news-agent.ts';
import { technicalAgent } from '../agents/layer1_dataCollectionAgents/technical-agent.ts';
import { balanceSheetAgent } from '../agents/layer1_dataCollectionAgents/company-statement-agents/balance-sheet-agent.ts';
import { balanceSheetStatementGrowthAgent } from '../agents/layer1_dataCollectionAgents/company-statement-agents/balance-sheet-statement-growth-agent.ts';
import { cashFlowAgent } from '../agents/layer1_dataCollectionAgents/company-statement-agents/cash-flow-agent.ts';
import { cashFlowStatementGrowthAgent } from '../agents/layer1_dataCollectionAgents/company-statement-agents/cash-flow-statement-growth-agent.ts';
// import { financialRatiosAgent } from '../agents/layer1_dataCollectionAgents/company-statement-agents/financial-ratios-agent.ts';
import { incomeStatementAgent } from '../agents/layer1_dataCollectionAgents/company-statement-agents/income-statement-agent.ts';
import { keyMetricsAgent } from '../agents/layer1_dataCollectionAgents/company-statement-agents/key-metrics-agent.ts';
import { otherStatementAgent } from '../agents/layer1_dataCollectionAgents/company-statement-agents/other-statement-agent.ts';
import { bullishAgent } from '../agents/layer2_reasoningAgents/bullish-agent.ts';
import { bearishAgent } from '../agents/layer2_reasoningAgents/bearish-agent.ts';
import { bullishRebuttalAgent } from '../agents/layer3_reasoningRebuttalAgents/bullish-rebuttal-agent.ts';
import { bearishRebuttalAgent } from '../agents/layer3_reasoningRebuttalAgents/bearish-rebuttal-agent.ts';
import { decisionAgent } from '../agents/layer4_decisionAgents/decision-agent.ts';

const contextSchema = z.object({
	symbol: z.string(),
	layer1_data: z
		.object({
			analyst: z.any().optional(),
			company_summary: z.any().optional(),
			insider: z.any().optional(),
			// market_sentiment: z.any().optional(),
			news: z.any().optional(),
			technical: z.any().optional(),
			balance_sheet: z.any().optional(),
			balance_sheet_growth: z.any().optional(),
			cash_flow: z.any().optional(),
			cash_flow_growth: z.any().optional(),
			// financial_ratios: z.any().optional(),
			income_statement: z.any().optional(),
			income_statement_growth: z.any().optional(),
			key_metrics: z.any().optional(),
			other_statement: z.any().optional(),
		})
		.optional(),
	layer2_reasoning: z
		.object({
			bullish: z.any().optional(),
			bearish: z.any().optional(),
		})
		.optional(),
	layer3_rebuttals: z
		.object({
			bullish: z.any().optional(),
			bearish: z.any().optional(),
		})
		.optional(),
});

const layer1_dataCollectionStep = createStep({
	id: 'layer1-data-collection',
	description: 'Run all Layer 1 data collection agents',
	inputSchema: contextSchema,
	outputSchema: contextSchema,
	execute: async ({ inputData }) => {
		const allLayer1Agents = {
			analyst: analystAgent,
			company_summary: companySummaryAgent,
			insider: insiderAgent,
			// market_sentiment: marketSentimentAgent,
			news: newsAgent,
			technical: technicalAgent,
			balance_sheet: balanceSheetAgent,
			balance_sheet_growth: balanceSheetStatementGrowthAgent,
			cash_flow: cashFlowAgent,
			cash_flow_growth: cashFlowStatementGrowthAgent,
			// financial_ratios: financialRatiosAgent,
			income_statement: incomeStatementAgent,
			key_metrics: keyMetricsAgent,
			other_statement: otherStatementAgent,
		};

		const promises = Object.entries(allLayer1Agents).map(
			async ([key, agent]) => {
				const result = await agent.stream([
					{
						role: 'user',
						content: `Analyze data for stock symbol: ${inputData.symbol}`,
					},
				]);
				let output = '';
				for await (const chunk of result.textStream) {
					output += chunk;
				}
				return { [key]: output };
			}
		);

		const results = await Promise.all(promises);
		const layer1_data = Object.assign({}, ...results);

		return { ...inputData, layer1_data };
	},
});

const layer2_reasoningStep = createStep({
	id: 'layer2-reasoning',
	description: 'Run bullish and bearish reasoning agents',
	inputSchema: contextSchema,
	outputSchema: contextSchema,
	execute: async ({ inputData }) => {
		const bullishPromise = bullishAgent.stream([
			{
				role: 'user',
				content: `Given the following context, argue the bull case for this stock information:\n${JSON.stringify(
					inputData.layer1_data
				)}`,
			},
		]);
		const bearishPromise = bearishAgent.stream([
			{
				role: 'user',
				content: `Given the following context, argue the bear case for this stock information:\n${JSON.stringify(
					inputData.layer1_data
				)}`,
			},
		]);

		const [bullishResult, bearishResult] = await Promise.all([
			bullishPromise,
			bearishPromise,
		]);

		let bullishOutput = '';
		for await (const chunk of bullishResult.textStream) {
			bullishOutput += chunk;
		}

		let bearishOutput = '';
		for await (const chunk of bearishResult.textStream) {
			bearishOutput += chunk;
		}

		return {
			...inputData,
			layer2_reasoning: { bullish: bullishOutput, bearish: bearishOutput },
		};
	},
});

const layer3_rebuttalStep = createStep({
	id: 'layer3-rebuttal',
	description: 'Run bullish and bearish rebuttal agents',
	inputSchema: contextSchema,
	outputSchema: contextSchema,
	execute: async ({ inputData }) => {
		const bullishRebuttalPromise = bullishRebuttalAgent.stream([
			{
				role: 'user',
				content: `Given the following context, rebut the bear case:\n${JSON.stringify(
					inputData
				)}`,
			},
		]);
		const bearishRebuttalPromise = bearishRebuttalAgent.stream([
			{
				role: 'user',
				content: `Given the following context, rebut the bull case:\n${JSON.stringify(
					inputData
				)}`,
			},
		]);

		const [bullishRebuttalResult, bearishRebuttalResult] = await Promise.all([
			bullishRebuttalPromise,
			bearishRebuttalPromise,
		]);

		let bullishRebuttalOutput = '';
		for await (const chunk of bullishRebuttalResult.textStream) {
			bullishRebuttalOutput += chunk;
		}

		let bearishRebuttalOutput = '';
		for await (const chunk of bearishRebuttalResult.textStream) {
			bearishRebuttalOutput += chunk;
		}

		return {
			...inputData,
			layer3_rebuttals: {
				bullish: bullishRebuttalOutput,
				bearish: bearishRebuttalOutput,
			},
		};
	},
});

const layer4_decisionStep = createStep({
	id: 'layer4-decision',
	description: 'Run trader/decision agent',
	inputSchema: contextSchema,
	outputSchema: z.object({
		decision: z.string(),
		context: contextSchema,
	}),
	execute: async ({ inputData }) => {
		const result = await decisionAgent.stream([
			{
				role: 'user',
				content: `Given the following context, make a final trading decision (BUY, SELL, HOLD) for ${
					inputData.symbol
				}:\n${JSON.stringify(inputData)}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) {
			output += chunk;
		}
		return { decision: output.trim() || 'HOLD', context: inputData };
	},
});

export const tradingWorkflow = createWorkflow({
	id: 'trading-workflow',
	inputSchema: z.object({ symbol: z.string() }),
	outputSchema: z.object({
		decision: z.string(),
		context: contextSchema,
	}),
})
	.then(layer1_dataCollectionStep)
	.then(layer2_reasoningStep)
	.then(layer3_rebuttalStep)
	.then(layer4_decisionStep);

tradingWorkflow.commit();
