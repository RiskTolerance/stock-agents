import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const retailMoneyFunds = await fmpApi.Economics.economicIndicators('retailMoneyFunds');
	return { retailMoneyFunds };
};

export const retailMoneyFundsTool = createTool({
	id: 'fetch-retail-money-funds',
	description: 'Fetch Retail Money Funds data.',
	inputSchema: z.object({}),
	execute,
});
