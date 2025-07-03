import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const fifteenYearFixedRateMortgageAverage = await fmpApi.Economics.economicIndicators('15YearFixedRateMortgageAverage');
	return { fifteenYearFixedRateMortgageAverage };
};

export const fifteenYearFixedRateMortgageAverageTool = createTool({
	id: 'fetch-fifteen-year-fixed-rate-mortgage-average',
	description: 'Fetch 15-Year Fixed Rate Mortgage Average data.',
	inputSchema: z.object({}),
	execute,
});
