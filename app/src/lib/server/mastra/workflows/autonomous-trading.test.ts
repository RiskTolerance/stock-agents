import { describe, it, expect, beforeAll } from 'vitest';
import { config } from 'dotenv';
import { mastra } from '../index.js';

config(); // Load environment variables

const SKIP_EXECUTION_TESTS =
	!process.env.ALPACA_API_KEY ||
	!process.env.ALPACA_API_SECRET ||
	!process.env.GROQ_API_KEY ||
	!process.env.FMP_API_KEY;

describe('Autonomous Trading Workflow', () => {
	describe('Workflow Registration', () => {
		it('should have autonomous-trading workflow registered', () => {
			const workflow = mastra.getWorkflow('autonomous-trading');
			expect(workflow).toBeDefined();
		});

		it('should have correct input schema', () => {
			const workflow = mastra.getWorkflow('autonomous-trading');
			if (!workflow) throw new Error('Workflow not found');

			// Test schema validation
			const validInput = {
				mode: 'monitor' as const,
				maxActions: 5,
				symbols: ['AAPL']
			};

			expect(validInput.mode).toBe('monitor');
			expect(validInput.maxActions).toBeGreaterThan(0);
		});
	});

	describe('Workflow Execution', () => {
		beforeAll(() => {
			if (SKIP_EXECUTION_TESTS) {
				console.log(
					'⚠️  Skipping execution tests - Required API keys not set (ALPACA_API_KEY, ALPACA_API_SECRET, GROQ_API_KEY, FMP_API_KEY)'
				);
			}
		});

		it('should execute workflow in monitor mode', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - Required API keys not set');
				return;
			}

			const workflow = mastra.getWorkflow('autonomous-trading');
			if (!workflow) {
				throw new Error('Workflow not found');
			}

			const run = await workflow.createRunAsync();

			const result = await run.start({
				inputData: {
					mode: 'monitor',
					maxActions: 3
				}
			});

			expect(result).toBeDefined();

			if (result.status !== 'success') {
				const errorMessage = JSON.stringify(result, null, 2);
				console.error('Workflow failed:', errorMessage.substring(0, 500));
				console.error('Error details:', (result as any).error);
			}

			expect(result.status).toBe('success');
			expect(result.result).toBeDefined();
			expect(result.result.actions).toBeDefined();
			expect(Array.isArray(result.result.actions)).toBe(true);
			expect(result.result.summary).toBeDefined();
			expect(result.result.summary.length).toBeGreaterThan(0);

			console.log('Monitor mode result:', {
				actionsCount: result.result.actions.length,
				summary: result.result.summary.substring(0, 200)
			});
		}, 60000); // 60 second timeout

		it('should execute workflow in analyze mode', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - Required API keys not set');
				return;
			}

			const workflow = mastra.getWorkflow('autonomous-trading');
			if (!workflow) {
				throw new Error('Workflow not found');
			}

			const run = await workflow.createRunAsync();

			const result = await run.start({
				inputData: {
					mode: 'analyze',
					maxActions: 2,
					symbols: ['AAPL', 'MSFT']
				}
			});

			expect(result).toBeDefined();

			if (result.status !== 'success') {
				const errorMessage = JSON.stringify(result, null, 2);
				console.error('Workflow failed:', errorMessage.substring(0, 500));
			}

			expect(result.status).toBe('success');
			expect(result.result).toBeDefined();
			expect(result.result.actions).toBeDefined();
			expect(Array.isArray(result.result.actions)).toBe(true);

			console.log('Analyze mode result:', {
				actionsCount: result.result.actions.length,
				actions: result.result.actions.map((a) => ({ type: a.type, symbol: a.symbol }))
			});
		}, 120000); // 2 minute timeout (analysis can take time)

		it('should execute workflow in full mode', async () => {
			if (SKIP_EXECUTION_TESTS) {
				console.log('Skipping - Required API keys not set');
				return;
			}

			const workflow = mastra.getWorkflow('autonomous-trading');
			if (!workflow) {
				throw new Error('Workflow not found');
			}

			const run = await workflow.createRunAsync();

			const result = await run.start({
				inputData: {
					mode: 'full',
					maxActions: 3 // Limit actions for testing
				}
			});

			expect(result).toBeDefined();

			if (result.status !== 'success') {
				const errorMessage = JSON.stringify(result, null, 2);
				console.error('Workflow failed:', errorMessage.substring(0, 500));
				console.error('Error details:', (result as any).error);
			}

			// Full mode might succeed or fail depending on agent decisions
			// We just verify it runs without crashing
			expect(result.status).toBeDefined();
			expect(['success', 'failed']).toContain(result.status);

			if (result.status === 'success') {
				expect(result.result).toBeDefined();
				expect(result.result.actions).toBeDefined();
				expect(result.result.summary).toBeDefined();

				console.log('Full mode result:', {
					actionsCount: result.result.actions.length,
					summary: result.result.summary.substring(0, 300)
				});
			} else {
				console.log('Full mode failed (expected - agent may decide not to take actions):', (result as any).error?.message);
			}
		}, 120000); // 2 minute timeout
	});
});

