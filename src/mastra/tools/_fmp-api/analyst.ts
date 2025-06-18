import { buildQuery } from './_query-builder';

export const AnalystAPI = {
	/**
	 * Returns annual financial estimates for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get financial estimates for.
	 * @param options - The options for the financial estimates.
	 * @param options.page - The page number of the financial estimates.
	 * @param options.limit - The number of financial estimates to return (must be less than 10).
	 * @returns The financial estimates for the given symbol.
	 */
	async financialEstimates(
		symbol: string,
		options: {
			page: number;
			limit: number;
		}
	): Promise<FinancialEstimatesArr> {
		if (options.limit >= 10) {
			throw new Error('Limit must be less than 10');
		}
		const query = buildQuery('analyst-estimates', {
			symbol,
			period: 'annual',
			...options,
		});
		const response = await fetch(query);
		if (!response.ok) {
			throw new Error(`API error: ${response.statusText}`);
		}
		return (await response.json()) as FinancialEstimatesArr;
	},

	/**
	 * Returns a rating snapshot for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get a rating snapshot for.
	 * @returns The ratings snapshot for the given symbol.
	 */
	async ratingSnapshot(symbol: string): Promise<RatingsSnapshotArr> {
		const query = buildQuery('ratings-snapshot', {
			symbol,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns historical ratings for a given symbol (annual).
	 *
	 * @param symbol - The symbol of the stock to get a historical ratings for.
	 * @param limit - The number of historical ratings to return (must be less than 10).
	 * @returns The historical ratings for the given symbol.
	 */
	async historicalRatings(
		symbol: string,
		limit: number
	): Promise<HistoricalRatingsArr> {
		const query = buildQuery('ratings-historical', {
			symbol,
			limit,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns analyst price targets for a given symbol (US only).
	 *
	 * @param symbol - The symbol of the stock to get analyst price targets for.
	 * @returns The analyst price targets for the given symbol.
	 */
	async analystPriceTarget(symbol: string): Promise<AnalystPriceTargetArr> {
		const query = buildQuery('analyst-price-target', {
			symbol,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns analyst price target consensus for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get price target consensus for.
	 * @returns The analyst price target consensus for the given symbol.
	 */
	async analystPriceTargetConsensus(
		symbol: string
	): Promise<AnalystPriceTargetConsensusArr> {
		const query = buildQuery('price-target-consensus', {
			symbol,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Get the current consensus for a stock's grade.
	 *
	 * @param symbol
	 * @returns The current consensus stock grades for the given symbol.
	 */

	async stockGradesConsensus(symbol: string): Promise<StockGradesConsensusArr> {
		const query = buildQuery('grades-consensus', {
			symbol,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns stock grade changes for a given symbol (US only).
	 * This is questionably useful, as it doesn't show the full picture of ratings, but it could possibly be useful to trigger stock reevaluation.
	 *
	 * @param symbol - The symbol of the stock to get stock grade changes for.
	 * @returns The stock grade changes for the given symbol.
	 */
	async stockGradeChanges(symbol: string): Promise<StockGradeChangesArr> {
		const query = buildQuery('grades', {
			symbol,
		});
		const response = await fetch(query);
		return await response.json();
	},

	async stockGradeHistory(
		symbol: string,
		limit: number
	): Promise<StockGradesHistoryArr> {
		const query = buildQuery('grades-historical', {
			symbol,
			limit,
		});
		const response = await fetch(query);
		return await response.json();
	},
};

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
