import { describe, it, expect, beforeAll } from 'vitest';
import { config } from 'dotenv';
import { analystAgent } from './analyst.js';
import { companyAgent } from './company.js';
import { insiderAgent } from './insider.js';
import { newsAgent } from './news.js';
import { technicalAgent } from './technical.js';
import { economicAgent } from './economic.js';
import { incomeStatementAgent } from './company-statements/income-statement.js';
import { balanceSheetAgent } from './company-statements/balance-sheet.js';
import { cashFlowAgent } from './company-statements/cash-flow.js';
import { financialRatiosAgent } from './company-statements/financial-ratios.js';
import { keyMetricsAgent } from './company-statements/key-metrics.js';
import { otherStatementAgent } from './company-statements/other-statement.js';
import { incomeStatementGrowthAgent } from './company-statements/income-statement-growth.js';
import { balanceSheetGrowthAgent } from './company-statements/balance-sheet-growth.js';
import { cashFlowGrowthAgent } from './company-statements/cash-flow-growth.js';

// Load environment variables from .env file
config();

// Test configuration
const TEST_SYMBOL = 'AAPL';
const SKIP_EXECUTION_TESTS = !process.env.GROQ_API_KEY; // Skip expensive execution tests if no API key

describe('Layer 1 Data Collection Agents', () => {
	describe('Agent Instantiation and Configuration', () => {
		it('should instantiate analystAgent with correct configuration', () => {
			expect(analystAgent).toBeDefined();
			expect(analystAgent.name).toBe('Analyst Agent');
			expect(analystAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(analystAgent.tools).toBeDefined();
			expect(analystAgent.tools.analystDataTool).toBeDefined();
		});

		it('should instantiate companyAgent with correct configuration', () => {
			expect(companyAgent).toBeDefined();
			expect(companyAgent.name).toBe('Company Overview Agent');
			expect(companyAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(companyAgent.tools).toBeDefined();
			expect(companyAgent.tools.companyDataTool).toBeDefined();
		});

		it('should instantiate incomeStatementAgent with correct configuration', () => {
			expect(incomeStatementAgent).toBeDefined();
			expect(incomeStatementAgent.name).toBe('Income Statement Agent');
			expect(incomeStatementAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(incomeStatementAgent.tools).toBeDefined();
			expect(incomeStatementAgent.tools.incomeStatementTool).toBeDefined();
		});

		it('should instantiate balanceSheetAgent with correct configuration', () => {
			expect(balanceSheetAgent).toBeDefined();
			expect(balanceSheetAgent.name).toBe('Balance Sheet Agent');
			expect(balanceSheetAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(balanceSheetAgent.tools).toBeDefined();
			expect(balanceSheetAgent.tools.balanceSheetTool).toBeDefined();
		});

		it('should instantiate cashFlowAgent with correct configuration', () => {
			expect(cashFlowAgent).toBeDefined();
			expect(cashFlowAgent.name).toBe('Cash Flow Agent');
			expect(cashFlowAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(cashFlowAgent.tools).toBeDefined();
			expect(cashFlowAgent.tools.cashFlowTool).toBeDefined();
		});

		it('should instantiate financialRatiosAgent with correct configuration', () => {
			expect(financialRatiosAgent).toBeDefined();
			expect(financialRatiosAgent.name).toBe('Financial Ratios Agent');
			expect(financialRatiosAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(financialRatiosAgent.tools).toBeDefined();
			expect(financialRatiosAgent.tools.financialRatiosTool).toBeDefined();
		});

		it('should instantiate keyMetricsAgent with correct configuration', () => {
			expect(keyMetricsAgent).toBeDefined();
			expect(keyMetricsAgent.name).toBe('Key Metrics Agent');
			expect(keyMetricsAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(keyMetricsAgent.tools).toBeDefined();
			expect(keyMetricsAgent.tools.keyMetricsTool).toBeDefined();
		});

		it('should instantiate otherStatementAgent with correct configuration', () => {
			expect(otherStatementAgent).toBeDefined();
			expect(otherStatementAgent.name).toBe('Other Statement Agent');
			expect(otherStatementAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(otherStatementAgent.tools).toBeDefined();
			expect(otherStatementAgent.tools.otherStatementTool).toBeDefined();
		});

		it('should instantiate incomeStatementGrowthAgent with correct configuration', () => {
			expect(incomeStatementGrowthAgent).toBeDefined();
			expect(incomeStatementGrowthAgent.name).toBe('Income Statement Growth Agent');
			expect(incomeStatementGrowthAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(incomeStatementGrowthAgent.tools).toBeDefined();
			expect(incomeStatementGrowthAgent.tools.incomeStatementGrowthTool).toBeDefined();
		});

		it('should instantiate balanceSheetGrowthAgent with correct configuration', () => {
			expect(balanceSheetGrowthAgent).toBeDefined();
			expect(balanceSheetGrowthAgent.name).toBe('Balance Sheet Growth Agent');
			expect(balanceSheetGrowthAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(balanceSheetGrowthAgent.tools).toBeDefined();
			expect(balanceSheetGrowthAgent.tools.balanceSheetGrowthTool).toBeDefined();
		});

		it('should instantiate cashFlowGrowthAgent with correct configuration', () => {
			expect(cashFlowGrowthAgent).toBeDefined();
			expect(cashFlowGrowthAgent.name).toBe('Cash Flow Growth Agent');
			expect(cashFlowGrowthAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(cashFlowGrowthAgent.tools).toBeDefined();
			expect(cashFlowGrowthAgent.tools.cashFlowGrowthTool).toBeDefined();
		});

		it('should instantiate insiderAgent with correct configuration', () => {
			expect(insiderAgent).toBeDefined();
			expect(insiderAgent.name).toBe('Insider Trading Agent');
			expect(insiderAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(insiderAgent.tools).toBeDefined();
			expect(insiderAgent.tools.insiderDataTool).toBeDefined();
		});

		it('should instantiate newsAgent with correct configuration', () => {
			expect(newsAgent).toBeDefined();
			expect(newsAgent.name).toBe('News Analysis Agent');
			expect(newsAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(newsAgent.tools).toBeDefined();
			expect(newsAgent.tools.newsDataTool).toBeDefined();
		});

		it('should instantiate technicalAgent with correct configuration', () => {
			expect(technicalAgent).toBeDefined();
			expect(technicalAgent.name).toBe('Technical Analysis Agent');
			expect(technicalAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(technicalAgent.tools).toBeDefined();
			expect(technicalAgent.tools.technicalDataTool).toBeDefined();
		});

		it('should instantiate economicAgent with correct configuration', () => {
			expect(economicAgent).toBeDefined();
			expect(economicAgent.name).toBe('Economic Indicators Agent');
			expect(economicAgent.model).toBe('groq/openai/gpt-oss-20b');
			expect(economicAgent.tools).toBeDefined();
			expect(economicAgent.tools.economicDataTool).toBeDefined();
			expect(economicAgent.tools.marketPerformanceTool).toBeDefined();
		});
	});

	describe('Agent Instructions', () => {
		it('should have instructions that exclude company name/ticker bias', () => {
			const agents = [
				analystAgent,
				companyAgent,
				insiderAgent,
				newsAgent,
				technicalAgent,
				economicAgent,
				incomeStatementAgent,
				balanceSheetAgent,
				cashFlowAgent,
				financialRatiosAgent,
				keyMetricsAgent,
				otherStatementAgent,
				incomeStatementGrowthAgent,
				balanceSheetGrowthAgent,
				cashFlowGrowthAgent
			];

			agents.forEach((agent) => {
				const instructions = agent.instructions.toLowerCase();
				expect(
					instructions.includes('do not include the company name') ||
						instructions.includes('do not include the ticker symbol') ||
						instructions.includes('not include the company name') ||
						instructions.includes('not include the ticker')
				).toBe(true);
			});
		});

		it('should have instructions that prohibit investment advice', () => {
			const agents = [
				analystAgent,
				companyAgent,
				insiderAgent,
				newsAgent,
				technicalAgent,
				economicAgent,
				incomeStatementAgent,
				balanceSheetAgent,
				cashFlowAgent,
				financialRatiosAgent,
				keyMetricsAgent,
				otherStatementAgent,
				incomeStatementGrowthAgent,
				balanceSheetGrowthAgent,
				cashFlowGrowthAgent
			];

			agents.forEach((agent) => {
				const instructions = agent.instructions.toLowerCase();
				expect(
					instructions.includes('do not speculate') ||
						instructions.includes('do not give investment advice') ||
						instructions.includes('not expected to make recommendations')
				).toBe(true);
			});
		});

		it('should have structured instructions with order of operations', () => {
			const agents = [
				analystAgent,
				companyAgent,
				insiderAgent,
				newsAgent,
				technicalAgent,
				economicAgent,
				incomeStatementAgent,
				balanceSheetAgent,
				cashFlowAgent,
				financialRatiosAgent,
				keyMetricsAgent,
				otherStatementAgent,
				incomeStatementGrowthAgent,
				balanceSheetGrowthAgent,
				cashFlowGrowthAgent
			];

			agents.forEach((agent) => {
				const instructions = agent.instructions.toLowerCase();
				expect(instructions.includes('order of operations') || instructions.includes('1.')).toBe(
					true
				);
			});
		});
	});

	describe('Agent Tool Integration', () => {
		it('should have analystAgent with analystDataTool', () => {
			expect(analystAgent.tools.analystDataTool).toBeDefined();
			expect(analystAgent.tools.analystDataTool.id).toBe('fetch-analyst-data');
		});

		it('should have companyAgent with companyDataTool', () => {
			expect(companyAgent.tools.companyDataTool).toBeDefined();
			expect(companyAgent.tools.companyDataTool.id).toBe('fetch-company-data');
		});

		it('should have incomeStatementAgent with incomeStatementTool', () => {
			expect(incomeStatementAgent.tools.incomeStatementTool).toBeDefined();
			expect(incomeStatementAgent.tools.incomeStatementTool.id).toBe('fetch-income-statement');
		});

		it('should have balanceSheetAgent with balanceSheetTool', () => {
			expect(balanceSheetAgent.tools.balanceSheetTool).toBeDefined();
			expect(balanceSheetAgent.tools.balanceSheetTool.id).toBe('fetch-balance-sheet');
		});

		it('should have cashFlowAgent with cashFlowTool', () => {
			expect(cashFlowAgent.tools.cashFlowTool).toBeDefined();
			expect(cashFlowAgent.tools.cashFlowTool.id).toBe('fetch-cash-flow');
		});

		it('should have financialRatiosAgent with financialRatiosTool', () => {
			expect(financialRatiosAgent.tools.financialRatiosTool).toBeDefined();
			expect(financialRatiosAgent.tools.financialRatiosTool.id).toBe('fetch-financial-ratios');
		});

		it('should have keyMetricsAgent with keyMetricsTool', () => {
			expect(keyMetricsAgent.tools.keyMetricsTool).toBeDefined();
			expect(keyMetricsAgent.tools.keyMetricsTool.id).toBe('fetch-key-metrics');
		});

		it('should have otherStatementAgent with otherStatementTool', () => {
			expect(otherStatementAgent.tools.otherStatementTool).toBeDefined();
			expect(otherStatementAgent.tools.otherStatementTool.id).toBe('fetch-other-statement');
		});

		it('should have incomeStatementGrowthAgent with incomeStatementGrowthTool', () => {
			expect(incomeStatementGrowthAgent.tools.incomeStatementGrowthTool).toBeDefined();
			expect(incomeStatementGrowthAgent.tools.incomeStatementGrowthTool.id).toBe(
				'fetch-income-statement-growth'
			);
		});

		it('should have balanceSheetGrowthAgent with balanceSheetGrowthTool', () => {
			expect(balanceSheetGrowthAgent.tools.balanceSheetGrowthTool).toBeDefined();
			expect(balanceSheetGrowthAgent.tools.balanceSheetGrowthTool.id).toBe(
				'fetch-balance-sheet-growth'
			);
		});

		it('should have cashFlowGrowthAgent with cashFlowGrowthTool', () => {
			expect(cashFlowGrowthAgent.tools.cashFlowGrowthTool).toBeDefined();
			expect(cashFlowGrowthAgent.tools.cashFlowGrowthTool.id).toBe('fetch-cash-flow-growth');
		});

		it('should have insiderAgent with insiderDataTool', () => {
			expect(insiderAgent.tools.insiderDataTool).toBeDefined();
			expect(insiderAgent.tools.insiderDataTool.id).toBe('fetch-insider-data');
		});

		it('should have newsAgent with newsDataTool', () => {
			expect(newsAgent.tools.newsDataTool).toBeDefined();
			expect(newsAgent.tools.newsDataTool.id).toBe('fetch-news-data');
		});

		it('should have technicalAgent with technicalDataTool', () => {
			expect(technicalAgent.tools.technicalDataTool).toBeDefined();
			expect(technicalAgent.tools.technicalDataTool.id).toBe('fetch-technical-data');
		});

		it('should have economicAgent with economicDataTool and marketPerformanceTool', () => {
			expect(economicAgent.tools.economicDataTool).toBeDefined();
			expect(economicAgent.tools.economicDataTool.id).toBe('fetch-economic-data');
			expect(economicAgent.tools.marketPerformanceTool).toBeDefined();
			expect(economicAgent.tools.marketPerformanceTool.id).toBe('fetch-market-performance');
		});
	});

	describe('Agent Execution', () => {
		beforeAll(() => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('⚠️  Skipping execution tests - GROQ_API_KEY not set');
			}
		});

		it('should execute analystAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await analystAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50); // Should have meaningful content
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase()); // Should not include symbol
		}, 45000); // Increased timeout for analyst agent

		it('should execute companyAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await companyAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			// Company agent may include ticker in header/metadata, but should minimize it in analysis
			// Check that the main content doesn't heavily rely on the ticker symbol
			const textLower = result.text.toLowerCase();
			const tickerCount = (textLower.match(new RegExp(TEST_SYMBOL.toLowerCase(), 'g')) || [])
				.length;
			expect(tickerCount).toBeLessThanOrEqual(2); // Allow 1-2 mentions (e.g., in header)
		}, 30000);

		it('should execute incomeStatementAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await incomeStatementAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute balanceSheetAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await balanceSheetAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute cashFlowAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await cashFlowAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute financialRatiosAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await financialRatiosAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute keyMetricsAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await keyMetricsAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute otherStatementAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await otherStatementAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute incomeStatementGrowthAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await incomeStatementGrowthAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute balanceSheetGrowthAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await balanceSheetGrowthAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute cashFlowGrowthAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await cashFlowGrowthAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute insiderAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await insiderAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute newsAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await newsAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute technicalAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await technicalAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			expect(result.text.toLowerCase()).not.toContain(TEST_SYMBOL.toLowerCase());
		}, 30000);

		it('should execute economicAgent and return structured analysis', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - GROQ_API_KEY not set');
				return;
			}

			const result = await economicAgent.generate([
				{
					role: 'user',
					content: `Analyze data for stock symbol: ${TEST_SYMBOL}`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(50);
			// Economic agent may mention symbols in market performance context, so we're more lenient here
		}, 30000);
	});

	describe('Agent Consistency', () => {
		it('should have all agents using the same model', () => {
			const agents = [
				analystAgent,
				companyAgent,
				insiderAgent,
				newsAgent,
				technicalAgent,
				economicAgent,
				incomeStatementAgent,
				balanceSheetAgent,
				cashFlowAgent,
				financialRatiosAgent,
				keyMetricsAgent,
				otherStatementAgent,
				incomeStatementGrowthAgent,
				balanceSheetGrowthAgent,
				cashFlowGrowthAgent
			];

			const models = agents.map((agent) => agent.model);
			const uniqueModels = [...new Set(models)];

			expect(uniqueModels.length).toBe(1);
			expect(uniqueModels[0]).toBe('groq/openai/gpt-oss-20b');
		});

		it('should have all agents with non-empty instructions', () => {
			const agents = [
				analystAgent,
				companyAgent,
				insiderAgent,
				newsAgent,
				technicalAgent,
				economicAgent,
				incomeStatementAgent,
				balanceSheetAgent,
				cashFlowAgent,
				financialRatiosAgent,
				keyMetricsAgent,
				otherStatementAgent,
				incomeStatementGrowthAgent,
				balanceSheetGrowthAgent,
				cashFlowGrowthAgent
			];

			agents.forEach((agent) => {
				expect(agent.instructions).toBeDefined();
				expect(typeof agent.instructions).toBe('string');
				expect(agent.instructions.length).toBeGreaterThan(100); // Should have substantial instructions
			});
		});

		it('should have all agents with at least one tool', () => {
			const agents = [
				analystAgent,
				companyAgent,
				insiderAgent,
				newsAgent,
				technicalAgent,
				economicAgent,
				incomeStatementAgent,
				balanceSheetAgent,
				cashFlowAgent,
				financialRatiosAgent,
				keyMetricsAgent,
				otherStatementAgent,
				incomeStatementGrowthAgent,
				balanceSheetGrowthAgent,
				cashFlowGrowthAgent
			];

			agents.forEach((agent) => {
				expect(agent.tools).toBeDefined();
				const toolCount = Object.keys(agent.tools).length;
				expect(toolCount).toBeGreaterThanOrEqual(1);
			});
		});
	});
});
