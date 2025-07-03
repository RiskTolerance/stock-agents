import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const thirtyYearFixedRateMortgageAverage = await fmpApi.Economics.economicIndicators('30YearFixedRateMortgageAverage');
	return { thirtyYearFixedRateMortgageAverage };
};

export const thirtyYearFixedRateMortgageAverageTool = createTool({
	id: 'fetch-thirty-year-fixed-rate-mortgage-average',
	description: 'Fetch 30-Year Fixed Rate Mortgage Average data.',
	inputSchema: z.object({}),
	execute,
});
