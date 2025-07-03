import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const commercialBankInterestRateOnCreditCardPlansAllAccounts = await fmpApi.Economics.economicIndicators('commercialBankInterestRateOnCreditCardPlansAllAccounts');
	return { commercialBankInterestRateOnCreditCardPlansAllAccounts };
};

export const commercialBankInterestRateOnCreditCardPlansAllAccountsTool = createTool({
	id: 'fetch-commercial-bank-interest-rate-on-credit-card-plans-all-accounts',
	description: 'Fetch Commercial Bank Interest Rate on Credit Card Plans All Accounts data.',
	inputSchema: z.object({}),
	execute,
});
