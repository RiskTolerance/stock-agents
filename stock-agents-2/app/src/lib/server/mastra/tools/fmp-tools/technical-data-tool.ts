import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi, getDateDaysAgo, getToday } from './utils.js';
import { reduceQuote, reduceTechnicalIndicators } from '../../utils/data-reduction.js';

export const technicalDataTool = createTool({
	id: 'fetch-technical-data',
	description: 'Fetch technical indicators including moving averages, RSI, and ADX (reduced data)',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		quote: z.any(),
		sma50: z.any(),
		sma200: z.any(),
		ema20: z.any(),
		rsi14: z.any(),
		adx14: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const symbol = context.symbol;

		// Only get last 30 days for technical indicators (reduced from 365)
		const from = getDateDaysAgo(30);
		const to = getToday();
		const timeframe = '1day';

		const [quote, sma50, sma200, ema20, rsi14, adx14] = await Promise.all([
			fmpApi.Technical.quote(symbol),
			fmpApi.Technical.simpleMovingAverage(symbol, { periodLength: 50, timeframe, from, to }),
			fmpApi.Technical.simpleMovingAverage(symbol, { periodLength: 200, timeframe, from, to }),
			fmpApi.Technical.exponentialMovingAverage(symbol, { periodLength: 20, timeframe, from, to }),
			fmpApi.Technical.relativeStrengthIndex(symbol, { periodLength: 14, timeframe, from, to }),
			fmpApi.Technical.averageDirectionalIndex(symbol, { periodLength: 14, timeframe, from, to })
		]);

		// Apply data reduction - only keep most recent values
		return {
			quote: reduceQuote(quote),
			sma50: reduceTechnicalIndicators(sma50),
			sma200: reduceTechnicalIndicators(sma200),
			ema20: reduceTechnicalIndicators(ema20),
			rsi14: reduceTechnicalIndicators(rsi14),
			adx14: reduceTechnicalIndicators(adx14)
		};
	}
});

