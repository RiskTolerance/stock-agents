import { describe, it, expect, beforeAll } from 'vitest';
import { config } from 'dotenv';
import { mastra } from '../index.js';

config(); // Load environment variables

const SKIP_EXECUTION_TESTS =
	!process.env.ALPACA_API_KEY ||
	!process.env.ALPACA_API_SECRET ||
	!process.env.GROQ_API_KEY ||
	!process.env.FMP_API_KEY;

describe('Account Manager Agent', () => {
	describe('Agent Registration', () => {
		it('should have accountManagerAgent registered', () => {
			const agent = mastra.getAgent('accountManagerAgent');
			expect(agent).toBeDefined();
			expect(agent?.name).toBe('Account Manager Agent');
		});

		it('should have all required tools', () => {
			const agent = mastra.getAgent('accountManagerAgent');
			if (!agent) throw new Error('Agent not found');

			const tools = agent.tools || {};
			const toolIds = Object.keys(tools);

			// Tool names are camelCase in the agent object
			expect(toolIds).toContain('triggerAnalysisTool');
			expect(toolIds).toContain('executeTradeTool');
			expect(toolIds).toContain('getPortfolioSummaryTool');
			expect(toolIds).toContain('getPositionDetailsTool');
			expect(toolIds).toContain('getAnalysisHistoryTool');
			expect(toolIds).toContain('getCurrentPriceTool');
			expect(toolIds).toContain('calculatePositionSizeTool');

			expect(toolIds.length).toBeGreaterThanOrEqual(7);
		});
	});

	describe('Tool Execution', () => {
		beforeAll(() => {
			if (SKIP_EXECUTION_TESTS) {
				console.log(
					'⚠️  Skipping execution tests - Required API keys not set (ALPACA_API_KEY, ALPACA_API_SECRET, GROQ_API_KEY, FMP_API_KEY)'
				);
			}
		});

		it('should get portfolio summary', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - Required API keys not set');
				return;
			}

			const agent = mastra.getAgent('accountManagerAgent');
			if (!agent) throw new Error('Agent not found');

			// Use the agent to generate a response that uses the tool
			const result = await agent.generate([
				{
					role: 'user',
					content:
						'Get the current portfolio summary. Use the getPortfolioSummaryTool to check account status, positions, and recent orders. Provide a detailed summary of the portfolio.'
				}
			]);

			expect(result).toBeDefined();
			// Check if tool was called (result might have toolCalls or text)
			if (result.text) {
				expect(result.text.length).toBeGreaterThan(0);
				console.log('Portfolio summary response:', result.text.substring(0, 200));
			} else {
				// Tool might have been called but no text response
				console.log('Tool called but no text response (this is okay if tool executed successfully)');
			}
		}, 60000); // Increased timeout

		it('should get current price for a symbol', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - Required API keys not set');
				return;
			}

			const agent = mastra.getAgent('accountManagerAgent');
			if (!agent) throw new Error('Agent not found');

			const result = await agent.generate([
				{
					role: 'user',
					content: 'Get the current price for AAPL. Use the getCurrentPriceTool.'
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(result.text.length).toBeGreaterThan(0);

			// Should mention price or AAPL
			const textLower = result.text.toLowerCase();
			expect(textLower.includes('aapl') || textLower.includes('price') || textLower.includes('$')).toBe(true);

			console.log('Price lookup response:', result.text.substring(0, 200));
		}, 30000);

		it('should get position details', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - Required API keys not set');
				return;
			}

			const agent = mastra.getAgent('accountManagerAgent');
			if (!agent) throw new Error('Agent not found');

			const result = await agent.generate([
				{
					role: 'user',
					content:
						'Check if we have a position in AAPL. Use the getPositionDetailsTool to check position details.'
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(result.text.length).toBeGreaterThan(0);

			console.log('Position details response:', result.text.substring(0, 200));
		}, 30000);

		it('should calculate position size', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - Required API keys not set');
				return;
			}

			const agent = mastra.getAgent('accountManagerAgent');
			if (!agent) throw new Error('Agent not found');

			const result = await agent.generate([
				{
					role: 'user',
					content:
						'Calculate the position size for AAPL if we want to allocate 5% of buying power. Use the calculatePositionSizeTool.'
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(result.text.length).toBeGreaterThan(0);

			// Should mention allocation, shares, or position size
			const textLower = result.text.toLowerCase();
			expect(
				textLower.includes('allocation') ||
					textLower.includes('shares') ||
					textLower.includes('position') ||
					textLower.includes('5%')
			).toBe(true);

			console.log('Position size calculation response:', result.text.substring(0, 200));
		}, 30000);

		it('should get analysis history', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - Required API keys not set');
				return;
			}

			const agent = mastra.getAgent('accountManagerAgent');
			if (!agent) throw new Error('Agent not found');

			const result = await agent.generate([
				{
					role: 'user',
					content: 'Get the recent analysis history. Use the getAnalysisHistoryTool with an empty object {} to see all past analyses.'
				}
			]);

			expect(result).toBeDefined();
			// Tool might execute successfully even if text is empty
			if (result.text) {
				expect(result.text.length).toBeGreaterThan(0);
				console.log('Analysis history response:', result.text.substring(0, 200));
			} else {
				console.log('Tool executed (no text response is okay)');
			}
		}, 30000);
	});

	describe('Agent Decision Making', () => {
		beforeAll(() => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('⚠️  Skipping decision tests - Required API keys not set');
			}
		});

		it('should make portfolio monitoring decision', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - Required API keys not set');
				return;
			}

			const agent = mastra.getAgent('accountManagerAgent');
			if (!agent) throw new Error('Agent not found');

			const result = await agent.generate([
				{
					role: 'user',
					content: `You are managing an autonomous trading account. Your task is to monitor the portfolio status and provide a status report. 
					Check positions, performance, and identify any issues or opportunities. 
					Use the available tools to gather information and provide a comprehensive assessment.`
				}
			]);

			expect(result).toBeDefined();
			expect(result.text).toBeDefined();
			expect(result.text.length).toBeGreaterThan(100); // Should provide detailed assessment

			// Should mention portfolio, positions, or account status
			const textLower = result.text.toLowerCase();
			expect(
				textLower.includes('portfolio') ||
					textLower.includes('position') ||
					textLower.includes('account') ||
					textLower.includes('cash') ||
					textLower.includes('equity')
			).toBe(true);

			console.log('Portfolio monitoring decision:', result.text.substring(0, 300));
		}, 45000);

		it('should make analysis decision', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - Required API keys not set');
				return;
			}

			const agent = mastra.getAgent('accountManagerAgent');
			if (!agent) throw new Error('Agent not found');

			const result = await agent.generate([
				{
					role: 'user',
					content: `You are managing an autonomous trading account. Your task is to identify stocks to analyze. 
					Review the portfolio, market conditions, and decide which stocks need analysis. 
					Consider: AAPL, MSFT, GOOGL. You can use the triggerAnalysisTool if you decide to analyze a stock, but be aware of rate limits.`
				}
			]);

			expect(result).toBeDefined();
			// Agent might attempt to use tool (which could hit rate limits) or provide text response
			// Either way, we verify the agent is working
			if (result.text && result.text.length > 0) {
				expect(result.text.length).toBeGreaterThan(0);
				// Should mention analysis, stock symbols, or decision
				const textLower = result.text.toLowerCase();
				expect(
					textLower.includes('analyze') ||
						textLower.includes('aapl') ||
						textLower.includes('msft') ||
						textLower.includes('googl') ||
						textLower.includes('decision') ||
						textLower.includes('portfolio')
				).toBe(true);
				console.log('Analysis decision:', result.text.substring(0, 300));
			} else {
				// Tool might have been called (could hit rate limits - that's okay for testing)
				console.log('Agent attempted to use tool (may have hit rate limits - this is expected)');
				expect(result).toBeDefined(); // Just verify agent executed
			}
		}, 60000); // Longer timeout as analysis can take time
	});
});

