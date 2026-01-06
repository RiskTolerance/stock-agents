import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceKeyMetrics, reduceKeyMetricsTtm } from '../../../utils/data-reduction.js';

export const keyMetricsTool = createTool({
	id: 'fetch-key-metrics',
	description:
		'Fetch key metrics for a stock symbol (limited to 2 most recent periods to reduce token usage)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		limit: z
			.number()
			.default(2)
			.describe('Number of periods to fetch (default 2 to reduce token usage)')
	}),
	outputSchema: z.object({
		keyMetrics: z.any(),
		keyMetricsTtm: z.any().nullable()
	}),
	execute: async ({ context }) => {
		const { symbol } = context;
		console.log(`[Key Metrics Tool] Executing for symbol: ${symbol}`);
		
		const fmpApi = getFmpApi();
		// Fetch both annual key metrics (2 years) and TTM (Trailing Twelve Months)
		const [keyMetrics, keyMetricsTtm] = await Promise.all([
			fmpApi.Statements.keyMetrics(symbol, { period: 'annual', limit: 2 }),
			fmpApi.Statements.keyMetricsTtm(symbol).catch(() => null) // Gracefully handle if TTM fails
		]);
		
		return {
			keyMetrics: reduceKeyMetrics(keyMetrics),
			keyMetricsTtm: keyMetricsTtm ? reduceKeyMetricsTtm(keyMetricsTtm) : null
		};
	}
});

