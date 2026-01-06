import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi, getDateDaysAgo, getToday } from './utils.js';

export const economicDataTool = createTool({
	id: 'fetch-economic-data',
	description: 'Fetch key economic indicators (reduced data)',
	inputSchema: z.object({
		indicators: z
			.array(z.enum(['GDP', 'CPI', 'unemploymentRate', 'federalFunds']))
			.default(['GDP', 'CPI', 'unemploymentRate'])
			.describe('Economic indicators to fetch')
	}),
	outputSchema: z.object({
		treasuryRates: z.any(),
		economicIndicators: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { indicators } = context;

		// Only get last 30 days (reduced from 365)
		const from = getDateDaysAgo(30);
		const to = getToday();

		// Fetch treasury rates
		const treasuryRates = await fmpApi.Economics.treasuryRates({ from, to });

		// Fetch each economic indicator (limit to most recent data point)
		const economicIndicatorResults = await Promise.all(
			indicators.map(async (indicator) => {
				const data = await fmpApi.Economics.economicIndicators(indicator, { from, to });
				// Only keep most recent value
				return { indicator, value: Array.isArray(data) && data[0] ? data[0] : data };
			})
		);

		const economicIndicators = Object.fromEntries(
			economicIndicatorResults.map(({ indicator, value }) => [indicator, value])
		);

		// Only return most recent treasury rate
		return {
			treasuryRates: Array.isArray(treasuryRates) ? treasuryRates.slice(0, 1) : treasuryRates,
			economicIndicators
		};
	}
});

