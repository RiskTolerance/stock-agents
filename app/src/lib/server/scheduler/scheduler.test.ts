import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { config } from 'dotenv';
import { scheduler } from './index.js';
import { getSchedulerConfig } from './config.js';

config(); // Load environment variables

describe('Scheduler Service', () => {
	beforeAll(() => {
		// Ensure scheduler is stopped before tests
		scheduler.stop();
	});

	afterAll(() => {
		// Clean up after tests
		scheduler.stop();
	});

	describe('Configuration', () => {
		it('should load scheduler configuration', () => {
			const schedules = getSchedulerConfig();
			expect(schedules).toBeDefined();
			expect(Array.isArray(schedules)).toBe(true);
		});

		it('should have valid cron expressions', () => {
			const schedules = getSchedulerConfig();
			const cron = require('node-cron');

			for (const schedule of schedules) {
				expect(cron.validate(schedule.cronExpression)).toBe(true);
			}
		});
	});

	describe('Scheduler Service', () => {
		it('should initialize scheduler', () => {
			scheduler.start();
			const status = scheduler.getStatus();
			expect(status.isRunning).toBe(true);
		});

		it('should have active schedules after initialization', () => {
			const status = scheduler.getStatus();
			expect(status.activeSchedules).toBeGreaterThan(0);
			expect(status.scheduleIds.length).toBeGreaterThan(0);
		});

		it('should stop scheduler', () => {
			scheduler.stop();
			const status = scheduler.getStatus();
			expect(status.isRunning).toBe(false);
			expect(status.activeSchedules).toBe(0);
		});

		it('should not start twice', () => {
			scheduler.start();
			const initialStatus = scheduler.getStatus();
			scheduler.start(); // Try to start again
			const afterStatus = scheduler.getStatus();
			expect(afterStatus.activeSchedules).toBe(initialStatus.activeSchedules);
		});
	});
});

