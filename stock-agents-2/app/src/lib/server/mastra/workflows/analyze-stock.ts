import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ============================================================================
// Schema Definitions
// ============================================================================

const contextSchema = z.object({
	symbol: z.string(),
	layer1Data: z.any().optional(),
	layer2Reasoning: z.any().optional(),
	layer3Rebuttals: z.any().optional()
});

// ============================================================================
// Helper: Create Data Collection Step from Agent
// ============================================================================

function createDataStep(id: string, agentName: string) {
	return createStep({
		id,
		inputSchema: z.object({ symbol: z.string() }),
		outputSchema: z.object({ [id]: z.string() }),
		execute: async ({ inputData, mastra }) => {
			const { symbol } = inputData;
			const agent = mastra.getAgent(agentName);

			const result = await agent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${symbol}`
				}
			]);

			return { [id]: result.text };
		}
	});
}

// ============================================================================
// Layer 1: Data Collection Steps (15 agents in batches to avoid rate limits)
// ============================================================================

// Split into batches to avoid hitting Groq rate limits
// Batch 1: Core company data (5 agents)
const layer1Batch1 = [
	createDataStep('analyst', 'analystAgent'),
	createDataStep('company', 'companyAgent'),
	createDataStep('income_statement', 'incomeStatementAgent'),
	createDataStep('balance_sheet', 'balanceSheetAgent'),
	createDataStep('cash_flow', 'cashFlowAgent')
];

// Batch 2: Financial metrics and ratios (5 agents)
const layer1Batch2 = [
	createDataStep('financial_ratios', 'financialRatiosAgent'),
	createDataStep('key_metrics', 'keyMetricsAgent'),
	createDataStep('other_statement', 'otherStatementAgent'),
	createDataStep('income_statement_growth', 'incomeStatementGrowthAgent'),
	createDataStep('balance_sheet_growth', 'balanceSheetGrowthAgent')
];

// Batch 3: Market data and growth (5 agents)
const layer1Batch3 = [
	createDataStep('cash_flow_growth', 'cashFlowGrowthAgent'),
	createDataStep('insider', 'insiderAgent'),
	createDataStep('news', 'newsAgent'),
	createDataStep('technical', 'technicalAgent'),
	createDataStep('economic', 'economicAgent')
];

// ============================================================================
// Combine Layer 1 Batches
// ============================================================================

// Combine batch 1 results
const combineBatch1Step = createStep({
	id: 'combine-batch1',
	inputSchema: z.object({
		analyst: z.object({ analyst: z.string() }),
		company: z.object({ company: z.string() }),
		income_statement: z.object({ income_statement: z.string() }),
		balance_sheet: z.object({ balance_sheet: z.string() }),
		cash_flow: z.object({ cash_flow: z.string() })
	}),
	outputSchema: z.object({ batch1: z.any() }),
	execute: async ({ inputData }) => {
		return {
			batch1: {
				analyst: inputData.analyst.analyst,
				company: inputData.company.company,
				income_statement: inputData.income_statement.income_statement,
				balance_sheet: inputData.balance_sheet.balance_sheet,
				cash_flow: inputData.cash_flow.cash_flow
			}
		};
	}
});

// Pass symbol through for batch 2
const passSymbolForBatch2Step = createStep({
	id: 'pass-symbol-batch2',
	inputSchema: z.object({ batch1: z.any() }),
	outputSchema: z.object({ symbol: z.string() }),
	execute: async ({ getInitData }) => {
		const { symbol } = getInitData();
		return { symbol };
	}
});

// Combine batch 2 results
const combineBatch2Step = createStep({
	id: 'combine-batch2',
	inputSchema: z.object({
		financial_ratios: z.object({ financial_ratios: z.string() }),
		key_metrics: z.object({ key_metrics: z.string() }),
		other_statement: z.object({ other_statement: z.string() }),
		income_statement_growth: z.object({ income_statement_growth: z.string() }),
		balance_sheet_growth: z.object({ balance_sheet_growth: z.string() })
	}),
	outputSchema: z.object({ batch2: z.any() }),
	execute: async ({ inputData }) => {
		return {
			batch2: {
				financial_ratios: inputData.financial_ratios.financial_ratios,
				key_metrics: inputData.key_metrics.key_metrics,
				other_statement: inputData.other_statement.other_statement,
				income_statement_growth: inputData.income_statement_growth.income_statement_growth,
				balance_sheet_growth: inputData.balance_sheet_growth.balance_sheet_growth
			}
		};
	}
});

// Pass symbol through for batch 3
const passSymbolForBatch3Step = createStep({
	id: 'pass-symbol-batch3',
	inputSchema: z.object({ batch2: z.any() }),
	outputSchema: z.object({ symbol: z.string() }),
	execute: async ({ getInitData }) => {
		const { symbol } = getInitData();
		return { symbol };
	}
});

// Combine batch 3 results
const combineBatch3Step = createStep({
	id: 'combine-batch3',
	inputSchema: z.object({
		cash_flow_growth: z.object({ cash_flow_growth: z.string() }),
		insider: z.object({ insider: z.string() }),
		news: z.object({ news: z.string() }),
		technical: z.object({ technical: z.string() }),
		economic: z.object({ economic: z.string() })
	}),
	outputSchema: z.object({ batch3: z.any() }),
	execute: async ({ inputData }) => {
		return {
			batch3: {
				cash_flow_growth: inputData.cash_flow_growth.cash_flow_growth,
				insider: inputData.insider.insider,
				news: inputData.news.news,
				technical: inputData.technical.technical,
				economic: inputData.economic.economic
			}
		};
	}
});

// Final combine step - merges all batches using getStepResult
const combineLayer1Step = createStep({
	id: 'combine-layer1',
	inputSchema: z.object({
		batch3: z.object({ batch3: z.any() })
	}),
	outputSchema: z.object({ layer1Data: z.any(), symbol: z.string() }),
	execute: async ({ inputData, getStepResult, getInitData }) => {
		const { symbol } = getInitData();

		// Get results from previous batch combine steps
		const batch1Result = getStepResult(combineBatch1Step);
		const batch2Result = getStepResult(combineBatch2Step);

		// Merge all batches into a single layer1Data object
		// Each batch result contains { batchN: { ...data... } }
		const layer1Data = {
			...(batch1Result?.batch1 || {}),
			...(batch2Result?.batch2 || {}),
			...(inputData.batch3?.batch3 || {})
		};

		return { layer1Data, symbol };
	}
});

// ============================================================================
// Layer 2: Reasoning Steps (2 agents in parallel)
// ============================================================================

const bullishReasoningStep = createStep({
	id: 'bullish',
	inputSchema: z.object({ layer1Data: z.any(), symbol: z.string() }),
	outputSchema: z.object({ bullish: z.string() }),
	execute: async ({ inputData, mastra }) => {
		const { layer1Data } = inputData;
		const bullishAgent = mastra.getAgent('bullishAgent');

		const result = await bullishAgent.generate([
			{
				role: 'user',
				content: `Given the following context, argue the bull case for this stock information:\n${JSON.stringify(layer1Data)}`
			}
		]);

		return { bullish: result.text };
	}
});

const bearishReasoningStep = createStep({
	id: 'bearish',
	inputSchema: z.object({ layer1Data: z.any(), symbol: z.string() }),
	outputSchema: z.object({ bearish: z.string() }),
	execute: async ({ inputData, mastra }) => {
		const { layer1Data } = inputData;
		const bearishAgent = mastra.getAgent('bearishAgent');

		const result = await bearishAgent.generate([
			{
				role: 'user',
				content: `Given the following context, argue the bear case for this stock information:\n${JSON.stringify(layer1Data)}`
			}
		]);

		return { bearish: result.text };
	}
});

// ============================================================================
// Combine Layer 2 Reasoning
// ============================================================================

const combineLayer2Step = createStep({
	id: 'combine-layer2',
	inputSchema: z.object({
		bullish: z.object({ bullish: z.string() }),
		bearish: z.object({ bearish: z.string() })
	}),
	outputSchema: z.object({ layer2Reasoning: z.any(), layer1Data: z.any(), symbol: z.string() }),
	execute: async ({ inputData, getStepResult }) => {
		// Get Layer 1 data from the combineLayer1Step
		const layer1Result = getStepResult(combineLayer1Step);

		const layer2Reasoning = {
			bullish: inputData.bullish.bullish,
			bearish: inputData.bearish.bearish
		};

		return {
			layer2Reasoning,
			layer1Data: layer1Result.layer1Data,
			symbol: layer1Result.symbol
		};
	}
});

// ============================================================================
// Layer 3: Rebuttal Steps (2 agents in parallel)
// ============================================================================

const bullishRebuttalStep = createStep({
	id: 'bullish_rebuttal',
	inputSchema: z.object({ context: contextSchema }),
	outputSchema: z.object({ bullish_rebuttal: z.string() }),
	execute: async ({ inputData, mastra }) => {
		const { context } = inputData;
		const bullishRebuttalAgent = mastra.getAgent('bullishRebuttalAgent');

		const result = await bullishRebuttalAgent.generate([
			{
				role: 'user',
				content: `Given the following context, rebut the bear case:\n${JSON.stringify(context)}`
			}
		]);

		return { bullish_rebuttal: result.text };
	}
});

const bearishRebuttalStep = createStep({
	id: 'bearish_rebuttal',
	inputSchema: z.object({ context: contextSchema }),
	outputSchema: z.object({ bearish_rebuttal: z.string() }),
	execute: async ({ inputData, mastra }) => {
		const { context } = inputData;
		const bearishRebuttalAgent = mastra.getAgent('bearishRebuttalAgent');

		const result = await bearishRebuttalAgent.generate([
			{
				role: 'user',
				content: `Given the following context, rebut the bull case:\n${JSON.stringify(context)}`
			}
		]);

		return { bearish_rebuttal: result.text };
	}
});

// ============================================================================
// Prepare Context for Rebuttals
// ============================================================================

const prepareRebuttalContextStep = createStep({
	id: 'prepare-rebuttal-context',
	inputSchema: z.object({
		layer2Reasoning: z.any(),
		layer1Data: z.any(),
		symbol: z.string()
	}),
	outputSchema: z.object({ context: contextSchema }),
	execute: async ({ inputData }) => {
		const { layer2Reasoning, layer1Data, symbol } = inputData;

		const context = {
			symbol,
			layer1Data,
			layer2Reasoning
		};

		return { context };
	}
});

// ============================================================================
// Combine Layer 3 Rebuttals
// ============================================================================

const combineLayer3Step = createStep({
	id: 'combine-layer3',
	inputSchema: z.object({
		bullish_rebuttal: z.object({ bullish_rebuttal: z.string() }),
		bearish_rebuttal: z.object({ bearish_rebuttal: z.string() })
	}),
	outputSchema: z.object({ layer3Rebuttals: z.any(), context: contextSchema }),
	execute: async ({ inputData, getStepResult }) => {
		const rebuttalContextResult = getStepResult(prepareRebuttalContextStep);

		const layer3Rebuttals = {
			bullish: inputData.bullish_rebuttal.bullish_rebuttal,
			bearish: inputData.bearish_rebuttal.bearish_rebuttal
		};

		const context = {
			...rebuttalContextResult.context,
			layer3Rebuttals
		};

		return { layer3Rebuttals, context };
	}
});

// ============================================================================
// Layer 4: Decision Step (sequential)
// ============================================================================

const decisionStep = createStep({
	id: 'decision',
	inputSchema: z.object({ context: contextSchema }),
	outputSchema: z.object({ decision: z.string(), context: contextSchema }),
	execute: async ({ inputData, mastra }) => {
		const { context } = inputData;
		const decisionAgent = mastra.getAgent('decisionAgent');

		const result = await decisionAgent.generate([
			{
				role: 'user',
				content: `Given the following context, make a final trading decision (BUY, SELL, HOLD) for ${context.symbol}:\n${JSON.stringify(context)}`
			}
		]);

		return {
			decision: result.text.trim() || 'HOLD',
			context
		};
	}
});

// ============================================================================
// Main Workflow
// ============================================================================

export const analyzeStockWorkflow = createWorkflow({
	id: 'analyze-stock',
	inputSchema: z.object({ symbol: z.string() }),
	outputSchema: z.object({ decision: z.string(), context: contextSchema })
})
	// Layer 1: Parallel data collection in batches (15 agents total, split into 3 batches of 5)
	// This batching prevents hitting Groq rate limits (30 RPM, 8K TPM for Developer plan)
	// Batch 1: Core company data (5 agents)
	.parallel(layer1Batch1)
	.then(combineBatch1Step)
	// Pass symbol through for batch 2
	.then(passSymbolForBatch2Step)
	// Batch 2: Financial metrics and ratios (5 agents)
	.parallel(layer1Batch2)
	.then(combineBatch2Step)
	// Pass symbol through for batch 3
	.then(passSymbolForBatch3Step)
	// Batch 3: Market data and growth (5 agents)
	.parallel(layer1Batch3)
	.then(combineBatch3Step)
	// Combine all batches into final layer1Data
	.then(combineLayer1Step)
	// Layer 2: Parallel reasoning (bullish & bearish)
	.parallel([bullishReasoningStep, bearishReasoningStep])
	.then(combineLayer2Step)
	// Prepare context for rebuttals (takes combineLayer2Step output)
	.then(prepareRebuttalContextStep)
	// Layer 3: Parallel rebuttals (takes prepareRebuttalContextStep output)
	.parallel([bullishRebuttalStep, bearishRebuttalStep])
	.then(combineLayer3Step)
	// Layer 4: Decision (sequential)
	.then(decisionStep)
	.commit();
