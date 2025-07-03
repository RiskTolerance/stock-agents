import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { analystAgent } from '#agents/layer1_dataCollectionAgents/analyst-agent.ts';
import { companySummaryAgent } from '#agents/layer1_dataCollectionAgents/company-summary-agent.ts';
import { insiderAgent } from '#agents/layer1_dataCollectionAgents/insider-agent.ts';
import { marketSentimentAgent } from '#agents/layer1_dataCollectionAgents/market-sentiment-agent.ts';
import { newsAgent } from '#agents/layer1_dataCollectionAgents/news-agent.ts';
import { technicalAgent } from '#agents/layer1_dataCollectionAgents/technical-agent.ts';
import { balanceSheetAgent } from '#agents/layer1_dataCollectionAgents/company-statement-agents/balance-sheet-agent.ts';
import { balanceSheetStatementGrowthAgent } from '#agents/layer1_dataCollectionAgents/company-statement-agents/balance-sheet-statement-growth-agent.ts';
import { cashFlowAgent } from '#agents/layer1_dataCollectionAgents/company-statement-agents/cash-flow-agent.ts';
import { cashFlowStatementGrowthAgent } from '#agents/layer1_dataCollectionAgents/company-statement-agents/cash-flow-statement-growth-agent.ts';
import { financialRatiosAgent } from '#agents/layer1_dataCollectionAgents/company-statement-agents/financial-ratios-agent.ts';
import { incomeStatementAgent } from '#agents/layer1_dataCollectionAgents/company-statement-agents/income-statement-agent.ts';
import { keyMetricsAgent } from '#agents/layer1_dataCollectionAgents/company-statement-agents/key-metrics-agent.ts';
import { otherStatementAgent } from '#agents/layer1_dataCollectionAgents/company-statement-agents/other-statement-agent.ts';
import { bullishAgent } from '#agents/layer2_reasoningAgents/bullish-agent.ts';
import { bearishAgent } from '#agents/layer2_reasoningAgents/bearish-agent.ts';
import { bullishRebuttalAgent } from '#agents/layer3_reasoningRebuttalAgents/bullish-rebuttal-agent.ts';
import { bearishRebuttalAgent } from '#agents/layer3_reasoningRebuttalAgents/bearish-rebuttal-agent.ts';
import { decisionAgent } from '#agents/layer4_decisionAgents/decision-agent.ts';

const contextSchema = z.object({
	symbol: z.string(),
	layer1_data: z.any().optional(),
	layer2_reasoning: z.any().optional(),
	layer3_rebuttals: z.any().optional(),
});

// Layer 1: Data Collection Steps (parallel)
const layer1Steps = [
	createStep({
		id: 'analyst',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ analyst: z.string() }),
		execute: async ({ inputData }) => {
			const result = await analystAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { analyst: output };
		},
	}),
	createStep({
		id: 'company_summary',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ company_summary: z.string() }),
		execute: async ({ inputData }) => {
			const result = await companySummaryAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { company_summary: output };
		},
	}),
	createStep({
		id: 'insider',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ insider: z.string() }),
		execute: async ({ inputData }) => {
			const result = await insiderAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { insider: output };
		},
	}),
	createStep({
		id: 'market_sentiment',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ market_sentiment: z.string() }),
		execute: async ({ inputData }) => {
			const result = await marketSentimentAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { market_sentiment: output };
		},
	}),
	createStep({
		id: 'news',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ news: z.string() }),
		execute: async ({ inputData }) => {
			const result = await newsAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { news: output };
		},
	}),
	createStep({
		id: 'technical',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ technical: z.string() }),
		execute: async ({ inputData }) => {
			const result = await technicalAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { technical: output };
		},
	}),
	createStep({
		id: 'balance_sheet',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ balance_sheet: z.string() }),
		execute: async ({ inputData }) => {
			const result = await balanceSheetAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { balance_sheet: output };
		},
	}),
	createStep({
		id: 'balance_sheet_growth',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ balance_sheet_growth: z.string() }),
		execute: async ({ inputData }) => {
			const result = await balanceSheetStatementGrowthAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { balance_sheet_growth: output };
		},
	}),
	createStep({
		id: 'cash_flow',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ cash_flow: z.string() }),
		execute: async ({ inputData }) => {
			const result = await cashFlowAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { cash_flow: output };
		},
	}),
	createStep({
		id: 'cash_flow_growth',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ cash_flow_growth: z.string() }),
		execute: async ({ inputData }) => {
			const result = await cashFlowStatementGrowthAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { cash_flow_growth: output };
		},
	}),
	createStep({
		id: 'financial_ratios',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ financial_ratios: z.string() }),
		execute: async ({ inputData }) => {
			const result = await financialRatiosAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { financial_ratios: output };
		},
	}),
	createStep({
		id: 'income_statement',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ income_statement: z.string() }),
		execute: async ({ inputData }) => {
			const result = await incomeStatementAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { income_statement: output };
		},
	}),
	createStep({
		id: 'key_metrics',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ key_metrics: z.string() }),
		execute: async ({ inputData }) => {
			const result = await keyMetricsAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { key_metrics: output };
		},
	}),
	createStep({
		id: 'other_statement',
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ other_statement: z.string() }),
		execute: async ({ inputData }) => {
			const result = await otherStatementAgent.stream([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${inputData.symbol}`,
				},
			]);
			let output = '';
			for await (const chunk of result.textStream) output += chunk;
			return { other_statement: output };
		},
	}),
];

// Layer 2: Reasoning Steps (parallel)
const bullishReasoningStep = createStep({
	id: 'bullish',
	inputSchema: z.object({ layer1_data: z.any() }),
	outputSchema: z.object({ bullish: z.string() }),
	execute: async ({ inputData }) => {
		const result = await bullishAgent.stream([
			{
				role: 'user',
				content: `Given the following context, argue the bull case for this stock information:\n${JSON.stringify(
					inputData.layer1_data
				)}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) output += chunk;
		return { bullish: output };
	},
});

const bearishReasoningStep = createStep({
	id: 'bearish',
	inputSchema: z.object({ layer1_data: z.any() }),
	outputSchema: z.object({ bearish: z.string() }),
	execute: async ({ inputData }) => {
		const result = await bearishAgent.stream([
			{
				role: 'user',
				content: `Given the following context, argue the bear case for this stock information:\n${JSON.stringify(
					inputData.layer1_data
				)}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) output += chunk;
		return { bearish: output };
	},
});

// Layer 3: Rebuttal Steps (parallel)
const bullishRebuttalStep = createStep({
	id: 'bullish_rebuttal',
	inputSchema: z.object({ context: contextSchema }),
	outputSchema: z.object({ bullish_rebuttal: z.string() }),
	execute: async ({ inputData }) => {
		const result = await bullishRebuttalAgent.stream([
			{
				role: 'user',
				content: `Given the following context, rebut the bear case:\n${JSON.stringify(
					inputData.context
				)}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) output += chunk;
		return { bullish_rebuttal: output };
	},
});

const bearishRebuttalStep = createStep({
	id: 'bearish_rebuttal',
	inputSchema: z.object({ context: contextSchema }),
	outputSchema: z.object({ bearish_rebuttal: z.string() }),
	execute: async ({ inputData }) => {
		const result = await bearishRebuttalAgent.stream([
			{
				role: 'user',
				content: `Given the following context, rebut the bull case:\n${JSON.stringify(
					inputData.context
				)}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) output += chunk;
		return { bearish_rebuttal: output };
	},
});

// Layer 4: Decision Step (sequential)
const decisionStep = createStep({
	id: 'decision',
	inputSchema: z.object({ context: contextSchema }),
	outputSchema: z.object({ decision: z.string(), context: contextSchema }),
	execute: async ({ inputData }) => {
		const result = await decisionAgent.stream([
			{
				role: 'user',
				content: `Given the following context, make a final trading decision (BUY, SELL, HOLD) for ${
					inputData.context.symbol
				}:\n${JSON.stringify(inputData.context)}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) output += chunk;
		return { decision: output.trim() || 'HOLD', context: inputData.context };
	},
});

// Store .map() steps for getStepResult
let layer1MapStep: any;
let layer2MapStep: any;
let layer3MapStep: any;

// Explicitly type the .map() step functions
const layer1MapStepFn = async ({
	inputData,
	getInitData,
}: {
	inputData: any;
	getInitData: any;
}) => {
	const layer1_data = Object.assign({}, ...Object.values(inputData));
	const { symbol } = getInitData();
	return { symbol, layer1_data };
};
const layer2MapStepFn = async ({
	inputData,
	getInitData,
	getStepResult,
}: {
	inputData: any;
	getInitData: any;
	getStepResult: any;
}) => {
	const layer2_reasoning = {
		bullish: inputData.bullish.bullish,
		bearish: inputData.bearish.bearish,
	};
	const { symbol } = getInitData();
	const prev = getStepResult(layer1MapStep);
	const layer1_data = prev?.layer1_data;
	return { symbol, layer1_data, layer2_reasoning };
};
const layer3MapStepFn = async ({
	inputData,
	getStepResult,
}: {
	inputData: any;
	getStepResult: any;
}) => {
	const prev = getStepResult(layer2MapStep);
	return { context: { ...prev, ...inputData } };
};
const layer4MapStepFn = async ({
	inputData,
	getStepResult,
}: {
	inputData: any;
	getStepResult: any;
}) => {
	const layer3_rebuttals = {
		bullish: inputData.bullish_rebuttal.bullish_rebuttal,
		bearish: inputData.bearish_rebuttal.bearish_rebuttal,
	};
	const prev = getStepResult(layer3MapStep);
	const context = prev?.context || {};
	return { context: { ...context, layer3_rebuttals } };
};

export const tradingWorkflowParallel = createWorkflow({
	id: 'trading-workflow-parallel',
	inputSchema: z.object({ symbol: z.string() }),
	outputSchema: z.object({ decision: z.string(), context: contextSchema }),
})
	// Layer 1: parallel data collection
	.parallel(layer1Steps)
	.map((layer1MapStep = layer1MapStepFn))
	// Layer 2: parallel reasoning
	.parallel([bullishReasoningStep, bearishReasoningStep])
	.map((layer2MapStep = layer2MapStepFn))
	// Layer 3: parallel rebuttals
	.map((layer3MapStep = layer3MapStepFn))
	.parallel([bullishRebuttalStep, bearishRebuttalStep])
	.map(layer4MapStepFn)
	// Layer 4: decision (sequential)
	.then(decisionStep)
	.commit();

tradingWorkflowParallel.commit();
