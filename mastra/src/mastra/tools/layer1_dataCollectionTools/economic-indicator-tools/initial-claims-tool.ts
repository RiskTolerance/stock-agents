import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const initialClaims = await fmpApi.Economics.economicIndicators('initialClaims');
	return { initialClaims };
};

export const initialClaimsTool = createTool({
	id: 'fetch-initial-claims',
	description: 'Fetch Initial Claims data.',
	inputSchema: z.object({}),
	execute,
});
