import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { TechnicalAPI } from '#apis/financialModelingPrep/technical.ts';
import dayjs from 'dayjs';

const from = dayjs().subtract(1, 'month').toDate();
const to = dayjs().toDate();

const execute = async ({ context }: { context: any }) => {
	const query = context.query;
	const technicalData = await TechnicalAPI.simpleMovingAverage(query, {
		periodLength: 20,
		timeframe: '1day',
		from,
		to,
	});
	const exponentialMovingAverage = await TechnicalAPI.exponentialMovingAverage(
		query,
		{
			periodLength: 20,
			timeframe: '1day',
			from,
			to,
		}
	);
	const weightedMovingAverage = await TechnicalAPI.weightedMovingAverage(
		query,
		{
			periodLength: 20,
			timeframe: '1day',
			from,
			to,
		}
	);
	const doubleExponentialMovingAverage =
		await TechnicalAPI.doubleExponentialMovingAverage(query, {
			periodLength: 20,
			timeframe: '1day',
			from,
			to,
		});
	const tripleExponentialMovingAverage =
		await TechnicalAPI.tripleExponentialMovingAverage(query, {
			periodLength: 20,
			timeframe: '1day',
			from,
			to,
		});
	const relativeStrengthIndex = await TechnicalAPI.relativeStrengthIndex(
		query,
		{
			periodLength: 20,
			timeframe: '1day',
			from,
			to,
		}
	);
	const standardDeviation = await TechnicalAPI.standardDeviation(query, {
		periodLength: 20,
		timeframe: '1day',
		from,
		to,
	});
	const williamsR = await TechnicalAPI.williamsR(query, {
		periodLength: 20,
		timeframe: '1day',
		from,
		to,
	});
	const averageDirectionalIndex = await TechnicalAPI.averageDirectionalIndex(
		query,
		{
			periodLength: 20,
			timeframe: '1day',
			from,
			to,
		}
	);
	return {
		technicalData,
		exponentialMovingAverage,
		weightedMovingAverage,
		doubleExponentialMovingAverage,
		tripleExponentialMovingAverage,
		relativeStrengthIndex,
		standardDeviation,
		williamsR,
		averageDirectionalIndex,
	};
};
export const technicalDataTool = createTool({
	id: 'fetch-technical-data',
	description: 'Fetch technical data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
