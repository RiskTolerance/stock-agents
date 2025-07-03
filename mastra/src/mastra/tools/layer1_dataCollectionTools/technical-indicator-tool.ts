import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';
import dayjs from 'dayjs';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;

	// TODO: this is going to take some doing. Returning time series data to the AI would be inefficient.
	// Instead, use Polars and DuckDB to calculate indicators that would be useful to the AI.
	// TODO: Polars
	// TODO: DuckDB
	return {};
};

export const technicalIndicatorTool = createTool({
	id: 'fetch-technical-indicator-data',
	description: 'Fetch technical indicator data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
