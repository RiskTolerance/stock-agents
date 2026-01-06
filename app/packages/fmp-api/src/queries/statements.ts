import { buildQuery } from '../_query-builder.js';

export function StatementsAPI(apiKey: string) {
	return {
		async incomeStatement(
			symbol: string,
			options: {
				limit: number;
				period: 'annual' | 'quarter' | 'Q1' | 'Q2' | 'Q3' | 'Q4';
			}
		): Promise<IncomeStatementArr> {
			const query = buildQuery(
				'income-statement',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.incomeStatement): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async balanceSheet(
			symbol: string,
			options: {
				limit: number;
				period: 'annual' | 'quarter' | 'Q1' | 'Q2' | 'Q3' | 'Q4';
			}
		): Promise<BalanceSheetArr> {
			const query = buildQuery(
				'balance-sheet-statement',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.cashFlowStatement): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async cashFlowStatement(
			symbol: string,
			options: {
				limit: number;
				period: 'annual' | 'quarter' | 'Q1' | 'Q2' | 'Q3' | 'Q4';
			}
		): Promise<CashFlowStatementArr> {
			const query = buildQuery(
				'cash-flow-statement',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			return await response.json();
		},

		async keyMetrics(
			symbol: string,
			options: {
				limit: number;
				period: 'annual';
			}
		): Promise<KeyMetricsArr> {
			const query = buildQuery(
				'key-metrics',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.keyMetrics): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async financialRatios(symbol: string): Promise<FinancialRatiosArr> {
			const query = buildQuery(
				'ratios',
				{
					symbol,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.financialRatios): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async keyMetricsTtm(symbol: string): Promise<KeyMetricsTtmArr> {
			const query = buildQuery(
				'key-metrics-ttm',
				{
					symbol,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.keyMetricsTtm): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async financialRatiosTtm(symbol: string): Promise<FinancialRatiosTtmArr> {
			const query = buildQuery(
				'ratios-ttm',
				{
					symbol,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.financialRatiosTtm): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async financialScores(symbol: string): Promise<FinancialScoresArr> {
			const query = buildQuery(
				'financial-scores',
				{
					symbol,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.financialScores): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async ownerEarnings(
			symbol: string,
			limit: number
		): Promise<OwnerEarningsArr> {
			const query = buildQuery(
				'owner-earnings',
				{
					symbol,
					limit,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.ownerEarnings): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async enterpriseValues(
			symbol: string,
			limit: number,
			period: 'annual' | 'quarter' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
		): Promise<EnterpriseValuesArr> {
			const query = buildQuery(
				'enterprise-values',
				{
					symbol,
					limit,
					period,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.enterpriseValues): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async incomeStatementGrowth(
			symbol: string,
			limit: number,
			period: 'annual' | 'quarter' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
		): Promise<IncomeStatementGrowthArr> {
			const query = buildQuery(
				'income-statement-growth',
				{
					symbol,
					limit,
					period,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.incomeStatementGrowth): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async balanceSheetGrowth(
			symbol: string,
			limit: number,
			period: 'annual' | 'quarter' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
		): Promise<BalanceSheetStatementGrowthArr> {
			const query = buildQuery(
				'balance-sheet-statement-growth',
				{
					symbol,
					limit,
					period,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.balanceSheetGrowth): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async cashFlowStatementGrowth(
			symbol: string,
			limit: number,
			period: 'annual' | 'quarter' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
		): Promise<CashflowStatementGrowthArr> {
			const query = buildQuery(
				'cash-flow-statement-growth',
				{
					symbol,
					limit,
					period,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Statements.cashFlowStatementGrowth): ${response.statusText}`
				);
			}
			return await response.json();
		},
	};
}

export interface IncomeStatement {
	date: Date;
	symbol: string;
	reportedCurrency: string;
	cik: string;
	filingDate: Date;
	acceptedDate: Date;
	fiscalYear: string;
	period: string;
	revenue: number;
	costOfRevenue: number;
	grossProfit: number;
	researchAndDevelopmentExpenses: number;
	generalAndAdministrativeExpenses: number;
	sellingAndMarketingExpenses: number;
	sellingGeneralAndAdministrativeExpenses: number;
	otherExpenses: number;
	operatingExpenses: number;
	costAndExpenses: number;
	netInterestIncome: number;
	interestIncome: number;
	interestExpense: number;
	depreciationAndAmortization: number;
	ebitda: number;
	ebit: number;
	nonOperatingIncomeExcludingInterest: number;
	operatingIncome: number;
	totalOtherIncomeExpensesNet: number;
	incomeBeforeTax: number;
	incomeTaxExpense: number;
	netIncomeFromContinuingOperations: number;
	netIncomeFromDiscontinuedOperations: number;
	otherAdjustmentsToNetIncome: number;
	netIncome: number;
	netIncomeDeductions: number;
	bottomLineNetIncome: number;
	eps: number;
	epsDiluted: number;
	weightedAverageShsOut: number;
	weightedAverageShsOutDil: number;
}

export type IncomeStatementArr = IncomeStatement[];
export interface BalanceSheet {
	date: Date;
	symbol: string;
	reportedCurrency: string;
	cik: string;
	filingDate: Date;
	acceptedDate: Date;
	fiscalYear: string;
	period: string;
	cashAndCashEquivalents: number;
	shortTermInvestments: number;
	cashAndShortTermInvestments: number;
	netReceivables: number;
	accountsReceivables: number;
	otherReceivables: number;
	inventory: number;
	prepaids: number;
	otherCurrentAssets: number;
	totalCurrentAssets: number;
	propertyPlantEquipmentNet: number;
	goodwill: number;
	intangibleAssets: number;
	goodwillAndIntangibleAssets: number;
	longTermInvestments: number;
	taxAssets: number;
	otherNonCurrentAssets: number;
	totalNonCurrentAssets: number;
	otherAssets: number;
	totalAssets: number;
	totalPayables: number;
	accountPayables: number;
	otherPayables: number;
	accruedExpenses: number;
	shortTermDebt: number;
	capitalLeaseObligationsCurrent: number;
	taxPayables: number;
	deferredRevenue: number;
	otherCurrentLiabilities: number;
	totalCurrentLiabilities: number;
	longTermDebt: number;
	deferredRevenueNonCurrent: number;
	deferredTaxLiabilitiesNonCurrent: number;
	otherNonCurrentLiabilities: number;
	totalNonCurrentLiabilities: number;
	otherLiabilities: number;
	capitalLeaseObligations: number;
	totalLiabilities: number;
	treasuryStock: number;
	preferredStock: number;
	commonStock: number;
	retainedEarnings: number;
	additionalPaidInCapital: number;
	accumulatedOtherComprehensiveIncomeLoss: number;
	otherTotalStockholdersEquity: number;
	totalStockholdersEquity: number;
	totalEquity: number;
	minorityInterest: number;
	totalLiabilitiesAndTotalEquity: number;
	totalInvestments: number;
	totalDebt: number;
	netDebt: number;
}
export type BalanceSheetArr = BalanceSheet[];
export interface CashFlowStatement {
	date: Date;
	symbol: string;
	reportedCurrency: string;
	cik: string;
	filingDate: Date;
	acceptedDate: Date;
	fiscalYear: string;
	period: string;
	netIncome: number;
	depreciationAndAmortization: number;
	deferredIncomeTax: number;
	stockBasedCompensation: number;
	changeInWorkingCapital: number;
	accountsReceivables: number;
	inventory: number;
	accountsPayables: number;
	otherWorkingCapital: number;
	otherNonCashItems: number;
	netCashProvidedByOperatingActivities: number;
	investmentsInPropertyPlantAndEquipment: number;
	acquisitionsNet: number;
	purchasesOfInvestments: number;
	salesMaturitiesOfInvestments: number;
	otherInvestingActivities: number;
	netCashProvidedByInvestingActivities: number;
	netDebtIssuance: number;
	longTermNetDebtIssuance: number;
	shortTermNetDebtIssuance: number;
	netStockIssuance: number;
	netCommonStockIssuance: number;
	commonStockIssuance: number;
	commonStockRepurchased: number;
	netPreferredStockIssuance: number;
	netDividendsPaid: number;
	commonDividendsPaid: number;
	preferredDividendsPaid: number;
	otherFinancingActivities: number;
	netCashProvidedByFinancingActivities: number;
	effectOfForexChangesOnCash: number;
	netChangeInCash: number;
	cashAtEndOfPeriod: number;
	cashAtBeginningOfPeriod: number;
	operatingCashFlow: number;
	capitalExpenditure: number;
	freeCashFlow: number;
	incomeTaxesPaid: number;
	interestPaid: number;
}
export type CashFlowStatementArr = CashFlowStatement[];
export interface KeyMetrics {
	symbol: string;
	date: Date;
	fiscalYear: string;
	period: string;
	reportedCurrency: string;
	marketCap: number;
	enterpriseValue: number;
	evToSales: number;
	evToOperatingCashFlow: number;
	evToFreeCashFlow: number;
	evToEBITDA: number;
	netDebtToEBITDA: number;
	currentRatio: number;
	incomeQuality: number;
	grahamNumber: number;
	grahamNetNet: number;
	taxBurden: number;
	interestBurden: number;
	workingCapital: number;
	investedCapital: number;
	returnOnAssets: number;
	operatingReturnOnAssets: number;
	returnOnTangibleAssets: number;
	returnOnEquity: number;
	returnOnInvestedCapital: number;
	returnOnCapitalEmployed: number;
	earningsYield: number;
	freeCashFlowYield: number;
	capexToOperatingCashFlow: number;
	capexToDepreciation: number;
	capexToRevenue: number;
	salesGeneralAndAdministrativeToRevenue: number;
	researchAndDevelopementToRevenue: number;
	stockBasedCompensationToRevenue: number;
	intangiblesToTotalAssets: number;
	averageReceivables: number;
	averagePayables: number;
	averageInventory: number;
	daysOfSalesOutstanding: number;
	daysOfPayablesOutstanding: number;
	daysOfInventoryOutstanding: number;
	operatingCycle: number;
	cashConversionCycle: number;
	freeCashFlowToEquity: number;
	freeCashFlowToFirm: number;
	tangibleAssetValue: number;
	netCurrentAssetValue: number;
}

export type KeyMetricsArr = KeyMetrics[];
export interface FinancialRatios {
	symbol: string;
	date: Date;
	fiscalYear: string;
	period: string;
	reportedCurrency: string;
	grossProfitMargin: number;
	ebitMargin: number;
	ebitdaMargin: number;
	operatingProfitMargin: number;
	pretaxProfitMargin: number;
	continuousOperationsProfitMargin: number;
	netProfitMargin: number;
	bottomLineProfitMargin: number;
	receivablesTurnover: number;
	payablesTurnover: number;
	inventoryTurnover: number;
	fixedAssetTurnover: number;
	assetTurnover: number;
	currentRatio: number;
	quickRatio: number;
	solvencyRatio: number;
	cashRatio: number;
	priceToEarningsRatio: number;
	priceToEarningsGrowthRatio: number;
	forwardPriceToEarningsGrowthRatio: number;
	priceToBookRatio: number;
	priceToSalesRatio: number;
	priceToFreeCashFlowRatio: number;
	priceToOperatingCashFlowRatio: number;
	debtToAssetsRatio: number;
	debtToEquityRatio: number;
	debtToCapitalRatio: number;
	longTermDebtToCapitalRatio: number;
	financialLeverageRatio: number;
	workingCapitalTurnoverRatio: number;
	operatingCashFlowRatio: number;
	operatingCashFlowSalesRatio: number;
	freeCashFlowOperatingCashFlowRatio: number;
	debtServiceCoverageRatio: number;
	interestCoverageRatio: number;
	shortTermOperatingCashFlowCoverageRatio: number;
	operatingCashFlowCoverageRatio: number;
	capitalExpenditureCoverageRatio: number;
	dividendPaidAndCapexCoverageRatio: number;
	dividendPayoutRatio: number;
	dividendYield: number;
	dividendYieldPercentage: number;
	revenuePerShare: number;
	netIncomePerShare: number;
	interestDebtPerShare: number;
	cashPerShare: number;
	bookValuePerShare: number;
	tangibleBookValuePerShare: number;
	shareholdersEquityPerShare: number;
	operatingCashFlowPerShare: number;
	capexPerShare: number;
	freeCashFlowPerShare: number;
	netIncomePerEBT: number;
	ebtPerEbit: number;
	priceToFairValue: number;
	debtToMarketCap: number;
	effectiveTaxRate: number;
	enterpriseValueMultiple: number;
}
export type FinancialRatiosArr = FinancialRatios[];
export interface KeyMetricsTtm {
	symbol: string;
	marketCap: number;
	enterpriseValueTTM: number;
	evToSalesTTM: number;
	evToOperatingCashFlowTTM: number;
	evToFreeCashFlowTTM: number;
	evToEBITDATTM: number;
	netDebtToEBITDATTM: number;
	currentRatioTTM: number;
	incomeQualityTTM: number;
	grahamNumberTTM: number;
	grahamNetNetTTM: number;
	taxBurdenTTM: number;
	interestBurdenTTM: number;
	workingCapitalTTM: number;
	investedCapitalTTM: number;
	returnOnAssetsTTM: number;
	operatingReturnOnAssetsTTM: number;
	returnOnTangibleAssetsTTM: number;
	returnOnEquityTTM: number;
	returnOnInvestedCapitalTTM: number;
	returnOnCapitalEmployedTTM: number;
	earningsYieldTTM: number;
	freeCashFlowYieldTTM: number;
	capexToOperatingCashFlowTTM: number;
	capexToDepreciationTTM: number;
	capexToRevenueTTM: number;
	salesGeneralAndAdministrativeToRevenueTTM: number;
	researchAndDevelopementToRevenueTTM: number;
	stockBasedCompensationToRevenueTTM: number;
	intangiblesToTotalAssetsTTM: number;
	averageReceivablesTTM: number;
	averagePayablesTTM: number;
	averageInventoryTTM: number;
	daysOfSalesOutstandingTTM: number;
	daysOfPayablesOutstandingTTM: number;
	daysOfInventoryOutstandingTTM: number;
	operatingCycleTTM: number;
	cashConversionCycleTTM: number;
	freeCashFlowToEquityTTM: number;
	freeCashFlowToFirmTTM: number;
	tangibleAssetValueTTM: number;
	netCurrentAssetValueTTM: number;
}
export type KeyMetricsTtmArr = KeyMetricsTtm[];
export interface FinancialRatiosTtm {
	symbol: string;
	grossProfitMarginTTM: number;
	ebitMarginTTM: number;
	ebitdaMarginTTM: number;
	operatingProfitMarginTTM: number;
	pretaxProfitMarginTTM: number;
	continuousOperationsProfitMarginTTM: number;
	netProfitMarginTTM: number;
	bottomLineProfitMarginTTM: number;
	receivablesTurnoverTTM: number;
	payablesTurnoverTTM: number;
	inventoryTurnoverTTM: number;
	fixedAssetTurnoverTTM: number;
	assetTurnoverTTM: number;
	currentRatioTTM: number;
	quickRatioTTM: number;
	solvencyRatioTTM: number;
	cashRatioTTM: number;
	priceToEarningsRatioTTM: number;
	priceToEarningsGrowthRatioTTM: number;
	forwardPriceToEarningsGrowthRatioTTM: number;
	priceToBookRatioTTM: number;
	priceToSalesRatioTTM: number;
	priceToFreeCashFlowRatioTTM: number;
	priceToOperatingCashFlowRatioTTM: number;
	debtToAssetsRatioTTM: number;
	debtToEquityRatioTTM: number;
	debtToCapitalRatioTTM: number;
	longTermDebtToCapitalRatioTTM: number;
	financialLeverageRatioTTM: number;
	workingCapitalTurnoverRatioTTM: number;
	operatingCashFlowRatioTTM: number;
	operatingCashFlowSalesRatioTTM: number;
	freeCashFlowOperatingCashFlowRatioTTM: number;
	debtServiceCoverageRatioTTM: number;
	interestCoverageRatioTTM: number;
	shortTermOperatingCashFlowCoverageRatioTTM: number;
	operatingCashFlowCoverageRatioTTM: number;
	capitalExpenditureCoverageRatioTTM: number;
	dividendPaidAndCapexCoverageRatioTTM: number;
	dividendPayoutRatioTTM: number;
	dividendYieldTTM: number;
	enterpriseValueTTM: number;
	revenuePerShareTTM: number;
	netIncomePerShareTTM: number;
	interestDebtPerShareTTM: number;
	cashPerShareTTM: number;
	bookValuePerShareTTM: number;
	tangibleBookValuePerShareTTM: number;
	shareholdersEquityPerShareTTM: number;
	operatingCashFlowPerShareTTM: number;
	capexPerShareTTM: number;
	freeCashFlowPerShareTTM: number;
	netIncomePerEBTTTM: number;
	ebtPerEbitTTM: number;
	priceToFairValueTTM: number;
	debtToMarketCapTTM: number;
	effectiveTaxRateTTM: number;
	enterpriseValueMultipleTTM: number;
}
export type FinancialRatiosTtmArr = FinancialRatiosTtm[];
export interface FinancialScores {
	symbol: string;
	reportedCurrency: string;
	altmanZScore: number;
	piotroskiScore: number;
	workingCapital: number;
	totalAssets: number;
	retainedEarnings: number;
	ebit: number;
	marketCap: number;
	totalLiabilities: number;
	revenue: number;
}
export type FinancialScoresArr = FinancialScores[];
export interface OwnerEarnings {
	symbol: string;
	reportedCurrency: string;
	fiscalYear: string;
	period: string;
	date: Date;
	averagePPE: number;
	maintenanceCapex: number;
	ownersEarnings: number;
	growthCapex: number;
	ownersEarningsPerShare: number;
}
export type OwnerEarningsArr = OwnerEarnings[];
export interface EnterpriseValues {
	symbol: string;
	date: Date;
	stockPrice: number;
	numberOfShares: number;
	marketCapitalization: number;
	minusCashAndCashEquivalents: number;
	addTotalDebt: number;
	enterpriseValue: number;
}
export type EnterpriseValuesArr = EnterpriseValues[];
export interface IncomeStatementGrowth {
	symbol: string;
	date: Date;
	fiscalYear: string;
	period: string;
	reportedCurrency: string;
	growthRevenue: number;
	growthCostOfRevenue: number;
	growthGrossProfit: number;
	growthGrossProfitRatio: number;
	growthResearchAndDevelopmentExpenses: number;
	growthGeneralAndAdministrativeExpenses: number;
	growthSellingAndMarketingExpenses: number;
	growthOtherExpenses: number;
	growthOperatingExpenses: number;
	growthCostAndExpenses: number;
	growthInterestIncome: number;
	growthInterestExpense: number;
	growthDepreciationAndAmortization: number;
	growthEBITDA: number;
	growthOperatingIncome: number;
	growthIncomeBeforeTax: number;
	growthIncomeTaxExpense: number;
	growthNetIncome: number;
	growthEPS: number;
	growthEPSDiluted: number;
	growthWeightedAverageShsOut: number;
	growthWeightedAverageShsOutDil: number;
	growthEBIT: number;
	growthNonOperatingIncomeExcludingInterest: number;
	growthNetInterestIncome: number;
	growthTotalOtherIncomeExpensesNet: number;
	growthNetIncomeFromContinuingOperations: number;
	growthOtherAdjustmentsToNetIncome: number;
	growthNetIncomeDeductions: number;
}
export type IncomeStatementGrowthArr = IncomeStatementGrowth[];
export interface BalanceSheetStatementGrowth {
	symbol: string;
	date: Date;
	fiscalYear: string;
	period: string;
	reportedCurrency: string;
	growthCashAndCashEquivalents: number;
	growthShortTermInvestments: number;
	growthCashAndShortTermInvestments: number;
	growthNetReceivables: number;
	growthInventory: number;
	growthOtherCurrentAssets: number;
	growthTotalCurrentAssets: number;
	growthPropertyPlantEquipmentNet: number;
	growthGoodwill: number;
	growthIntangibleAssets: number;
	growthGoodwillAndIntangibleAssets: number;
	growthLongTermInvestments: number;
	growthTaxAssets: number;
	growthOtherNonCurrentAssets: number;
	growthTotalNonCurrentAssets: number;
	growthOtherAssets: number;
	growthTotalAssets: number;
	growthAccountPayables: number;
	growthShortTermDebt: number;
	growthTaxPayables: number;
	growthDeferredRevenue: number;
	growthOtherCurrentLiabilities: number;
	growthTotalCurrentLiabilities: number;
	growthLongTermDebt: number;
	growthDeferredRevenueNonCurrent: number;
	growthDeferredTaxLiabilitiesNonCurrent: number;
	growthOtherNonCurrentLiabilities: number;
	growthTotalNonCurrentLiabilities: number;
	growthOtherLiabilities: number;
	growthTotalLiabilities: number;
	growthPreferredStock: number;
	growthCommonStock: number;
	growthRetainedEarnings: number;
	growthAccumulatedOtherComprehensiveIncomeLoss: number;
	growthOthertotalStockholdersEquity: number;
	growthTotalStockholdersEquity: number;
	growthMinorityInterest: number;
	growthTotalEquity: number;
	growthTotalLiabilitiesAndStockholdersEquity: number;
	growthTotalInvestments: number;
	growthTotalDebt: number;
	growthNetDebt: number;
	growthAccountsReceivables: number;
	growthOtherReceivables: number;
	growthPrepaids: number;
	growthTotalPayables: number;
	growthOtherPayables: number;
	growthAccruedExpenses: number;
	growthCapitalLeaseObligationsCurrent: number;
	growthAdditionalPaidInCapital: number;
	growthTreasuryStock: number;
}
export type BalanceSheetStatementGrowthArr = BalanceSheetStatementGrowth[];
export interface CashflowStatementGrowth {
	symbol: string;
	date: Date;
	fiscalYear: string;
	period: string;
	reportedCurrency: string;
	growthNetIncome: number;
	growthDepreciationAndAmortization: number;
	growthDeferredIncomeTax: number;
	growthStockBasedCompensation: number;
	growthChangeInWorkingCapital: number;
	growthAccountsReceivables: number;
	growthInventory: number;
	growthAccountsPayables: number;
	growthOtherWorkingCapital: number;
	growthOtherNonCashItems: number;
	growthNetCashProvidedByOperatingActivites: number;
	growthInvestmentsInPropertyPlantAndEquipment: number;
	growthAcquisitionsNet: number;
	growthPurchasesOfInvestments: number;
	growthSalesMaturitiesOfInvestments: number;
	growthOtherInvestingActivites: number;
	growthNetCashUsedForInvestingActivites: number;
	growthDebtRepayment: number;
	growthCommonStockIssued: number;
	growthCommonStockRepurchased: number;
	growthDividendsPaid: number;
	growthOtherFinancingActivites: number;
	growthNetCashUsedProvidedByFinancingActivities: number;
	growthEffectOfForexChangesOnCash: number;
	growthNetChangeInCash: number;
	growthCashAtEndOfPeriod: number;
	growthCashAtBeginningOfPeriod: number;
	growthOperatingCashFlow: number;
	growthCapitalExpenditure: number;
	growthFreeCashFlow: number;
	growthNetDebtIssuance: number;
	growthLongTermNetDebtIssuance: number;
	growthShortTermNetDebtIssuance: number;
	growthNetStockIssuance: number;
	growthPreferredDividendsPaid: number;
	growthIncomeTaxesPaid: number;
	growthInterestPaid: number;
}
export type CashflowStatementGrowthArr = CashflowStatementGrowth[];
export interface FinanacialStatementGrowth {
	symbol: string;
	date: Date;
	fiscalYear: string;
	period: string;
	reportedCurrency: string;
	revenueGrowth: number;
	grossProfitGrowth: number;
	ebitgrowth: number;
	operatingIncomeGrowth: number;
	netIncomeGrowth: number;
	epsgrowth: number;
	epsdilutedGrowth: number;
	weightedAverageSharesGrowth: number;
	weightedAverageSharesDilutedGrowth: number;
	dividendsPerShareGrowth: number;
	operatingCashFlowGrowth: number;
	receivablesGrowth: number;
	inventoryGrowth: number;
	assetGrowth: number;
	bookValueperShareGrowth: number;
	debtGrowth: number;
	rdexpenseGrowth: number;
	sgaexpensesGrowth: number;
	freeCashFlowGrowth: number;
	tenYRevenueGrowthPerShare: number;
	fiveYRevenueGrowthPerShare: number;
	threeYRevenueGrowthPerShare: number;
	tenYOperatingCFGrowthPerShare: number;
	fiveYOperatingCFGrowthPerShare: number;
	threeYOperatingCFGrowthPerShare: number;
	tenYNetIncomeGrowthPerShare: number;
	fiveYNetIncomeGrowthPerShare: number;
	threeYNetIncomeGrowthPerShare: number;
	tenYShareholdersEquityGrowthPerShare: number;
	fiveYShareholdersEquityGrowthPerShare: number;
	threeYShareholdersEquityGrowthPerShare: number;
	tenYDividendperShareGrowthPerShare: number;
	fiveYDividendperShareGrowthPerShare: number;
	threeYDividendperShareGrowthPerShare: number;
	ebitdaGrowth: null;
	growthCapitalExpenditure: null;
	tenYBottomLineNetIncomeGrowthPerShare: null;
	fiveYBottomLineNetIncomeGrowthPerShare: null;
	threeYBottomLineNetIncomeGrowthPerShare: null;
}
export type FinanacialStatementGrowthArr = FinanacialStatementGrowth[];
