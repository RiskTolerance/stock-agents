import { mastra } from '../mastra/index.js';
import { db } from '../db/index.js';
import { jobQueue } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { JobPayload } from './types.js';

export interface ExecutionResult {
	success: boolean;
	actions: Array<{
		type: string;
		symbol?: string;
		reasoning: string;
		details?: any;
	}>;
	summary: string;
	error?: string;
}

/**
 * Execute autonomous trading workflow and log to job_queue
 */
export async function executeScheduledJob(
	payload: JobPayload,
	scheduleId: string
): Promise<ExecutionResult> {
	const jobId = crypto.randomUUID();
	const startTime = new Date();

	// Create job record
	const [job] = await db
		.insert(jobQueue)
		.values({
			id: jobId,
			type: 'autonomous_trading',
			payload: payload as any,
			status: 'pending',
			scheduledFor: startTime
		})
		.returning();

	if (!job) {
		throw new Error('Failed to create job record');
	}

	try {
		// Update status to running
		await db
			.update(jobQueue)
			.set({
				status: 'running',
				startedAt: new Date()
			})
			.where(eq(jobQueue.id, jobId));

		// Get workflow
		const workflow = mastra.getWorkflow('autonomous-trading');
		if (!workflow) {
			throw new Error('autonomous-trading workflow not found');
		}

		// Execute workflow
		const run = await workflow.createRunAsync();
		const result = await run.start({
			inputData: {
				mode: payload.mode,
				maxActions: payload.maxActions,
				symbols: payload.symbols
			}
		});

		const endTime = new Date();

		if (result.status !== 'success') {
			const errorMessage =
				(result as any).error?.message || JSON.stringify((result as any).error || result.status);

			// Update job as failed
			await db
				.update(jobQueue)
				.set({
					status: 'failed',
					completedAt: endTime,
					error: errorMessage,
					result: {
						status: result.status,
						error: (result as any).error
					} as any
				})
				.where(eq(jobQueue.id, jobId));

			return {
				success: false,
				actions: [],
				summary: '',
				error: errorMessage
			};
		}

		// Update job as completed
		await db
			.update(jobQueue)
			.set({
				status: 'completed',
				completedAt: endTime,
				result: result.result as any
			})
			.where(eq(jobQueue.id, jobId));

		return {
			success: true,
			actions: result.result.actions || [],
			summary: result.result.summary || '',
			error: undefined
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);

		// Update job as failed
		await db
			.update(jobQueue)
			.set({
				status: 'failed',
				completedAt: new Date(),
				error: errorMessage,
				result: {
					error: errorMessage
				} as any
			})
			.where(eq(jobQueue.id, jobId));

		console.error(`[Scheduler] Job ${jobId} failed:`, error);

		return {
			success: false,
			actions: [],
			summary: '',
			error: errorMessage
		};
	}
}

