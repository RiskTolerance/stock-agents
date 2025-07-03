import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const treasuryRates = await fmpApi.Economics.treasuryRates();
	return { treasuryRates };
};

export const treasuryRatesTool = createTool({
	id: 'fetch-treasury-rates',
	description: 'Fetch Treasury Rates data.',
	inputSchema: z.object({}),
	execute,
});
