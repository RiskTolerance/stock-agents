import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;
	const profile = await fmpApi.Company.profile(query);
	return {
		profile,
	};
};

export const companyProfileTool = createTool({
	id: 'fetch-company-profile-data',
	description: 'Fetch company profile data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
