import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { scheduler } from '$lib/server/scheduler';

export const GET: RequestHandler = async () => {
	const status = scheduler.getStatus();

	return json({
		...status,
		timestamp: new Date().toISOString()
	});
};

