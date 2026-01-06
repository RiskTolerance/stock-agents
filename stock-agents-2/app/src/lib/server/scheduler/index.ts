import cron, { type ScheduledTask } from 'node-cron';
import { env } from '$env/dynamic/private';
import { checkAndWakeAgent } from './heartbeat.js';

/**
 * Simplified Heartbeat Scheduler Service
 * Only checks if agent is idle and wakes it up if needed
 */
class HeartbeatSchedulerService {
	private heartbeatTask: ScheduledTask | null = null;
	private isRunning = false;

	/**
	 * Initialize and start heartbeat
	 */
	start(): void {
		if (this.isRunning) {
			console.warn('[Heartbeat] Already running, skipping initialization');
			return;
		}

		const schedulerEnabled = env.SCHEDULER_ENABLED !== 'false';
		if (!schedulerEnabled) {
			console.log('[Heartbeat] Scheduler disabled via SCHEDULER_ENABLED=false');
			return;
		}

		// Get heartbeat interval from environment (default: 15 minutes)
		const intervalMinutes = parseInt(env.HEARTBEAT_INTERVAL_MINUTES || '15', 10);
		const cronExpression = `*/${intervalMinutes} * * * *`; // Every N minutes

		console.log(`[Heartbeat] Initializing heartbeat (every ${intervalMinutes} minutes)...`);

		// Validate cron expression
		if (!cron.validate(cronExpression)) {
			console.error(`[Heartbeat] Invalid cron expression: ${cronExpression}`);
			return;
		}

		// Create heartbeat task
		this.heartbeatTask = cron.schedule(cronExpression, async () => {
			console.log('[Heartbeat] Checking agent status...');
			try {
				const result = await checkAndWakeAgent('heartbeat');
				if (result.woke) {
					console.log(`[Heartbeat] ${result.reason}`);
				} else {
					console.log(`[Heartbeat] ${result.reason}`);
				}
			} catch (error) {
				console.error('[Heartbeat] Error checking/waking agent:', error);
			}
		});

		this.isRunning = true;
		console.log(`[Heartbeat] Heartbeat started (every ${intervalMinutes} minutes)`);
	}

	/**
	 * Stop heartbeat
	 */
	stop(): void {
		console.log('[Heartbeat] Stopping heartbeat...');

		if (this.heartbeatTask) {
			this.heartbeatTask.stop();
			this.heartbeatTask = null;
		}

		this.isRunning = false;
		console.log('[Heartbeat] Heartbeat stopped');
	}

	/**
	 * Get status of heartbeat
	 */
	getStatus(): {
		isRunning: boolean;
		type: string;
	} {
		return {
			isRunning: this.isRunning,
			type: 'heartbeat'
		};
	}
}

// Singleton instance
export const scheduler = new HeartbeatSchedulerService();
