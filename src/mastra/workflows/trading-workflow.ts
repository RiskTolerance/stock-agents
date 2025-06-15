import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { bullishAgent } from '../agents/bullish-agent';
import { bearishAgent } from '../agents/bearish-agent';
import { decisionAgent } from '../agents/decision-agent';
import { fundamentalAgent } from '../agents/fundamental-agent';
import { sentimentAgent } from '../agents/sentiment-agent';
import { newsAgent } from '../agents/news-agent';
import { technicalAgent } from '../agents/technical-agent';
import { riskAgent } from '../agents/risk-agent';
import { execute } from '../tools/fundamental-data-tool';

const contextSchema = z.object({
	symbol: z.string(),
	memory: z.any().optional(),
	fundamental: z.any().optional(),
	sentiment: z.any().optional(),
	news: z.any().optional(),
	technical: z.any().optional(),
	bullish: z.any().optional(),
	bearish: z.any().optional(),
	risk: z.any().optional(),
});

const fundamentalStep = createStep({
	id: 'fundamental-analysis',
	description: 'Run fundamental analysis agent',
	inputSchema: contextSchema,
	outputSchema: contextSchema,
	execute: async ({ inputData }) => {
		const fundamentalData = await execute({ context: { symbol: inputData.symbol } });
		const result = await fundamentalAgent.stream([
			{
				role: 'user',
				content: `Analyze the fundamentals for stock symbol: ${inputData.symbol}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) {
			output += chunk;
		}
		const { symbol, ...rest } = inputData;
		const obfuscateSymbol = { symbol: '', ...rest };
		return { ...obfuscateSymbol, description: output, fundamentals: fundamentalData };
	},
});

const sentimentStep = createStep({
	id: 'sentiment-analysis',
	description: 'Run sentiment analysis agent',
	inputSchema: contextSchema,
	outputSchema: contextSchema,
	execute: async ({ inputData }) => {
		const result = await sentimentAgent.stream([
			{
				role: 'user',
				content: `Analyze the sentiment for stock symbol: ${inputData.symbol}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) {
			output += chunk;
		}
		return { ...inputData, sentiment: output };
	},
});

const newsStep = createStep({
	id: 'news-analysis',
	description: 'Run news analysis agent',
	inputSchema: contextSchema,
	outputSchema: contextSchema,
	execute: async ({ inputData }) => {
		const result = await newsAgent.stream([
			{
				role: 'user',
				content: `Analyze the news for stock symbol: ${inputData.symbol}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) {
			output += chunk;
		}
		return { ...inputData, news: output };
	},
});

const technicalStep = createStep({
	id: 'technical-analysis',
	description: 'Run technical analysis agent',
	inputSchema: contextSchema,
	outputSchema: contextSchema,
	execute: async ({ inputData }) => {
		const result = await technicalAgent.stream([
			{
				role: 'user',
				content: `Analyze the technicals for stock symbol: ${inputData.symbol}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) {
			output += chunk;
		}
		return { ...inputData, technical: output };
	},
});

const bullishStep = createStep({
	id: 'bullish-research',
	description: 'Run bullish research agent',
	inputSchema: contextSchema,
	outputSchema: contextSchema,
	execute: async ({ inputData }) => {
		const result = await bullishAgent.stream([
			{
				role: 'user',
				content: `Given the following context, argue the bull case for this stock information:\n${JSON.stringify(inputData)}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) {
			output += chunk;
		}
		return { ...inputData, bullish: output };
	},
});

const bearishStep = createStep({
	id: 'bearish-research',
	description: 'Run bearish research agent',
	inputSchema: contextSchema,
	outputSchema: contextSchema,
	execute: async ({ inputData }) => {
		const result = await bearishAgent.stream([
			{
				role: 'user',
				content: `Given the following context, argue the bear case for this stock information:\n${JSON.stringify(inputData)}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) {
			output += chunk;
		}
		return { ...inputData, bearish: output };
	},
});

const riskStep = createStep({
	id: 'risk-management',
	description: 'Run risk management agent',
	inputSchema: contextSchema,
	outputSchema: contextSchema,
	execute: async ({ inputData }) => {
		const result = await riskAgent.stream([
			{
				role: 'user',
				content: `Analyze the risk for stock symbol: ${inputData.symbol}`,
			},
		]);
		let output = '';
		for await (const chunk of result.textStream) {
			output += chunk;
		}
		return { ...inputData, risk: output };
	},
});

const traderStep = createStep({
	id: 'trader-decision',
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
	.then(fundamentalStep)
	// .then(technicalStep)
	// .then(newsStep)
	// .then(sentimentStep)
	.parallel([bullishStep, bearishStep])
	// .then(bearishStep)
	// .then(riskStep)
	.then(traderStep);

tradingWorkflow.commit();
