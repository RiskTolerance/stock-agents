import { query, command } from '$app/server';
import { z } from 'zod';
import { db } from '$lib/server/db/index.js';
import { agentSessions } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import {
	getSessionWithIterations,
	getSessions,
	getSessionsWithNoAction,
	getSessionsByDecisionPattern
} from '$lib/server/scheduler/session-queries.js';

/**
 * Get all agent sessions
 */
export const getAgentSessions = query(
	z
		.object({
			limit: z.number().optional().default(50),
			status: z.enum(['running', 'completed', 'failed']).optional(),
			trigger: z.enum(['heartbeat', 'manual', 'api']).optional()
		})
		.optional()
		.default({}),
	async (options) => {
		const sessions = await getSessions({
			limit: options.limit,
			status: options.status,
			trigger: options.trigger
		});

		return {
			sessions: sessions.map((session) => ({
				id: session.id,
				startedAt: session.startedAt?.toISOString() || new Date().toISOString(),
				endedAt: session.endedAt?.toISOString(),
				status: session.status,
				trigger: session.trigger,
				toolCallsCount: (session.toolCalls as Array<unknown> | null)?.length || 0,
				decisionsCount: (session.decisionsMade as Array<unknown> | null)?.length || 0,
				actionsCount: (session.actionsTaken as Array<unknown> | null)?.length || 0,
				hasError: !!session.error
			}))
		};
	}
);

/**
 * Get a single session with all iterations
 */
export const getAgentSession = query(
	z.object({ id: z.string().uuid() }),
	async ({ id }) => {
		const session = await getSessionWithIterations(id);

		if (!session) {
			return { session: null };
		}

		return {
			session: {
				id: session.id,
				startedAt: session.startedAt?.toISOString() || new Date().toISOString(),
				endedAt: session.endedAt?.toISOString(),
				status: session.status,
				trigger: session.trigger,
				toolCalls: session.toolCalls,
				decisionsMade: session.decisionsMade,
				actionsTaken: session.actionsTaken,
				fullReasoning: session.fullReasoning,
				conversationHistory: session.conversationHistory,
				initialContext: session.initialContext,
				finalContext: session.finalContext,
				error: session.error,
				iterations: session.iterations.map((iter) => ({
					id: iter.id,
					iteration: iter.iteration,
					reasoning: iter.reasoning,
					toolCalls: iter.toolCalls,
					context: iter.context,
					decisionsConsidered: iter.decisionsConsidered,
					createdAt: iter.createdAt?.toISOString() || new Date().toISOString()
				}))
			}
		};
	}
);

/**
 * Get sessions with no action taken
 */
export const getSessionsNoAction = query(
	z.object({ limit: z.number().optional().default(10) }),
	async ({ limit }) => {
		const sessions = await getSessionsWithNoAction(limit);

		return {
			sessions: sessions.map((session) => ({
				id: session.id,
				startedAt: session.startedAt?.toISOString() || new Date().toISOString(),
				endedAt: session.endedAt?.toISOString(),
				status: session.status,
				trigger: session.trigger
			}))
		};
	}
);

/**
 * Delete a session by ID
 */
export const deleteSession = command(
	z.object({ id: z.string().uuid() }),
	async ({ id }) => {
		await db.delete(agentSessions).where(eq(agentSessions.id, id));
		// Refresh the sessions list query on the server
		await getAgentSessions({ limit: 50 }).refresh();
		return { success: true, id };
	}
);

/**
 * Delete all sessions (dev helper)
 */
export const deleteAllSessions = command(async () => {
	// Iterations are deleted via cascade
	await db.delete(agentSessions);
	// Refresh the sessions list query on the server
	await getAgentSessions({ limit: 50 }).refresh();
	return { success: true };
});

