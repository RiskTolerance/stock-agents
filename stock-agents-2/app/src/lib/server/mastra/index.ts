// IMPORTANT: Import env setup FIRST before any agents/workflows
import './env.js';

import { Mastra } from '@mastra/core/mastra';
import { PostgresStore } from '@mastra/pg';
import { env } from '$env/dynamic/private';

// Import all Layer 1 agents
import { analystAgent } from './agents/analyst.js';
import { companyAgent } from './agents/company.js';
import { insiderAgent } from './agents/insider.js';
import { newsAgent } from './agents/news.js';
import { technicalAgent } from './agents/technical.js';
import { economicAgent } from './agents/economic.js';

// Import Layer 2 reasoning agents
import { bullishAgent } from './agents/bullish.js';
import { bearishAgent } from './agents/bearish.js';

// Import Layer 3 rebuttal agents
import { bullishRebuttalAgent } from './agents/bullish-rebuttal.js';
import { bearishRebuttalAgent } from './agents/bearish-rebuttal.js';

// Import Layer 4 decision agent
import { decisionAgent } from './agents/decision.js';

// Import account manager agent
import { accountManagerAgent } from './agents/account-manager.js';

// Import company statement agents
import { incomeStatementAgent } from './agents/company-statements/income-statement.js';
import { balanceSheetAgent } from './agents/company-statements/balance-sheet.js';
import { cashFlowAgent } from './agents/company-statements/cash-flow.js';
import { financialRatiosAgent } from './agents/company-statements/financial-ratios.js';
import { keyMetricsAgent } from './agents/company-statements/key-metrics.js';
import { otherStatementAgent } from './agents/company-statements/other-statement.js';
import { incomeStatementGrowthAgent } from './agents/company-statements/income-statement-growth.js';
import { balanceSheetGrowthAgent } from './agents/company-statements/balance-sheet-growth.js';
import { cashFlowGrowthAgent } from './agents/company-statements/cash-flow-growth.js';

// Import workflows
import { analyzeStockWorkflow } from './workflows/analyze-stock';
import { executeTradeWorkflow } from './workflows/execute-trade';
// Note: autonomous-trading workflow removed - agent is now truly autonomous and invoked directly

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Verify workflow is defined
if (!analyzeStockWorkflow) {
	throw new Error('analyzeStockWorkflow is not defined');
}

export const mastra = new Mastra({
	// Register all agents (Layer 1: 15 agents, Layer 2: 2 agents, Layer 3: 2 agents, Layer 4: 1 agent)
	agents: {
		// Layer 1: Data Collection Agents
		analystAgent,
		companyAgent,
		insiderAgent,
		newsAgent,
		technicalAgent,
		economicAgent,
		// Company statement agents
		incomeStatementAgent,
		balanceSheetAgent,
		cashFlowAgent,
		financialRatiosAgent,
		keyMetricsAgent,
		otherStatementAgent,
		incomeStatementGrowthAgent,
		balanceSheetGrowthAgent,
		cashFlowGrowthAgent,
		// Layer 2: Reasoning Agents
		bullishAgent,
		bearishAgent,
		// Layer 3: Rebuttal Agents
		bullishRebuttalAgent,
		bearishRebuttalAgent,
		// Layer 4: Decision Agent
		decisionAgent,
		// Account Manager Agent (autonomous trading)
		accountManagerAgent
	},
	workflows: { 
		'analyze-stock': analyzeStockWorkflow,
		'execute-trade': executeTradeWorkflow
		// Note: autonomous-trading workflow removed - agent is invoked directly by heartbeat
	},
	storage: new PostgresStore({
		connectionString: env.DATABASE_URL
	})
});

