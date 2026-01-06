import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from './utils.js';
import { reduceCompanyProfile, reduceQuote } from '../../utils/data-reduction.js';

export const companyDataTool = createTool({
	id: 'fetch-company-data',
	description: 'Fetch company profile, market cap, and quote information',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		profile: z.any(),
		quote: z.any()
	}),
	execute: async ({ context }) => {
		const symbol = context.symbol;
		console.log(`[Company Data Tool] Executing for symbol: ${symbol}`);
		
		const fmpApi = getFmpApi();

		const [profile, quote] = await Promise.all([
			fmpApi.Company.profile(symbol),
			fmpApi.Technical.quote(symbol)
		]);

		// Apply data reduction to minimize tokens
		return {
			profile: reduceCompanyProfile(profile),
			quote: reduceQuote(quote)
		};
	}
});

