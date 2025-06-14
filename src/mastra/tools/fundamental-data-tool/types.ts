// Types for fundamental-data-tool

export type EarningsTrendPeriod = {
	period: string;
	earnings: {
		avg: number;
		low: number;
		high: number;
		yearAgoEps: number;
		growth: number;
		analysts: number;
	};
	revenue: {
		avg: number;
		low: number;
		high: number;
		yearAgo: number;
		growth: number;
	};
	epsTrend: {
		current: number;
		ago7d?: number;
		ago30d?: number;
	};
	epsRevisions: {
		up7d: number;
		up30d: number;
		down30d: number;
	};
	growthDifferential: number;
	epsMomentum7d?: number;
	epsMomentum30d?: number;
	revisionRatio?: number;
};

export type RecommendationPeriod = {
	period: string;
	strongBuy: number;
	buy: number;
	hold: number;
	sell: number;
	strongSell: number;
	totalOpinions: number;
	buyPct: number;
	holdPct: number;
	sellPct: number;
	netBuyScore: number;
	buySellRatio?: number;
	sentimentChange1m?: number;
};

export type SummaryDetailSnapshot = {
	open: number;
	previousClose: number;
	dayLow: number;
	dayHigh: number;
	volume: number;
	averageVolume: number;
	beta: number;
	payoutRatio: number;
	priceToSalesTrailing12Months: number;
	gapPct: number;
	intradayRangePct: number;
	relativeVolume: number;
};

export type SimpleQuoteData = {
	marketCap: number;
	sharesOutstanding: number;
	bookValue: number;
	priceToBook: number;
	trailingPE: number;
	forwardPE: number;
	epsTrailingTwelveMonths: number;
	epsForward: number;
	fiftyTwoWeekRange: {
		low: number;
		high: number;
	};
	fiftyTwoWeekChangePercent: number;
	fiftyDayAverage: number;
	twoHundredDayAverage: number;
	dividendDate: Date;
	trailingAnnualDividendRate: number;
	trailingAnnualDividendYield: number;
};

export type DefaultKeyStatistics = {
	enterpriseValue: number;
	profitMargins: number;
	enterpriseToRevenue: number;
	enterpriseToEbitda: number;
	floatShares: number;
	sharesShort: number;
	sharesPercentSharesOut: number;
	shortRatio: number;
	heldPercentInsiders: number;
	heldPercentInstitutions: number;
	week52Change: number;
	sp500Week52Change: number;
};

export type FinancialDataSummary = {
	currentPrice: number;
	priceTargets: {
		high: number;
		mean: number;
		low: number;
		median: number;
	};
	analystSentiment: {
		meanRating: number;
		key: string;
		opinions: number;
	};
	cash: { total: number; perShare: number };
	debt: { total: number };
	ebitda: number;
	ratios: {
		quick: number;
		current: number;
		debtToEquity: number;
	};
	revenue: { total: number; perShare: number };
	cashFlows: { operating: number; free: number };
	growth: { revenue: number; earnings: number };
	margins: {
		gross: number;
		ebitda: number;
		operating: number;
		profit: number;
	};
	upsidePct: number;
	cashYield?: number;
	fcfYield?: number;
	opCfMargin?: number;
	growthDiff?: number;
};

export type OverviewStatistics = {
	simpleQuoteData: SimpleQuoteData;
	defaultKeyStatistics: DefaultKeyStatistics;
};

export type CashflowQuarterly = {
	endDate: Date;
	netIncome: number;
	totalCashFromOperatingActivities: number;
	depreciation: number;
	capitalExpenditures: number;
	totalCashflowsFromInvestingActivities: number;
	dividendsPaid: number;
	repurchaseOfStock: number;
	issuanceOfStock: number;
	netBorrowings: number;
	totalCashFromFinancingActivities: number;
	changeInCash: number;
	freeCashFlow: number;
	cfoGrowthYoY?: number;
	fcfGrowthYoY?: number;
	dividendPayoutRatio?: number;
	buybackYield?: number;
	netLeverageChange?: number;
};

export type IncomeStatementQuarterly = {
	endDate: Date;
	totalRevenue: number;
	costOfRevenue: number;
	grossProfit: number;
	researchDevelopment?: number;
	sellingGeneralAdministrative?: number;
	totalOperatingExpenses: number;
	operatingIncome: number;
	ebit: number;
	interestExpense?: number;
	incomeBeforeTax: number;
	incomeTaxExpense?: number;
	netIncomeFromContinuingOps: number;
	netIncomeApplicableToCommonShares: number;
	grossMargin: number;
	rdPctOfRevenue?: number;
	sgnaPctOfRevenue?: number;
	operatingMargin: number;
	ebitMargin: number;
	netMargin: number;
	effectiveTaxRate?: number;
	revenueGrowthQoQ?: number;
	netIncomeGrowthQoQ?: number;
};

export type BalanceSheetQuarterly = {
	endDate: Date;
	cash: number;
	shortTermInvestments: number;
	netReceivables: number;
	totalCurrentAssets: number;
	totalCurrentLiabilities: number;
	longTermDebt: number;
	totalLiab: number;
	totalStockholderEquity: number;
	netTangibleAssets: number;
	currentRatio: number;
	quickRatio: number;
	workingCapital: number;
	debtToEquity: number;
	netDebt: number;
	assetsGrowthQoQ?: number;
	equityGrowthQoQ?: number;
	netDebtChangeQoQ?: number;
};

export type BalanceSheetYearly = {
	endDate: Date;
	cash: number;
	shortTermInvestments: number;
	totalCurrentAssets: number;
	totalCurrentLiabilities: number;
	totalAssets: number;
	totalLiab: number;
	totalStockholderEquity: number;
	netTangibleAssets: number;
	currentRatio: number;
	workingCapital: number;
	debtToEquity: number;
	netDebt: number;
};

export interface Fundamentals {
	symbol: string;
	overviewStatistics: OverviewStatistics;
	financialOverview: FinancialDataSummary;
	summaryDetail: SummaryDetailSnapshot;
	earningsTrend: EarningsTrendPeriod[];
	cashflowQuarterly: CashflowQuarterly[];
	incomeStatementQuarterly: IncomeStatementQuarterly[];
	recommendationTrend: RecommendationPeriod[];
	balanceSheetsYearly: BalanceSheetYearly[];
	balanceSheetsQuarterly: BalanceSheetQuarterly[];
}

export type FinancialData = Record<string, Fundamentals>; 