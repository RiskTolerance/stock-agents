import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';
import dayjs from 'dayjs';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async ({ context }: { context: any }) => {
	const query = context.query;
	// we need to get out the industry/sector of the stock before we can fetch subsiquent data
	const companyData = await fmpApi.Company.profile(query);
	const industry = companyData[0].industry as any;
	const sector = companyData[0].sector as any;
	const exchange = companyData[0].exchange as 'NASDAQ' | 'NYSE' | 'AMEX';

	console.log(
		`industry: ${industry}, sector: ${sector}, exchange: ${exchange}`
	);

	if (!industry || !sector || !exchange) {
		throw new Error('Industry, sector, or exchange not found');
	}

	const industryPerformance =
		await fmpApi.MarketPerformance.industryPerformanceHistory({
			options: industry,
		});
	const sectorPerformance =
		await fmpApi.MarketPerformance.industryPriceEarningsHistory({
			options: sector,
		});
	// TODO: there are probably some technical indicators that can be calculated from this data. Returning time series data is not optimal.
	const marketSectorPerformance =
		await fmpApi.MarketPerformance.marketSectorPerformanceHistory(
			dayjs().subtract(1, 'month').toDate(),
			dayjs().toDate(),
			exchange,
			sector
		);

	const sectorPriceEarningsHistory =
		await fmpApi.MarketPerformance.sectorPriceEarningsHistory(sector);

	return {
		industryPerformance,
		sectorPerformance,
		marketSectorPerformance,
		sectorPriceEarningsHistory,
	};
};

export const broadMarketPerformanceTool = createTool({
	id: 'fetch-broad-market-performance-data',
	description: 'Fetch broad market performance data for a passed stock symbol',
	inputSchema: z.object({
		query: z.string(),
	}),
	execute,
});
