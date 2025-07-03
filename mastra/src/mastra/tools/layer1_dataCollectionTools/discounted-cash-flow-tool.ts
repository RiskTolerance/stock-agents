import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;
	const dcfValuation = await fmpApi.DiscountedCashFlow.dcfValuation(query);
	const leveredDcf = await fmpApi.DiscountedCashFlow.leveredDcf(query);

	return {
		dcfValuation,
		leveredDcf,
	};
};

// this tool will be used by the technical agent.
export const discountedCashFlowTool = createTool({
	id: 'fetch-discounted-cash-flow-data',
	description: 'Fetch discounted cash flow data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
