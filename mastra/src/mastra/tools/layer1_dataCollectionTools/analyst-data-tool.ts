import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;
	const financialEstimates = await fmpApi.Analyst.financialEstimates(query, {
		page: 0,
		limit: 10,
	});
	const ratingSnapshot = await fmpApi.Analyst.ratingSnapshot(query);
	const historicalRatings = await fmpApi.Analyst.historicalRatings(query, 10);
	const analystPriceTarget = await fmpApi.Analyst.analystPriceTarget(query);
	const analystPriceTargetConsensus =
		await fmpApi.Analyst.analystPriceTargetConsensus(query);
	const stockGradesConsensus = await fmpApi.Analyst.stockGradesConsensus(query);
	const stockGradeChanges = await fmpApi.Analyst.stockGradeChanges(query);
	const stockGradeHistory = await fmpApi.Analyst.stockGradeHistory(query, 10);
	return {
		financialEstimates,
		ratingSnapshot,
		historicalRatings,
		analystPriceTarget,
		analystPriceTargetConsensus,
		stockGradesConsensus,
		stockGradeChanges,
		stockGradeHistory,
	};
};

export const analystDataTool = createTool({
	id: 'fetch-analyst-data',
	description: 'Fetch analyst data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
