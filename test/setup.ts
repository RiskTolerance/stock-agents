import { beforeAll, afterAll, afterEach, vi } from 'vitest';

// Global test timeout (adjust if needed for integration tests)
vi.setConfig({ testTimeout: 20000 });

// Reset all mocks after each test
afterEach(() => {
	vi.resetAllMocks();
});

// Add any global setup/teardown here
beforeAll(() => {
	// Setup code (if needed)
});

afterAll(() => {
	// Cleanup code (if needed)
});
