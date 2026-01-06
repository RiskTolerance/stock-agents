import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkAndWakeAgent } from '$lib/server/scheduler/heartbeat.js';

/**
 * Manual trigger endpoint for testing/debugging
 * Forces the agent to run (bypasses idle check)
 */
export const POST: RequestHandler = async () => {
	try {
		console.log('[Heartbeat API] Manual trigger requested (force mode)');

		const result = await checkAndWakeAgent('manual', true); // Force = true to bypass idle check

		return json({
			success: true,
			message: 'Agent triggered successfully',
			woke: result.woke,
			reason: result.reason,
			idleMinutes: result.idleMinutes,
			sessionId: result.sessionId
		});
	} catch (error) {
		console.error('[Heartbeat API] Error:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
