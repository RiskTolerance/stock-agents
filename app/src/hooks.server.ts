import type { Handle } from '@sveltejs/kit';
import { scheduler } from '$lib/server/scheduler';

// Global flag to track listener registration (prevents memory leak)
let listenersRegistered = false;
let schedulerInitialized = false;

function initializeScheduler() {
	if (schedulerInitialized) {
		return;
	}

	// Only initialize in server environment
	if (typeof process !== 'undefined' && process.env) {
		scheduler.start();
		schedulerInitialized = true;

		// Only register listeners once globally (prevents memory leak on hot reload)
		if (!listenersRegistered) {
			const shutdown = () => {
				console.log('[Heartbeat] Shutting down gracefully...');
				scheduler.stop();
				process.exit(0);
			};

			process.on('SIGTERM', shutdown);
			process.on('SIGINT', shutdown);
			listenersRegistered = true;
		}
	}
}

// Initialize on module load
initializeScheduler();

// SvelteKit handle
export const handle: Handle = async ({ event, resolve }) => {
	// Ensure scheduler is initialized (in case module load didn't trigger it)
	if (!schedulerInitialized) {
		initializeScheduler();
	}
	return resolve(event);
};

