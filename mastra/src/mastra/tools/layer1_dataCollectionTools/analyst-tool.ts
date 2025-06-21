import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { AnalystAPI } from '#apis/financialModelingPrep/analyst.ts';

const execute = async ({ context }: { context: any }) => {
	const query = context.query;
	const financialEstimates = await AnalystAPI.financialEstimates(query, {
		page: 1,
		limit: 10,
	});
	const ratingSnapshot = await AnalystAPI.ratingSnapshot(query);
	const historicalRatings = await AnalystAPI.historicalRatings(query, 10);
	const analystPriceTarget = await AnalystAPI.analystPriceTarget(query);
	const analystPriceTargetConsensus =
		await AnalystAPI.analystPriceTargetConsensus(query);
	const stockGradesConsensus = await AnalystAPI.stockGradesConsensus(query);
	const stockGradeChanges = await AnalystAPI.stockGradeChanges(query);
	const stockGradeHistory = await AnalystAPI.stockGradeHistory(query, 10);
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
