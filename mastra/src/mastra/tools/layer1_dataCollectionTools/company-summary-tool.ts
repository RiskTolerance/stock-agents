import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;
	const profile = await fmpApi.Company.profile(query);
	const marketCap = await fmpApi.Company.marketCap(query);
	const employeeCount = await fmpApi.Company.employeeCount(query, 20);
	const historicalEmployeeCount = await fmpApi.Company.historicalEmployeeCount(
		query,
		20
	);
	return {
		profile,
		marketCap,
		employeeCount,
		historicalEmployeeCount,
	};
};

export const companySummaryTool = createTool({
	id: 'fetch-company-summary-data',
	description: 'Fetch analyst data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
