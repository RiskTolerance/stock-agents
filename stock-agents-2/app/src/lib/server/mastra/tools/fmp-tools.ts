import { createTool } from '@mastra/core/tools';
import { createFmpApi } from '../../../../../packages/fmp-api/src/index.js';
import { z } from 'zod';
import { env } from '$env/dynamic/private';

// ============================================================================
// FMP API Client
// ============================================================================

let fmpApiInstance: ReturnType<typeof createFmpApi> | null = null;

export function getFmpApi() {
	if (!env.FMP_API_KEY) throw new Error('FMP_API_KEY is not set');
	if (!fmpApiInstance) {
		fmpApiInstance = createFmpApi(env.FMP_API_KEY);
	}
	return fmpApiInstance;
}

// ============================================================================
// Date Helpers
// ============================================================================

function getToday(): Date {
	return new Date();
}

function getDateDaysAgo(days: number): Date {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date;
}

// ============================================================================
// Analyst Data Tool
// ============================================================================

export const analystDataTool = createTool({
	id: 'fetch-analyst-data',
	description: 'Fetch analyst ratings, price targets, and estimates for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol (e.g., AAPL)')
	}),
	outputSchema: z.object({
		financialEstimates: z.any(),
		ratingSnapshot: z.any(),
		historicalRatings: z.any(),
		analystPriceTarget: z.any(),
		analystPriceTargetConsensus: z.any(),
		stockGradesConsensus: z.any(),
		stockGradeChanges: z.any(),
		stockGradeHistory: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const symbol = context.symbol;

		const [
			financialEstimates,
			ratingSnapshot,
			historicalRatings,
			analystPriceTarget,
			analystPriceTargetConsensus,
			stockGradesConsensus,
			stockGradeChanges,
			stockGradeHistory
		] = await Promise.all([
			fmpApi.Analyst.financialEstimates(symbol, { page: 0, limit: 9 }),
			fmpApi.Analyst.ratingSnapshot(symbol),
			fmpApi.Analyst.historicalRatings(symbol, 9),
			fmpApi.Analyst.analystPriceTarget(symbol),
			fmpApi.Analyst.analystPriceTargetConsensus(symbol),
			fmpApi.Analyst.stockGradesConsensus(symbol),
			fmpApi.Analyst.stockGradeChanges(symbol),
			fmpApi.Analyst.stockGradeHistory(symbol, 9)
		]);

		return {
			financialEstimates,
			ratingSnapshot,
			historicalRatings,
			analystPriceTarget,
			analystPriceTargetConsensus,
			stockGradesConsensus,
			stockGradeChanges,
			stockGradeHistory
		};
	}
});

// ============================================================================
// Company Data Tool
// ============================================================================

export const companyDataTool = createTool({
	id: 'fetch-company-data',
	description: 'Fetch company profile, market cap, and quote information',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		profile: z.any(),
		marketCap: z.any(),
		quote: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const symbol = context.symbol;

		const [profile, marketCap, quote] = await Promise.all([
			fmpApi.Company.profile(symbol),
			fmpApi.Company.marketCap(symbol),
			fmpApi.Technical.quote(symbol)
		]);

		return { profile, marketCap, quote };
	}
});

// ============================================================================
// Financial Statements Tool
// ============================================================================

// ============================================================================
// Individual Statement Tools
// ============================================================================

export const incomeStatementTool = createTool({
	id: 'fetch-income-statement',
	description: 'Fetch income statement data for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z.number().default(4).describe('Number of periods to fetch')
	}),
	outputSchema: z.object({
		incomeStatement: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period, limit } = context;
		const incomeStatement = await fmpApi.Statements.incomeStatement(symbol, { period, limit });
		return { incomeStatement };
	}
});

export const balanceSheetTool = createTool({
	id: 'fetch-balance-sheet',
	description: 'Fetch balance sheet data for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z.number().default(4).describe('Number of periods to fetch')
	}),
	outputSchema: z.object({
		balanceSheet: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period, limit } = context;
		const balanceSheet = await fmpApi.Statements.balanceSheet(symbol, { period, limit });
		return { balanceSheet };
	}
});

export const cashFlowTool = createTool({
	id: 'fetch-cash-flow',
	description: 'Fetch cash flow statement data for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z.number().default(4).describe('Number of periods to fetch')
	}),
	outputSchema: z.object({
		cashFlow: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period, limit } = context;
		const cashFlow = await fmpApi.Statements.cashFlowStatement(symbol, { period, limit });
		return { cashFlow };
	}
});

export const financialRatiosTool = createTool({
	id: 'fetch-financial-ratios',
	description: 'Fetch financial ratios for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		ratios: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol } = context;
		const ratios = await fmpApi.Statements.financialRatios(symbol);
		return { ratios };
	}
});

export const keyMetricsTool = createTool({
	id: 'fetch-key-metrics',
	description: 'Fetch key metrics for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		limit: z.number().default(4).describe('Number of periods to fetch')
	}),
	outputSchema: z.object({
		keyMetrics: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, limit } = context;
		const keyMetrics = await fmpApi.Statements.keyMetrics(symbol, { period: 'annual', limit });
		return { keyMetrics };
	}
});

export const otherStatementTool = createTool({
	id: 'fetch-other-statement',
	description: 'Fetch financial scores (Altman Z-score, Piotroski score) for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		financialScores: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol } = context;
		const financialScores = await fmpApi.Statements.financialScores(symbol);
		return { financialScores };
	}
});

export const incomeStatementGrowthTool = createTool({
	id: 'fetch-income-statement-growth',
	description: 'Fetch income statement growth metrics for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z.number().default(4).describe('Number of periods to fetch')
	}),
	outputSchema: z.object({
		incomeStatementGrowth: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period, limit } = context;
		const incomeStatementGrowth = await fmpApi.Statements.incomeStatementGrowth(
			symbol,
			limit,
			period
		);
		return { incomeStatementGrowth };
	}
});

export const balanceSheetGrowthTool = createTool({
	id: 'fetch-balance-sheet-growth',
	description: 'Fetch balance sheet growth metrics for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z.number().default(4).describe('Number of periods to fetch')
	}),
	outputSchema: z.object({
		balanceSheetGrowth: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period, limit } = context;
		const balanceSheetGrowth = await fmpApi.Statements.balanceSheetGrowth(symbol, limit, period);
		return { balanceSheetGrowth };
	}
});

export const cashFlowGrowthTool = createTool({
	id: 'fetch-cash-flow-growth',
	description: 'Fetch cash flow statement growth metrics for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		period: z.enum(['annual', 'quarter']).default('annual').describe('Reporting period'),
		limit: z.number().default(4).describe('Number of periods to fetch')
	}),
	outputSchema: z.object({
		cashFlowGrowth: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, period, limit } = context;
		const cashFlowGrowth = await fmpApi.Statements.cashFlowStatementGrowth(symbol, limit, period);
		return { cashFlowGrowth };
	}
});

// ============================================================================
// News Tool
// ============================================================================

export const newsDataTool = createTool({
	id: 'fetch-news-data',
	description: 'Fetch recent news articles, price target news, and stock grade news for a stock',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		limit: z.number().default(20).describe('Number of articles to fetch')
	}),
	outputSchema: z.object({
		stockNews: z.any(),
		priceTargetNews: z.any(),
		stockGradeNews: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, limit } = context;

		const [stockNews, priceTargetNews, stockGradeNews] = await Promise.all([
			fmpApi.News.stockNews(symbol, { limit }),
			fmpApi.News.priceTargetNews(symbol, limit),
			fmpApi.News.stockGradeNews(symbol, { page: 0, limit })
		]);

		return { stockNews, priceTargetNews, stockGradeNews };
	}
});

// ============================================================================
// Insider Trading Tool
// ============================================================================

export const insiderDataTool = createTool({
	id: 'fetch-insider-data',
	description: 'Fetch insider trading activity for a stock',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		insiderTrades: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const symbol = context.symbol;

		// Search insider trades for the last 180 days
		const from = getDateDaysAgo(180);
		const to = getToday();

		const insiderTrades = await fmpApi.InsiderTrades.searchInsiderTrades(symbol, {
			from,
			to
		});

		return { insiderTrades };
	}
});

// ============================================================================
// Technical Indicators Tool
// ============================================================================

export const technicalDataTool = createTool({
	id: 'fetch-technical-data',
	description: 'Fetch technical indicators including moving averages, RSI, and ADX',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		quote: z.any(),
		sma50: z.any(),
		sma200: z.any(),
		ema20: z.any(),
		rsi14: z.any(),
		adx14: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const symbol = context.symbol;

		const from = getDateDaysAgo(365);
		const to = getToday();
		const timeframe = '1day';

		const [quote, sma50, sma200, ema20, rsi14, adx14] = await Promise.all([
			fmpApi.Technical.quote(symbol),
			fmpApi.Technical.simpleMovingAverage(symbol, { periodLength: 50, timeframe, from, to }),
			fmpApi.Technical.simpleMovingAverage(symbol, { periodLength: 200, timeframe, from, to }),
			fmpApi.Technical.exponentialMovingAverage(symbol, { periodLength: 20, timeframe, from, to }),
			fmpApi.Technical.relativeStrengthIndex(symbol, { periodLength: 14, timeframe, from, to }),
			fmpApi.Technical.averageDirectionalIndex(symbol, { periodLength: 14, timeframe, from, to })
		]);

		return { quote, sma50, sma200, ema20, rsi14, adx14 };
	}
});

// ============================================================================
// Chart Data Tool
// ============================================================================

export const chartDataTool = createTool({
	id: 'fetch-chart-data',
	description: 'Fetch historical price data for charting',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol'),
		days: z.number().default(365).describe('Number of days of history')
	}),
	outputSchema: z.object({
		priceHistory: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { symbol, days } = context;

		const from = getDateDaysAgo(days);
		const to = getToday();

		const priceHistory = await fmpApi.Chart.full(symbol, { from, to });

		return { priceHistory };
	}
});

// ============================================================================
// Economic Data Tool
// ============================================================================

export const economicDataTool = createTool({
	id: 'fetch-economic-data',
	description: 'Fetch broad economic indicators including treasury rates and economic indicators',
	inputSchema: z.object({
		indicators: z
			.array(
				z.enum([
					'GDP',
					'realGDP',
					'CPI',
					'inflationRate',
					'unemploymentRate',
					'federalFunds',
					'consumerSentiment'
				])
			)
			.default(['GDP', 'CPI', 'unemploymentRate', 'federalFunds'])
			.describe('Economic indicators to fetch')
	}),
	outputSchema: z.object({
		treasuryRates: z.any(),
		economicIndicators: z.any()
	}),
	execute: async ({ context }) => {
		const fmpApi = getFmpApi();
		const { indicators } = context;

		const from = getDateDaysAgo(365);
		const to = getToday();

		// Fetch treasury rates
		const treasuryRates = await fmpApi.Economics.treasuryRates({ from, to });

		// Fetch each economic indicator
		const economicIndicatorResults = await Promise.all(
			indicators.map(async (indicator) => {
				const data = await fmpApi.Economics.economicIndicators(indicator, { from, to });
				return { indicator, data };
			})
		);

		const economicIndicators = Object.fromEntries(
			economicIndicatorResults.map(({ indicator, data }) => [indicator, data])
		);

		return { treasuryRates, economicIndicators };
	}
});

// ============================================================================
// Market Performance Tool
// ============================================================================

export const marketPerformanceTool = createTool({
	id: 'fetch-market-performance',
	description: 'Fetch market performance data including gainers, losers, and most active stocks',
	inputSchema: z.object({}),
	outputSchema: z.object({
		biggestGainers: z.any(),
		biggestLosers: z.any(),
		mostActive: z.any()
	}),
	execute: async () => {
		const fmpApi = getFmpApi();

		const [biggestGainers, biggestLosers, mostActive] = await Promise.all([
			fmpApi.MarketPerformance.biggestGainers(),
			fmpApi.MarketPerformance.biggestLosers(),
			fmpApi.MarketPerformance.mostActive()
		]);

		return { biggestGainers, biggestLosers, mostActive };
	}
});

// ============================================================================
// Export all tools
// ============================================================================

export const fmpTools = {
	analystDataTool,
	companyDataTool,
	incomeStatementTool,
	balanceSheetTool,
	cashFlowTool,
	financialRatiosTool,
	keyMetricsTool,
	otherStatementTool,
	incomeStatementGrowthTool,
	balanceSheetGrowthTool,
	cashFlowGrowthTool,
	newsDataTool,
	insiderDataTool,
	technicalDataTool,
	chartDataTool,
	economicDataTool,
	marketPerformanceTool
};
