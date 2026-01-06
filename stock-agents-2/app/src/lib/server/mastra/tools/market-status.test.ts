import { describe, it, expect } from 'vitest';
import { getMarketStatusTool } from './account-manager-tools.js';

describe('Market Status Tool', () => {
	it('should return market status information', async () => {
		const result = await getMarketStatusTool.execute({ context: {} });

		expect(result).toBeDefined();
		expect(result.isOpen).toBeDefined();
		expect(result.isMarketHours).toBeDefined();
		expect(result.currentTime).toBeDefined();
		expect(result.marketOpenTime).toBe('09:30 ET');
		expect(result.marketCloseTime).toBe('16:00 ET');
		expect(result.dayOfWeek).toBeDefined();
		expect(result.message).toBeDefined();
		expect(typeof result.isOpen).toBe('boolean');
		expect(typeof result.isMarketHours).toBe('boolean');
	});

	it('should calculate minutes until open/close correctly', async () => {
		const result = await getMarketStatusTool.execute({ context: {} });

		if (result.isMarketHours) {
			// During market hours, should have minutesUntilClose
			expect(result.minutesUntilClose).toBeGreaterThanOrEqual(0);
			expect(result.minutesUntilClose).toBeLessThanOrEqual(390); // Max 6.5 hours
		} else {
			// Outside market hours, should have minutesUntilOpen
			expect(result.minutesUntilOpen).toBeGreaterThanOrEqual(0);
		}
	});

	it('should return valid day of week', async () => {
		const result = await getMarketStatusTool.execute({ context: {} });

		const validDays = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];
		expect(validDays).toContain(result.dayOfWeek);
	});

	it('should return a meaningful message', async () => {
		const result = await getMarketStatusTool.execute({ context: {} });

		expect(result.message.length).toBeGreaterThan(0);
		expect(result.message.toLowerCase()).toMatch(/market|open|closed|closes|opens/);
	});
});

