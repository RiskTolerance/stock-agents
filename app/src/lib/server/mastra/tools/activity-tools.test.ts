import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { config } from 'dotenv';
import { db } from '../../db/index.js';
import { agentActivity } from '../../db/schema.js';
import { getActivityHistoryTool, getTimeSinceLastActionTool, logActivity, getLastAgentActivity } from './activity-tools.js';

// Load environment variables for tests
config({ path: '.env.test' });

describe('Activity Tools', () => {
	beforeAll(async () => {
		// Clear any existing activities for clean test state
		await db.delete(agentActivity);
	});

	afterEach(async () => {
		// Clear activities after each test
		await db.delete(agentActivity);
	});

	describe('logActivity', () => {
		it('should log a monitor activity', async () => {
			await logActivity({
				activityType: 'monitor',
				details: { cash: '10000', equity: '15000' }
			});

			const activities = await db.select().from(agentActivity);
			expect(activities.length).toBe(1);
			expect(activities[0].activityType).toBe('monitor');
			expect(activities[0].details).toEqual({ cash: '10000', equity: '15000' });
		});

		it('should log an analyze activity with symbol', async () => {
			await logActivity({
				activityType: 'analyze',
				symbol: 'AAPL',
				details: { decision: 'BUY', reportId: 'test-id' }
			});

			const activities = await db.select().from(agentActivity);
			expect(activities.length).toBe(1);
			expect(activities[0].activityType).toBe('analyze');
			expect(activities[0].symbol).toBe('AAPL');
			expect(activities[0].details).toEqual({ decision: 'BUY', reportId: 'test-id' });
		});

		it('should log a trade activity', async () => {
			await logActivity({
				activityType: 'trade',
				symbol: 'MSFT',
				details: { side: 'buy', qty: 10 }
			});

			const activities = await db.select().from(agentActivity);
			expect(activities.length).toBe(1);
			expect(activities[0].activityType).toBe('trade');
			expect(activities[0].symbol).toBe('MSFT');
		});
	});

	describe('getActivityHistoryTool', () => {
		it('should return all activities when no filter specified', async () => {
			// Create test activities
			await logActivity({ activityType: 'monitor' });
			await logActivity({ activityType: 'analyze', symbol: 'AAPL' });
			await logActivity({ activityType: 'trade', symbol: 'MSFT' });

			const result = await getActivityHistoryTool.execute({ context: {} });

			expect(result.activities.length).toBe(3);
			expect(result.totalCount).toBe(3);
			expect(result.activities[0].activityType).toBe('trade'); // Most recent first
			expect(result.activities[1].activityType).toBe('analyze');
			expect(result.activities[2].activityType).toBe('monitor');
		});

		it('should filter by activity type', async () => {
			await logActivity({ activityType: 'monitor' });
			await logActivity({ activityType: 'analyze', symbol: 'AAPL' });
			await logActivity({ activityType: 'analyze', symbol: 'MSFT' });

			const result = await getActivityHistoryTool.execute({
				context: { activityType: 'analyze' }
			});

			expect(result.activities.length).toBe(2);
			expect(result.activities.every((a) => a.activityType === 'analyze')).toBe(true);
		});

		it('should filter by symbol', async () => {
			await logActivity({ activityType: 'analyze', symbol: 'AAPL' });
			await logActivity({ activityType: 'analyze', symbol: 'MSFT' });
			await logActivity({ activityType: 'trade', symbol: 'AAPL' });

			const result = await getActivityHistoryTool.execute({
				context: { symbol: 'AAPL' }
			});

			expect(result.activities.length).toBe(2);
			expect(result.activities.every((a) => a.symbol === 'AAPL')).toBe(true);
		});

		it('should respect limit', async () => {
			// Create 5 activities
			for (let i = 0; i < 5; i++) {
				await logActivity({ activityType: 'monitor' });
			}

			const result = await getActivityHistoryTool.execute({
				context: { limit: 3 }
			});

			expect(result.activities.length).toBe(3);
		});
	});

	describe('getTimeSinceLastActionTool', () => {
		it('should return null when no activity exists', async () => {
			const result = await getTimeSinceLastActionTool.execute({
				context: { activityType: 'monitor' }
			});

			expect(result.hasActivity).toBe(false);
			expect(result.lastActivityAt).toBeNull();
			expect(result.minutesSince).toBeNull();
		});

		it('should return time since last monitor activity', async () => {
			await logActivity({ activityType: 'monitor' });
			// Wait a moment to ensure time difference
			await new Promise((resolve) => setTimeout(resolve, 100));

			const result = await getTimeSinceLastActionTool.execute({
				context: { activityType: 'monitor' }
			});

			expect(result.hasActivity).toBe(true);
			expect(result.lastActivityAt).toBeDefined();
			expect(result.minutesSince).toBeGreaterThanOrEqual(0);
			expect(result.minutesSince).toBeLessThan(1); // Should be less than 1 minute
		});

		it('should return correct activity type', async () => {
			await logActivity({ activityType: 'analyze', symbol: 'AAPL' });
			await logActivity({ activityType: 'trade', symbol: 'MSFT' });

			const result = await getTimeSinceLastActionTool.execute({
				context: { activityType: 'analyze' }
			});

			expect(result.hasActivity).toBe(true);
			expect(result.activityType).toBe('analyze');
		});
	});

	describe('getLastAgentActivity', () => {
		it('should return null when no activities exist', async () => {
			const result = await getLastAgentActivity();
			expect(result).toBeNull();
		});

		it('should return the most recent activity', async () => {
			await logActivity({ activityType: 'monitor' });
			await new Promise((resolve) => setTimeout(resolve, 100));
			await logActivity({ activityType: 'analyze', symbol: 'AAPL' });

			const result = await getLastAgentActivity();

			expect(result).toBeDefined();
			expect(result?.activityType).toBe('analyze');
			expect(result?.createdAt).toBeDefined();
		});
	});
});

