import { command, query } from '$app/server';
import { z } from 'zod';
import { mastra } from '$lib/server/mastra';
import { db } from '$lib/server/db';
import { reports } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { retryOnRateLimit, analysisThrottle, isRateLimitError } from '$lib/server/mastra/utils/rate-limit.js';

// Schema for stock symbol validation
const symbolSchema = z.object({
	symbol: z.string().min(1).max(10).toUpperCase()
});

/**
 * Trigger stock analysis workflow
 * This runs the full 4-layer analysis pipeline:
 * - Layer 1: Data collection (15 agents in 3 batches)
 * - Layer 2: Bullish/Bearish reasoning
 * - Layer 3: Rebuttals
 * - Layer 4: Final decision
 */
export const analyzeStock = command(
	symbolSchema,
	async ({ symbol }) => {
		// Use throttle to prevent concurrent analyses and retry logic for rate limits
		return await analysisThrottle.execute(async () => {
			return await retryOnRateLimit(
				async () => {
					const workflow = mastra.getWorkflow('analyze-stock');

					if (!workflow) {
						throw new Error('Workflow not found');
					}

					// Create and start the workflow
					const run = await workflow.createRunAsync();
					const result = await run.start({
						inputData: { symbol }
					});

					if (result.status !== 'success') {
						// Log detailed error information
						console.error('Workflow failed:', {
							status: result.status,
							error: (result as any).error,
							steps: (result as any).steps,
							stepResults: (result as any).stepResults
						});

						const errorMessage =
							(result as any).error?.message || JSON.stringify((result as any).error || result.status);

						// Check if it's a rate limit error
						if (isRateLimitError((result as any).error)) {
							throw new Error(`Rate limit error: ${errorMessage}`);
						}

						throw new Error(`Analysis failed: ${errorMessage}`);
					}

					// Save report to database
					const context = result.result.context;
					const [savedReport] = await db
						.insert(reports)
						.values({
							symbol,
							decision: result.result.decision,
							layer1Data: context.layer1Data || null,
							layer2Reasoning: context.layer2Reasoning || null,
							layer3Rebuttals: context.layer3Rebuttals || null,
							// userId: null, // TODO: Add authentication
							// confidence: null, // TODO: Extract confidence from decision
						})
						.returning();

					return {
						success: true,
						id: savedReport.id,
						symbol,
						decision: result.result.decision,
						context: result.result.context,
						timestamp: savedReport.createdAt?.toISOString() || new Date().toISOString()
					};
				},
				{
					maxRetries: 3,
					initialDelayMs: 2000, // Start with 2 seconds
					maxDelayMs: 30000, // Max 30 seconds
					backoffMultiplier: 2
				}
			);
		});
	}
);

/**
 * Get the status of an analysis (for polling if needed)
 */
export const getAnalysisStatus = query(
	z.object({ runId: z.string() }),
	async ({ runId }) => {
		// For future implementation with workflow run tracking
		return {
			runId,
			status: 'completed'
		};
	}
);

