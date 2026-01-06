import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { db } from '../../db/index.js';
import { agentActivity } from '../../db/schema.js';
import { desc, eq, and, gte } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// ============================================================================
// Tool: Get Activity History
// ============================================================================

export const getActivityHistoryTool = createTool({
	id: 'get-activity-history',
	description:
		'Get recent agent activities with timestamps. Useful for understanding what actions have been taken and when.',
	inputSchema: z
		.object({
			activityType: z
				.enum(['monitor', 'analyze', 'trade', 'wake_up', 'all'])
				.default('all')
				.describe('Filter by activity type, or "all" for all activities'),
			limit: z.number().min(1).max(100).default(20).describe('Maximum number of activities to return')
		})
		.passthrough(),
	outputSchema: z.object({
		activities: z.array(
			z.object({
				id: z.string().uuid(),
				activityType: z.string(),
				symbol: z.string().nullable(),
				details: z.unknown().nullable(),
				createdAt: z.string()
			})
		),
		totalCount: z.number()
	}),
	execute: async ({ context }) => {
		const { activityType = 'all', symbol, limit = 20 } = context;

		let query = db
			.select()
			.from(agentActivity)
			.orderBy(desc(agentActivity.createdAt))
			.limit(limit);

		// Apply filters
		const conditions = [];
		if (activityType && activityType !== 'all') {
			conditions.push(eq(agentActivity.activityType, activityType));
		}
		if (symbol && symbol !== null && symbol !== undefined) {
			conditions.push(eq(agentActivity.symbol, symbol.toUpperCase()));
		}

		if (conditions.length > 0) {
			query = query.where(and(...conditions)) as any;
		}

		const activities = await query;

		return {
			activities: activities.map((activity) => ({
				id: activity.id,
				activityType: activity.activityType || '',
				symbol: activity.symbol || null,
				details: activity.details,
				createdAt: activity.createdAt?.toISOString() || new Date().toISOString()
			})),
			totalCount: activities.length
		};
	}
});

// ============================================================================
// Tool: Get Time Since Last Action
// ============================================================================

export const getTimeSinceLastActionTool = createTool({
	id: 'get-time-since-last-action',
	description:
		'Get the time elapsed since the last action of a specific type (monitor, analyze, trade). Returns minutes since last action.',
	inputSchema: z.object({
		activityType: z
			.enum(['monitor', 'analyze', 'trade'])
			.describe('Type of activity to check (monitor, analyze, or trade)')
	}),
	outputSchema: z.object({
		activityType: z.string(),
		lastActivityAt: z.string().nullable(),
		minutesSince: z.number().nullable(),
		hasActivity: z.boolean()
	}),
	execute: async ({ context }) => {
		const { activityType } = context;

		const [lastActivity] = await db
			.select()
			.from(agentActivity)
			.where(eq(agentActivity.activityType, activityType))
			.orderBy(desc(agentActivity.createdAt))
			.limit(1);

		if (!lastActivity || !lastActivity.createdAt) {
			return {
				activityType,
				lastActivityAt: null,
				minutesSince: null,
				hasActivity: false
			};
		}

		const now = new Date();
		const lastActivityTime = new Date(lastActivity.createdAt);
		const minutesSince = Math.floor((now.getTime() - lastActivityTime.getTime()) / (1000 * 60));

		return {
			activityType,
			lastActivityAt: lastActivity.createdAt.toISOString(),
			minutesSince,
			hasActivity: true
		};
	}
});

// ============================================================================
// Tool: Log Activity (Internal - used by agent and workflows)
// ============================================================================

export async function logActivity(params: {
	activityType: 'monitor' | 'analyze' | 'trade' | 'wake_up';
	symbol?: string;
	details?: unknown;
}): Promise<void> {
	await db.insert(agentActivity).values({
		activityType: params.activityType,
		symbol: params.symbol?.toUpperCase() || null,
		details: params.details || null
	});
}

// ============================================================================
// Helper: Get Last Agent Activity
// ============================================================================

export async function getLastAgentActivity(): Promise<{
	activityType: string;
	createdAt: Date | null;
} | null> {
	const [lastActivity] = await db
		.select({
			activityType: agentActivity.activityType,
			createdAt: agentActivity.createdAt
		})
		.from(agentActivity)
		.orderBy(desc(agentActivity.createdAt))
		.limit(1);

	return lastActivity || null;
}

// ============================================================================
// Export all tools
// ============================================================================

export const activityTools = {
	getActivityHistoryTool,
	getTimeSinceLastActionTool
};

