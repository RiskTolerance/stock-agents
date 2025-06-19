import { vi } from 'vitest';

export interface MockResponse<T = any> {
	ok: boolean;
	status: number;
	json: () => Promise<T>;
}

/**
 * Creates a mock fetch response
 */
export function createMockResponse<T>(data: T, status = 200): MockResponse<T> {
	return {
		ok: status >= 200 && status < 300,
		status,
		json: () => Promise.resolve(data),
	};
}

/**
 * Mock the global fetch for testing
 */
export function mockFetch<T>(response: T, status = 200) {
	const mockResponse = createMockResponse(response, status);
	return vi
		.spyOn(global, 'fetch')
		.mockImplementation(
			() => Promise.resolve(mockResponse) as Promise<Response>
		);
}

/**
 * Helper to load test fixtures
 */
export function loadFixture<T>(name: string): Promise<T> {
	return import(`../fixtures/${name}.json`).then((module) => module.default);
}

/**
 * Create an error response
 */
export function createErrorResponse(
	status: number,
	message: string
): MockResponse {
	return createMockResponse({ error: message }, status);
}

/**
 * Reset all fetch mocks
 */
export function resetFetchMocks() {
	vi.restoreAllMocks();
}
