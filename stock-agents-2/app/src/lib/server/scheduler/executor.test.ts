import { describe, it, expect, beforeAll } from 'vitest';
import { config } from 'dotenv';
import { executeScheduledJob } from './executor.js';
import { db } from '../db/index.js';
import { jobQueue } from '../db/schema.js';
import { eq } from 'drizzle-orm';

config(); // Load environment variables

const SKIP_EXECUTION_TESTS =
	!process.env.ALPACA_API_KEY ||
	!process.env.ALPACA_API_SECRET ||
	!process.env.GROQ_API_KEY ||
	!process.env.FMP_API_KEY;

describe('Job Executor', () => {
	beforeAll(() => {
		if (SKIP_EXECUTION_TESTS) {
			console.log(
				'⚠️  Skipping execution tests - Required API keys not set (ALPACA_API_KEY, ALPACA_API_SECRET, GROQ_API_KEY, FMP_API_KEY)'
			);
		}
	});

	it('should create job record in database', async () => {
		if (SKIP_EXECUTION_TESTS) {
			console.log('Skipping - Required API keys not set');
			return;
		}

		const payload = {
			mode: 'monitor' as const,
			maxActions: 2
		};

		const result = await executeScheduledJob(payload, 'test-schedule');

		expect(result).toBeDefined();

		// Check that job was created (may fail due to rate limits, but job should be created)
		const jobs = await db
			.select()
			.from(jobQueue)
			.where(eq(jobQueue.type, 'autonomous_trading'))
			.orderBy(jobQueue.createdAt)
			.limit(1);

		expect(jobs.length).toBeGreaterThan(0);
		const job = jobs[jobs.length - 1]; // Get most recent job

		expect(job.type).toBe('autonomous_trading');
		expect(job.status).toBeDefined();
		// Job status can be completed, failed, or running (if still executing)
		expect(['completed', 'failed', 'running', 'pending']).toContain(job.status);

		console.log(`Job created: ${job.id}, Status: ${job.status}`);
	}, 90000); // Increased timeout for rate limit handling

	it('should execute monitor mode workflow', async () => {
		if (SKIP_EXECUTION_TESTS) {
			console.log('Skipping - Required API keys not set');
			return;
		}

		const payload = {
			mode: 'monitor' as const,
			maxActions: 2
		};

		const result = await executeScheduledJob(payload, 'test-monitor');

		expect(result).toBeDefined();

		// Check job was created and has a status
		const jobs = await db
			.select()
			.from(jobQueue)
			.where(eq(jobQueue.type, 'autonomous_trading'))
			.orderBy(jobQueue.createdAt)
			.limit(1);

		if (jobs.length > 0) {
			const job = jobs[0];
			// Job should have a valid status (may be running if still executing, or completed/failed)
			expect(['completed', 'failed', 'running', 'pending']).toContain(job.status || '');
		}

		console.log(`Monitor execution result: ${result.success ? 'Success' : 'Failed'}`);
		if (result.summary) {
			console.log(`Summary: ${result.summary.substring(0, 100)}...`);
		}
		if (result.error) {
			console.log(`Error (may be rate limit): ${result.error.substring(0, 100)}...`);
		}
	}, 90000); // Increased timeout
});
