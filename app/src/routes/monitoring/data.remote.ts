import { query } from '$app/server';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { agentSessions } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

/**
 * Get all agent sessions
 */
export const getAgentSessions = query(
	z.object({
		limit: z.number().min(1).max(100).default(50).optional(),
		status: z.enum(['running', 'completed', 'failed', 'all']).default('all').optional()
	}),
	async ({ limit = 50, status = 'all' }) => {
		let query = db.select().from(agentSessions).orderBy(desc(agentSessions.startedAt)).limit(limit);

		if (status !== 'all') {
			query = query.where(eq(agentSessions.status, status)) as typeof query;
		}

		const sessions = await query;

		return sessions.map((session) => ({
			id: session.id,
			startedAt: session.startedAt?.toISOString() || new Date().toISOString(),
			endedAt: session.endedAt?.toISOString() || null,
			status: session.status || 'running',
			trigger: session.trigger,
			toolCalls: session.toolCalls || [],
			decisionsMade: session.decisionsMade || [],
			actionsTaken: session.actionsTaken || [],
			fullReasoning: session.fullReasoning || '',
			error: session.error || null,
			duration: session.endedAt && session.startedAt
				? Math.floor((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000)
				: null
		}));
	}
);

/**
 * Get a single agent session by ID
 */
export const getAgentSession = query(
	z.object({
		id: z.string().uuid()
	}),
	async ({ id }) => {
		const [session] = await db.select().from(agentSessions).where(eq(agentSessions.id, id)).limit(1);

		if (!session) {
			throw new Error('Session not found');
		}

		return {
			id: session.id,
			startedAt: session.startedAt?.toISOString() || new Date().toISOString(),
			endedAt: session.endedAt?.toISOString() || null,
			status: session.status || 'running',
			trigger: session.trigger,
			toolCalls: session.toolCalls || [],
			decisionsMade: session.decisionsMade || [],
			actionsTaken: session.actionsTaken || [],
			fullReasoning: session.fullReasoning || '',
			error: session.error || null,
			duration: session.endedAt && session.startedAt
				? Math.floor((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000)
				: null
		};
	}
);

/**
 * Get session statistics
 */
export const getSessionStats = query(
	z.object({}),
	async () => {
		const allSessions = await db.select().from(agentSessions);

		const stats = {
			total: allSessions.length,
			running: allSessions.filter((s) => s.status === 'running').length,
			completed: allSessions.filter((s) => s.status === 'completed').length,
			failed: allSessions.filter((s) => s.status === 'failed').length,
			totalToolCalls: allSessions.reduce((sum, s) => {
				const calls = (s.toolCalls as unknown[]) || [];
				return sum + calls.length;
			}, 0),
			totalDecisions: allSessions.reduce((sum, s) => {
				const decisions = (s.decisionsMade as unknown[]) || [];
				return sum + decisions.length;
			}, 0),
			totalActions: allSessions.reduce((sum, s) => {
				const actions = (s.actionsTaken as unknown[]) || [];
				return sum + actions.length;
			}, 0)
		};

		return stats;
	}
);

