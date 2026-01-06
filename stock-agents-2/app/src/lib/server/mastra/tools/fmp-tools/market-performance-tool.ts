import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from './utils.js';

export const marketPerformanceTool = createTool({
	id: 'fetch-market-performance',
	description: 'Fetch market performance summary (reduced data). Takes no parameters.',
	inputSchema: z.object({}).passthrough(),
	outputSchema: z.object({
		biggestGainers: z.any(),
		biggestLosers: z.any(),
		mostActive: z.any()
	}),
	execute: async () => {
		const fmpApi = getFmpApi();

		const [biggestGainers, biggestLosers, mostActive] = await Promise.all([
			fmpApi.MarketPerformance.biggestGainers(),
			fmpApi.MarketPerformance.biggestLosers(),
			fmpApi.MarketPerformance.mostActive()
		]);

		// Only keep top 3 of each and reduce fields
		const reduceMarketData = (data: unknown[]) =>
			(data || []).slice(0, 3).map((item) => {
				const i = item as Record<string, unknown>;
				return {
					symbol: i.symbol,
					price: i.price,
					change: i.changesPercentage
				};
			});

		return {
			biggestGainers: reduceMarketData(biggestGainers),
			biggestLosers: reduceMarketData(biggestLosers),
			mostActive: reduceMarketData(mostActive)
		};
	}
});

