import { query } from '$app/server';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { reports } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * Get all reports for the current user
 * TODO: Add authentication and filter by user
 */
export const getReports = query(async () => {
	const userReports = await db
		.select({
			id: reports.id,
			symbol: reports.symbol,
			decision: reports.decision,
			createdAt: reports.createdAt
		})
		.from(reports)
		.orderBy(desc(reports.createdAt))
		.limit(100); // Limit to most recent 100 reports

	return {
		reports: userReports.map((report) => ({
			id: report.id,
			symbol: report.symbol,
			decision: report.decision || 'HOLD',
			createdAt: report.createdAt?.toISOString() || new Date().toISOString()
		}))
	};
});

/**
 * Get a single report by ID
 */
export const getReport = query(
	z.object({ id: z.string().uuid() }),
	async ({ id }) => {
		const [report] = await db
			.select()
			.from(reports)
			.where(eq(reports.id, id))
			.limit(1);

		if (!report) {
			return { report: null };
		}

		return {
			report: {
				id: report.id,
				symbol: report.symbol,
				decision: report.decision || 'HOLD',
				context: {
					layer1Data: report.layer1Data,
					layer2Reasoning: report.layer2Reasoning,
					layer3Rebuttals: report.layer3Rebuttals
				},
				createdAt: report.createdAt?.toISOString() || new Date().toISOString()
			}
		};
	}
);

/**
 * Delete a report by ID
 * Note: Using query instead of command since it doesn't require form submission
 */
export const deleteReport = query(
	z.object({ id: z.string().uuid() }),
	async ({ id }) => {
		await db.delete(reports).where(eq(reports.id, id));
		return { success: true, id };
	}
);

