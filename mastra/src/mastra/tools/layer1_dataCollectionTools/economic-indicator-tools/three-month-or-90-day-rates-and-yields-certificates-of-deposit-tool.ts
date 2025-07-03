import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const threeMonthOr90DayRatesAndYieldsCertificatesOfDeposit = await fmpApi.Economics.economicIndicators('3MonthOr90DayRatesAndYieldsCertificatesOfDeposit');
	return { threeMonthOr90DayRatesAndYieldsCertificatesOfDeposit };
};

export const threeMonthOr90DayRatesAndYieldsCertificatesOfDepositTool = createTool({
	id: 'fetch-three-month-or-90-day-rates-and-yields-certificates-of-deposit',
	description: 'Fetch 3-Month or 90-Day Rates and Yields Certificates of Deposit data.',
	inputSchema: z.object({}),
	execute,
});
