import { buildQuery } from '../_query-builder.js';

export function AnalystAPI(apiKey: string) {
	return {
		/**
		 * Returns annual financial estimates for a given symbol.
		 * Financial estimates include analyst projections for revenue, EBITDA, EBIT, net income, SG&A expenses, and EPS, with high, low, and average values, as well as the number of analysts contributing to each estimate.
		 * @returns An array of objects containing annual analyst financial estimates for the specified symbol, including projected revenue, earnings, and other key metrics.
		 */
		async financialEstimates(
			symbol: string,
			options?: {
				page?: number;
				limit?: number;
			}
		): Promise<FinancialEstimatesArr> {
			if (options?.limit && options.limit >= 10) {
				throw new Error('Limit must be less than 10');
			}
			const query = buildQuery(
				'analyst-estimates',
				{
					symbol,
					period: 'annual',
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(`API error: ${response.statusText}`);
			}
			return await response.json();
		},

		/**
		 * Returns a rating snapshot for a given symbol.
		 * The ratings snapshot provides a summary of various financial health and valuation scores, such as discounted cash flow, return on equity, debt to equity, and price-based ratios, as assessed by analysts.
		 * @returns An array of objects containing the latest analyst ratings and financial health scores for the specified symbol.
		 */
		async ratingSnapshot(symbol: string): Promise<RatingsSnapshotArr> {
			const query = buildQuery(
				'ratings-snapshot',
				{
					symbol,
				},
				apiKey
			);
			const response = await fetch(query);
			return await response.json();
		},

		/**
		 * Returns historical ratings for a given symbol (annual).
		 * Historical ratings track how analyst ratings and financial health scores have changed over time, allowing for trend analysis and backtesting of analyst sentiment.
		 * @returns An array of objects showing the evolution of analyst ratings and scores for the specified symbol over time.
		 */
		async historicalRatings(
			symbol: string,
			limit?: number
		): Promise<HistoricalRatingsArr> {
			const query = buildQuery(
				'ratings-historical',
				{
					symbol,
					limit,
				},
				apiKey
			);
			const response = await fetch(query);
			return await response.json();
		},

		/**
		 * Returns analyst price targets for a given symbol (US only).
		 * Analyst price targets summarize the average target prices set by analysts over different time frames (last month, quarter, year, and all time), along with the number of analysts contributing to each period.
		 * @returns An array of objects containing analyst price target statistics for the specified symbol, including averages and counts for various periods.
		 */
		async analystPriceTarget(symbol: string): Promise<AnalystPriceTargetArr> {
			const query = buildQuery(
				'price-target-summary',
				{
					symbol,
				},
				apiKey
			);
			const response = await fetch(query);
			return await response.json();
		},

		/**
		 * Returns analyst price target consensus for a given symbol.
		 * The price target consensus aggregates analyst price targets to provide high, low, median, and consensus values, offering a summary of analyst expectations for the stock's future price.
		 * @returns An array of objects containing the consensus, high, low, and median analyst price targets for the specified symbol.
		 */
		async analystPriceTargetConsensus(
			symbol: string
		): Promise<AnalystPriceTargetConsensusArr> {
			const query = buildQuery(
				'price-target-consensus',
				{
					symbol,
				},
				apiKey
			);
			const response = await fetch(query);
			return await response.json();
		},

		/**
		 * Get the current consensus for a stock's grade.
		 * The consensus grade aggregates analyst recommendations (e.g., strong buy, buy, hold, sell, strong sell) to provide an overall view of market sentiment for the stock.
		 * @returns An array of objects containing the current consensus grades and recommendation counts for the specified symbol.
		 */
		async stockGradesConsensus(
			symbol: string
		): Promise<StockGradesConsensusArr> {
			const query = buildQuery(
				'grades-consensus',
				{
					symbol,
				},
				apiKey
			);
			const response = await fetch(query);
			return await response.json();
		},

		/**
		 * Returns stock grade changes for a given symbol (US only).
		 * This endpoint provides a record of recent changes in analyst grades for the stock, including the grading company, previous and new grades, and the action taken.
		 * @returns An array of objects showing recent analyst grade changes for the specified symbol, including the grading company and grade transitions.
		 */
		async stockGradeChanges(symbol: string): Promise<StockGradeChangesArr> {
			const query = buildQuery(
				'grades',
				{
					symbol,
				},
				apiKey
			);
			const response = await fetch(query);
			return await response.json();
		},

		/**
		 * Returns the historical analyst grades for a given symbol.
		 * This endpoint provides a time series of analyst grade distributions (buy, hold, sell, strong sell) for the stock, useful for tracking changes in analyst sentiment over time.
		 * @returns An array of objects showing the historical distribution of analyst grades for the specified symbol.
		 */
		async stockGradeHistory(
			symbol: string,
			limit?: number
		): Promise<StockGradesHistoryArr> {
			const query = buildQuery(
				'grades-historical',
				{
					symbol,
					limit,
				},
				apiKey
			);
			const response = await fetch(query);
			return await response.json();
		},
	};
}

// Types and interfaces remain exported at the module level
interface FinancialEstimates {
	symbol: string;
	date: Date;
	revenueLow: number;
	revenueHigh: number;
	revenueAvg: number;
	ebitdaLow: number;
	ebitdaHigh: number;
	ebitdaAvg: number;
	ebitLow: number;
	ebitHigh: number;
	ebitAvg: number;
	netIncomeLow: number;
	netIncomeHigh: number;
	netIncomeAvg: number;
	sgaExpenseLow: number;
	sgaExpenseHigh: number;
	sgaExpenseAvg: number;
	epsAvg: number;
	epsHigh: number;
	epsLow: number;
	numAnalystsRevenue: number;
	numAnalystsEps: number;
}
export type FinancialEstimatesArr = FinancialEstimates[];

interface RatingsSnapshot {
	symbol: string;
	rating: string;
	overallScore: number;
	discountedCashFlowScore: number;
	returnOnEquityScore: number;
	returnOnAssetsScore: number;
	debtToEquityScore: number;
	priceToEarningsScore: number;
	priceToBookScore: number;
}
export type RatingsSnapshotArr = RatingsSnapshot[];

interface HistoricalRatings {
	symbol: string;
	date: Date;
	rating: string;
	overallScore: number;
	discountedCashFlowScore: number;
	returnOnEquityScore: number;
	returnOnAssetsScore: number;
	debtToEquityScore: number;
	priceToEarningsScore: number;
	priceToBookScore: number;
}
export type HistoricalRatingsArr = HistoricalRatings[];

interface AnalystPriceTarget {
	symbol: string;
	lastMonthCount: number;
	lastMonthAvgPriceTarget: number;
	lastQuarterCount: number;
	lastQuarterAvgPriceTarget: number;
	lastYearCount: number;
	lastYearAvgPriceTarget: number;
	allTimeCount: number;
	allTimeAvgPriceTarget: number;
	publishers: string;
}
export type AnalystPriceTargetArr = AnalystPriceTarget[];

interface AnalystPriceTargetConsensus {
	symbol: string;
	targetHigh: number;
	targetLow: number;
	targetConsensus: number;
	targetMedian: number;
}
export type AnalystPriceTargetConsensusArr = AnalystPriceTargetConsensus[];

interface StockGradesConsensus {
	symbol: string;
	strongBuy: number;
	buy: number;
	hold: number;
	sell: number;
	strongSell: number;
	consensus: string;
}
export type StockGradesConsensusArr = StockGradesConsensus[];

interface StockGradeChanges {
	symbol: string;
	date: Date;
	gradingCompany: string;
	previousGrade: string;
	newGrade: string;
	action: string;
}
export type StockGradeChangesArr = StockGradeChanges[];

interface StockGradesHistory {
	symbol: string;
	date: Date;
	analystRatingsBuy: number;
	analystRatingsHold: number;
	analystRatingsSell: number;
	analystRatingsStrongSell: number;
}
export type StockGradesHistoryArr = StockGradesHistory[];
