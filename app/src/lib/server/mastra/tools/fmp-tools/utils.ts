import { createFmpApi } from '../../../../../../packages/fmp-api/src/index.js';
import { env } from '$env/dynamic/private';

// ============================================================================
// FMP API Client
// ============================================================================

let fmpApiInstance: ReturnType<typeof createFmpApi> | null = null;

export function getFmpApi() {
	if (!env.FMP_API_KEY) throw new Error('FMP_API_KEY is not set');
	if (!fmpApiInstance) {
		fmpApiInstance = createFmpApi(env.FMP_API_KEY);
	}
	return fmpApiInstance;
}

// ============================================================================
// Date Helpers
// ============================================================================

export function getToday(): Date {
	return new Date();
}

export function getDateDaysAgo(days: number): Date {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date;
}

