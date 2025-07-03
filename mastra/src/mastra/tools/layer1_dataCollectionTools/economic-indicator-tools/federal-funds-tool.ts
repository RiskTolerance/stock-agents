import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const federalFunds = await fmpApi.Economics.economicIndicators('federalFunds');
	return { federalFunds };
};

export const federalFundsTool = createTool({
	id: 'fetch-federal-funds',
	description: 'Fetch Federal Funds data.',
	inputSchema: z.object({}),
	execute,
});
