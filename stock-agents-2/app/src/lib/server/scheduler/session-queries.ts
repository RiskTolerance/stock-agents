import { db } from '../db/index.js';
import { agentSessions, agentSessionIterations } from '../db/schema.js';
import { eq, desc, and, sql } from 'drizzle-orm';

/**
 * Get a session with all its iterations
 */
export async function getSessionWithIterations(sessionId: string) {
	const [session] = await db
		.select()
		.from(agentSessions)
		.where(eq(agentSessions.id, sessionId))
		.limit(1);

	if (!session) {
		return null;
	}

	const iterations = await db
		.select()
		.from(agentSessionIterations)
		.where(eq(agentSessionIterations.sessionId, sessionId))
		.orderBy(agentSessionIterations.iteration);

	return {
		...session,
		iterations
	};
}

/**
 * Get all sessions with optional filters
 */
export async function getSessions(options?: {
	limit?: number;
	status?: 'running' | 'completed' | 'failed';
	trigger?: 'heartbeat' | 'manual' | 'api';
}) {
	let query = db.select().from(agentSessions);

	if (options?.status) {
		query = query.where(eq(agentSessions.status, options.status)) as any;
	}

	if (options?.trigger) {
		query = query.where(eq(agentSessions.trigger, options.trigger)) as any;
	}

	query = query.orderBy(desc(agentSessions.startedAt));

	if (options?.limit) {
		query = query.limit(options.limit) as any;
	}

	return await query;
}

/**
 * Get sessions where no action was taken (no trades executed)
 */
export async function getSessionsWithNoAction(limit: number = 10) {
	const sessions = await db
		.select()
		.from(agentSessions)
		.where(eq(agentSessions.status, 'completed'))
		.orderBy(desc(agentSessions.startedAt))
		.limit(limit);

	// Filter sessions where actionsTaken is empty or null
	return sessions.filter((session) => {
		const actions = session.actionsTaken as Array<unknown> | null;
		return !actions || actions.length === 0;
	});
}

/**
 * Get sessions by decision pattern
 */
export async function getSessionsByDecisionPattern(pattern: {
	hasTrades?: boolean;
	hasAnalysis?: boolean;
	minIterations?: number;
	maxIterations?: number;
	limit?: number;
}) {
	let query = db.select().from(agentSessions).where(eq(agentSessions.status, 'completed'));

	const results = await query.orderBy(desc(agentSessions.startedAt));

	return results.filter((session) => {
		const actions = (session.actionsTaken as Array<{ type: string }> | null) || [];

		if (pattern.hasTrades !== undefined) {
			const hasTrades = actions.some((a) => a.type === 'trade');
			if (hasTrades !== pattern.hasTrades) return false;
		}

		if (pattern.hasAnalysis !== undefined) {
			const hasAnalysis = actions.some((a) => a.type === 'analyze');
			if (hasAnalysis !== pattern.hasAnalysis) return false;
		}

		// Get iteration count
		if (pattern.minIterations !== undefined || pattern.maxIterations !== undefined) {
			const iterations = (session.conversationHistory as Array<unknown> | null) || [];
			const iterationCount = Math.ceil(iterations.length / 2); // Approximate: each iteration adds user + assistant message

			if (pattern.minIterations !== undefined && iterationCount < pattern.minIterations) {
				return false;
			}
			if (pattern.maxIterations !== undefined && iterationCount > pattern.maxIterations) {
				return false;
			}
		}

		return true;
	}).slice(0, pattern.limit || 100);
}

/**
 * Get conversation history for a session
 */
export async function getConversationHistory(sessionId: string) {
	const [session] = await db
		.select({ conversationHistory: agentSessions.conversationHistory })
		.from(agentSessions)
		.where(eq(agentSessions.id, sessionId))
		.limit(1);

	return (session?.conversationHistory as Array<{ role: string; content: string }> | null) || [];
}

/**
 * Get iteration details for a specific iteration
 */
export async function getIterationDetails(sessionId: string, iterationNumber: number) {
	const [iteration] = await db
		.select()
		.from(agentSessionIterations)
		.where(
			and(
				eq(agentSessionIterations.sessionId, sessionId),
				eq(agentSessionIterations.iteration, iterationNumber)
			)
		)
		.limit(1);

	return iteration || null;
}

/**
 * Get sessions with decision analysis (sessions where agent considered actions but didn't execute)
 */
export async function getSessionsWithDecisionAnalysis(limit: number = 10) {
	const sessions = await getSessions({ limit: limit * 2, status: 'completed' });

	const sessionsWithAnalysis = [];

	for (const session of sessions) {
		// Get iterations for this session
		const iterations = await db
			.select()
			.from(agentSessionIterations)
			.where(eq(agentSessionIterations.sessionId, session.id))
			.orderBy(agentSessionIterations.iteration);

		// Check if any iteration has decisionsConsidered with decided: false
		const hasUnexecutedDecisions = iterations.some((iter) => {
			const decisions = (iter.decisionsConsidered as Array<{ decided: boolean }> | null) || [];
			return decisions.some((d) => d.decided === false);
		});

		if (hasUnexecutedDecisions) {
			sessionsWithAnalysis.push({
				...session,
				iterations
			});
		}

		if (sessionsWithAnalysis.length >= limit) break;
	}

	return sessionsWithAnalysis;
}

