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
		quote: z.any().nullable(),
		sma50: z.any().nullable(),
		sma200: z.any().nullable(),
		ema20: z.any().nullable(),
		rsi14: z.any().nullable(),
		adx14: z.any().nullable()
	}),
	execute: async ({ context }) => {
		const symbol = context.symbol;
		console.log(`[Technical Data Tool] Executing for symbol: ${symbol}`);
		
		const fmpApi = getFmpApi();

		// Only get last 30 days for technical indicators (reduced from 365)
		const from = getDateDaysAgo(30);
		const to = getToday();
		const timeframe = '1day';

		// Helper function to safely fetch with error handling
		const safeFetch = async <T>(
			fn: () => Promise<T>,
			indicatorName: string
		): Promise<T | null> => {
			try {
				return await fn();
			} catch (error: any) {
				const errorMessage = error?.message || String(error);
				console.warn(
					`[Technical Data Tool] Failed to fetch ${indicatorName} for ${symbol}: ${errorMessage}`
				);
				// Return null for failed indicators - allow partial results
				return null;
			}
		};

		// Fetch all indicators in parallel with error handling
		const [quote, sma50, sma200, ema20, rsi14, adx14] = await Promise.all([
			safeFetch(() => fmpApi.Technical.quote(symbol), 'quote'),
			safeFetch(
				() => fmpApi.Technical.simpleMovingAverage(symbol, { periodLength: 50, timeframe, from, to }),
				'SMA50'
			),
			safeFetch(
				() => fmpApi.Technical.simpleMovingAverage(symbol, { periodLength: 200, timeframe, from, to }),
				'SMA200'
			),
			safeFetch(
				() => fmpApi.Technical.exponentialMovingAverage(symbol, { periodLength: 20, timeframe, from, to }),
				'EMA20'
			),
			safeFetch(
				() => fmpApi.Technical.relativeStrengthIndex(symbol, { periodLength: 14, timeframe, from, to }),
				'RSI14'
			),
			safeFetch(
				() => fmpApi.Technical.averageDirectionalIndex(symbol, { periodLength: 14, timeframe, from, to }),
				'ADX14'
			)
		]);

		// Apply data reduction - only keep most recent values
		// Handle null values gracefully (failed API calls)
		return {
			quote: quote ? reduceQuote(quote) : null,
			sma50: sma50 ? reduceTechnicalIndicators(sma50) : null,
			sma200: sma200 ? reduceTechnicalIndicators(sma200) : null,
			ema20: ema20 ? reduceTechnicalIndicators(ema20) : null,
			rsi14: rsi14 ? reduceTechnicalIndicators(rsi14) : null,
			adx14: adx14 ? reduceTechnicalIndicators(adx14) : null
		};
	}
});

