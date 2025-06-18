import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import YahooFinance from 'yahoo-finance2';
import {
	getOverviewStatistics,
	getFinancialOverview,
	getSummaryDetail,
	getEarningsTrend,
	getRecommendationTrend,
	getCashflowQuarterly,
	getIncomeStatementQuarterly,
	getBalanceSheetsYearly,
	getBalanceSheetsQuarterly,
} from './logic-steps';

import type { EarningsTrend as YahooEarningsTrend, FinancialData as YahooFinancialData, IncomeStatementHistoryQuarterly as YahooIncomeStatementHistoryQuarterly, Quote as YahooQuote, DefaultKeyStatistics as YahooDefaultKeyStatistics, SummaryDetail as YahooSummaryDetail } from './yahoo-types';

import {
	Fundamentals,
} from './types';

// Helper to assert presence of required fields
export function assertPresent<T>(value: T | undefined | null, name: string): T {
	if (value === undefined || value === null) {
		throw new Error(`No ${name} found`);
	}
	return value;
}

export const execute = async ({ context }: { context: any }): Promise<Fundamentals> => {
	const yf = new YahooFinance();
	const quote = await yf.quote(context.symbol);
	const q = assertPresent(
		Array.isArray(quote) ? quote[0] : quote,
		'quote data'
	);

	const summary = await yf.quoteSummary(context.symbol, {
		modules: ['defaultKeyStatistics', 'financialData', 'summaryDetail', 'incomeStatementHistoryQuarterly', 'cashflowStatementHistoryQuarterly', 'earningsTrend', 'recommendationTrend', 'balanceSheetHistoryQuarterly'],
	});

	const dks = assertPresent(summary.defaultKeyStatistics, 'default key statistics');
	const fd = assertPresent(summary.financialData, 'financial data');
	const sd = assertPresent(summary.summaryDetail, 'summary detail');
	const ishq = assertPresent(summary.incomeStatementHistoryQuarterly, 'income statement history');
	const cshq = assertPresent(summary.cashflowStatementHistoryQuarterly, 'cash flow statement history');
	const et = assertPresent(summary.earningsTrend, 'earnings trend');
	const rt = assertPresent(summary.recommendationTrend, 'recommendation trend');
	const bs = assertPresent(summary.balanceSheetHistoryQuarterly, 'balance sheet history');

	const overviewStatistics = getOverviewStatistics(q as unknown as YahooQuote, dks as unknown as YahooDefaultKeyStatistics);
	const financialOverview = getFinancialOverview(fd as YahooFinancialData, overviewStatistics.simpleQuoteData);
	const summaryDetail = getSummaryDetail(sd as YahooSummaryDetail);
	const earningsTrend = getEarningsTrend(et as unknown as YahooEarningsTrend);
	const recommendationTrend = getRecommendationTrend(rt);
	const cashflowQuarterly = getCashflowQuarterly(cshq, overviewStatistics);
	const incomeStatementQuarterly = getIncomeStatementQuarterly(ishq as YahooIncomeStatementHistoryQuarterly);
	const balanceSheetsYearly = getBalanceSheetsYearly(bs);
	const balanceSheetsQuarterly = getBalanceSheetsQuarterly(bs);

	const fundamentals: Fundamentals = {
		overviewStatistics,
		financialOverview,
		summaryDetail,
		earningsTrend,
		cashflowQuarterly,
		incomeStatementQuarterly,
		recommendationTrend,
		balanceSheetsYearly,
		balanceSheetsQuarterly,
	};

	return fundamentals;
};

export * from './types';

export const fundamentalDataTool = createTool({
	id: 'fetch-financial-data',
	description: 'Fetch company financial data for a given stock symbol',
	inputSchema: z.object({ symbol: z.string() }),
	outputSchema: z.any(),
	execute,
});

export type FinancialData = Record<string, Fundamentals>;



