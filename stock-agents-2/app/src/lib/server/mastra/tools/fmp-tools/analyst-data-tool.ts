import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from './utils.js';
import {
	reduceAnalystEstimates,
	reduceAnalystRatings,
	reducePriceTargets
} from '../../utils/data-reduction.js';

export const analystDataTool = createTool({
	id: 'fetch-analyst-data',
	description: 'Fetch analyst ratings, price targets, and estimates for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol (e.g., AAPL)')
	}),
	outputSchema: z.object({
		estimates: z.any(),
		ratings: z.any(),
		priceTarget: z.any()
	}),
	execute: async ({ context }) => {
		const symbol = context.symbol;
		console.log(`[Analyst Data Tool] Executing for symbol: ${symbol}`);
		
		const fmpApi = getFmpApi();

		// Fetch with minimal limits
		const [financialEstimates, ratingSnapshot, analystPriceTargetConsensus] = await Promise.all([
			fmpApi.Analyst.financialEstimates(symbol, { page: 0, limit: 3 }),
			fmpApi.Analyst.ratingSnapshot(symbol),
			fmpApi.Analyst.analystPriceTargetConsensus(symbol)
		]);

		// Apply data reduction to minimize tokens
		return {
			estimates: reduceAnalystEstimates(financialEstimates),
			ratings: reduceAnalystRatings(ratingSnapshot ? [ratingSnapshot] : []),
			priceTarget: reducePriceTargets(analystPriceTargetConsensus)
		};
	}
});

