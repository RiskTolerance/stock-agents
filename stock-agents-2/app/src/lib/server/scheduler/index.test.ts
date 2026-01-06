import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { scheduler } from './index.js';
import { env } from '$env/dynamic/private';

describe('Heartbeat Scheduler Service', () => {
	beforeEach(() => {
		// Stop scheduler before each test
		scheduler.stop();
	});

	afterEach(() => {
		// Clean up after each test
		scheduler.stop();
	});

	describe('start', () => {
		it('should start the heartbeat scheduler', () => {
			scheduler.start();

			const status = scheduler.getStatus();
			expect(status.isRunning).toBe(true);
			expect(status.type).toBe('heartbeat');
		});

		it('should not start if already running', () => {
			scheduler.start();
			const consoleSpy = vi.spyOn(console, 'warn');

			scheduler.start(); // Try to start again

			expect(consoleSpy).toHaveBeenCalledWith(
				'[Heartbeat] Already running, skipping initialization'
			);

			consoleSpy.mockRestore();
		});

	it('should respect SCHEDULER_ENABLED=false', () => {
		// Ensure scheduler is stopped first
		scheduler.stop();
		
		const originalValue = env.SCHEDULER_ENABLED;
		env.SCHEDULER_ENABLED = 'false';

		scheduler.start();

		const status = scheduler.getStatus();
		// If disabled, scheduler should not be running
		// The scheduler checks SCHEDULER_ENABLED in start() and returns early if false
		expect(status.isRunning).toBe(false);

		// Restore original value
		env.SCHEDULER_ENABLED = originalValue;
	});
	});

	describe('stop', () => {
		it('should stop the heartbeat scheduler', () => {
			scheduler.start();
			expect(scheduler.getStatus().isRunning).toBe(true);

			scheduler.stop();
			expect(scheduler.getStatus().isRunning).toBe(false);
		});

		it('should handle stop when not running', () => {
			// Should not throw error
			expect(() => scheduler.stop()).not.toThrow();
		});
	});

	describe('getStatus', () => {
		it('should return correct status when running', () => {
			scheduler.start();
			const status = scheduler.getStatus();

			expect(status.isRunning).toBe(true);
			expect(status.type).toBe('heartbeat');
		});

		it('should return correct status when stopped', () => {
			scheduler.stop();
			const status = scheduler.getStatus();

			expect(status.isRunning).toBe(false);
			expect(status.type).toBe('heartbeat');
		});
	});
});

