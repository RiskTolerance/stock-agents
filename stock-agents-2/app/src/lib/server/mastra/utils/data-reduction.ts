/**
 * Data Reduction Utilities
 * 
 * Reduces FMP API response sizes BEFORE they're sent to the LLM.
 * This is critical for staying within Groq's rate limits.
 */

/**
 * Extract only essential fields from an income statement
 */
export function reduceIncomeStatement(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 2).map((item) => ({
		date: item.date,
		period: item.period,
		revenue: item.revenue,
		grossProfit: item.grossProfit,
		operatingIncome: item.operatingIncome,
		netIncome: item.netIncome,
		eps: item.eps,
		ebitda: item.ebitda,
		grossProfitRatio: item.grossProfitRatio,
		operatingIncomeRatio: item.operatingIncomeRatio,
		netIncomeRatio: item.netIncomeRatio
	}));
}

/**
 * Extract only essential fields from a balance sheet
 */
export function reduceBalanceSheet(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 2).map((item) => ({
		date: item.date,
		period: item.period,
		totalAssets: item.totalAssets,
		totalLiabilities: item.totalLiabilities,
		totalEquity: item.totalStockholdersEquity,
		cashAndEquivalents: item.cashAndCashEquivalents,
		totalDebt: item.totalDebt,
		netDebt: item.netDebt,
		currentRatio: item.totalCurrentAssets && item.totalCurrentLiabilities
			? (item.totalCurrentAssets / item.totalCurrentLiabilities).toFixed(2)
			: null
	}));
}

/**
 * Extract only essential fields from a cash flow statement
 */
export function reduceCashFlow(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 2).map((item) => ({
		date: item.date,
		period: item.period,
		operatingCashFlow: item.operatingCashFlow,
		capitalExpenditure: item.capitalExpenditure,
		freeCashFlow: item.freeCashFlow,
		dividendsPaid: item.dividendsPaid,
		stockRepurchased: item.commonStockRepurchased
	}));
}

/**
 * Extract only essential fields from financial ratios
 */
export function reduceFinancialRatios(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 2).map((item) => ({
		date: item.date,
		period: item.period,
		peRatio: item.priceEarningsRatio,
		pbRatio: item.priceToBookRatio,
		psRatio: item.priceToSalesRatio,
		debtToEquity: item.debtEquityRatio,
		roe: item.returnOnEquity,
		roa: item.returnOnAssets,
		currentRatio: item.currentRatio,
		quickRatio: item.quickRatio,
		grossMargin: item.grossProfitMargin,
		operatingMargin: item.operatingProfitMargin,
		netMargin: item.netProfitMargin
	}));
}

/**
 * Extract only essential fields from key metrics (annual)
 */
export function reduceKeyMetrics(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 2).map((item) => ({
		date: item.date,
		period: item.period,
		// Valuation metrics
		marketCap: item.marketCap,
		enterpriseValue: item.enterpriseValue,
		evToEBITDA: item.enterpriseValueOverEBITDA || item.evToEBITDA,
		evToRevenue: item.evToSales || item.evToRevenue,
		// Profitability metrics
		returnOnAssets: item.returnOnAssets || item.roa,
		returnOnEquity: item.returnOnEquity || item.roe,
		returnOnInvestedCapital: item.returnOnInvestedCapital || item.roic,
		returnOnCapitalEmployed: item.returnOnCapitalEmployed || item.roce,
		// Per-share metrics
		revenuePerShare: item.revenuePerShare,
		bookValuePerShare: item.bookValuePerShare,
		// Other metrics
		dividendYield: item.dividendYield,
		currentRatio: item.currentRatio,
		earningsYield: item.earningsYield
	}));
}

/**
 * Extract only essential fields from key metrics TTM (Trailing Twelve Months)
 */
export function reduceKeyMetricsTtm(data: any[]): any {
	if (!Array.isArray(data) || data.length === 0) return data;
	const item = data[0]; // TTM is typically a single object
	return {
		// Valuation metrics
		marketCap: item.marketCap,
		enterpriseValue: item.enterpriseValueTTM,
		evToEBITDA: item.evToEBITDATTM,
		evToRevenue: item.evToSalesTTM,
		// Profitability metrics
		returnOnAssets: item.returnOnAssetsTTM,
		returnOnEquity: item.returnOnEquityTTM,
		returnOnInvestedCapital: item.returnOnInvestedCapitalTTM,
		returnOnCapitalEmployed: item.returnOnCapitalEmployedTTM,
		// Per-share metrics
		revenuePerShare: item.revenuePerShareTTM,
		bookValuePerShare: item.bookValuePerShareTTM,
		netIncomePerShare: item.netIncomePerShareTTM, // EPS equivalent
		// Other metrics
		dividendYield: item.dividendYieldTTM,
		currentRatio: item.currentRatioTTM,
		earningsYield: item.earningsYieldTTM
	};
}

/**
 * Extract only essential fields from income statement growth data
 */
export function reduceGrowthData(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 2).map((item) => ({
		date: item.date,
		period: item.period,
		revenueGrowth: item.revenueGrowth || item.growthRevenue,
		netIncomeGrowth: item.netIncomeGrowth || item.growthNetIncome,
		epsGrowth: item.epsgrowth || item.growthEPS,
		operatingIncomeGrowth: item.operatingIncomeGrowth || item.growthOperatingIncome
	}));
}

/**
 * Extract only essential fields from balance sheet growth data
 */
export function reduceBalanceSheetGrowth(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 2).map((item) => ({
		date: item.date,
		period: item.period,
		// Asset growth
		growthTotalAssets: item.growthTotalAssets,
		growthTotalCurrentAssets: item.growthTotalCurrentAssets,
		growthTotalNonCurrentAssets: item.growthTotalNonCurrentAssets,
		growthCashAndCashEquivalents: item.growthCashAndCashEquivalents,
		growthInventory: item.growthInventory,
		growthNetReceivables: item.growthNetReceivables,
		growthPropertyPlantEquipmentNet: item.growthPropertyPlantEquipmentNet,
		// Liability growth
		growthTotalLiabilities: item.growthTotalLiabilities,
		growthTotalCurrentLiabilities: item.growthTotalCurrentLiabilities,
		growthTotalNonCurrentLiabilities: item.growthTotalNonCurrentLiabilities,
		growthLongTermDebt: item.growthLongTermDebt,
		growthShortTermDebt: item.growthShortTermDebt,
		growthAccountPayables: item.growthAccountPayables,
		// Equity growth
		growthTotalStockholdersEquity: item.growthTotalStockholdersEquity,
		growthTotalEquity: item.growthTotalEquity,
		growthRetainedEarnings: item.growthRetainedEarnings,
		growthCommonStock: item.growthCommonStock,
		// Debt metrics
		growthTotalDebt: item.growthTotalDebt,
		growthNetDebt: item.growthNetDebt
	}));
}

/**
 * Extract only essential fields from cash flow growth data
 */
export function reduceCashFlowGrowth(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 2).map((item) => ({
		date: item.date,
		period: item.period,
		growthOperatingCashFlow: item.growthOperatingCashFlow || item.growthNetCashProvidedByOperatingActivites,
		growthFreeCashFlow: item.growthFreeCashFlow,
		growthCapitalExpenditure: item.growthCapitalExpenditure,
		growthNetIncome: item.growthNetIncome,
		growthNetChangeInCash: item.growthNetChangeInCash
	}));
}

/**
 * Extract only essential fields from analyst estimates
 */
export function reduceAnalystEstimates(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 3).map((item) => ({
		date: item.date,
		estimatedRevenue: item.estimatedRevenueAvg,
		estimatedEps: item.estimatedEpsAvg,
		numAnalysts: item.numberAnalystEstimatedRevenue
	}));
}

/**
 * Extract only essential fields from analyst ratings
 */
export function reduceAnalystRatings(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 3).map((item) => ({
		date: item.date,
		rating: item.rating || item.ratingRecommendation,
		score: item.ratingScore,
		strongBuy: item.strongBuy,
		buy: item.buy,
		hold: item.hold,
		sell: item.sell,
		strongSell: item.strongSell
	}));
}

/**
 * Extract only essential fields from price targets
 */
export function reducePriceTargets(data: any): any {
	if (!data) return data;
	// Handle both array and object formats
	const item = Array.isArray(data) ? data[0] : data;
	if (!item) return data;
	return {
		targetHigh: item.targetHigh,
		targetLow: item.targetLow,
		targetMean: item.targetMean || item.targetConsensus,
		targetMedian: item.targetMedian,
		numAnalysts: item.numberOfAnalysts
	};
}

/**
 * Reduce company profile to essential fields
 */
export function reduceCompanyProfile(data: any[]): any {
	if (!data || !data[0]) return data;
	const item = data[0];
	return {
		sector: item.sector,
		industry: item.industry,
		marketCap: item.mktCap,
		employees: item.fullTimeEmployees,
		country: item.country,
		exchange: item.exchangeShortName,
		beta: item.beta,
		description: item.description?.substring(0, 300) // Truncate long description
	};
}

/**
 * Reduce quote to essential fields
 */
export function reduceQuote(data: any[]): any {
	if (!data || !data[0]) return data;
	const item = data[0];
	return {
		price: item.price,
		change: item.change,
		changePercent: item.changesPercentage,
		dayHigh: item.dayHigh,
		dayLow: item.dayLow,
		volume: item.volume,
		avgVolume: item.avgVolume,
		marketCap: item.marketCap,
		pe: item.pe,
		eps: item.eps,
		fiftyDayMA: item.priceAvg50,
		twoHundredDayMA: item.priceAvg200,
		yearHigh: item.yearHigh,
		yearLow: item.yearLow
	};
}

/**
 * Reduce news to essential fields
 */
export function reduceNews(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 5).map((item) => ({ // Only 5 news items
		date: item.publishedDate,
		title: item.title,
		sentiment: item.sentiment,
		source: item.site
		// Skip text/content to save tokens
	}));
}

/**
 * Reduce insider trading data
 */
export function reduceInsiderTrading(data: any[]): any[] {
	if (!Array.isArray(data)) return data;
	return data.slice(0, 5).map((item) => ({
		date: item.transactionDate,
		type: item.transactionType,
		shares: item.securitiesTransacted,
		value: item.price ? item.securitiesTransacted * item.price : null,
		reporterTitle: item.typeOfOwner
	}));
}

/**
 * Reduce technical indicators
 */
export function reduceTechnicalIndicators(data: any[]): any {
	if (!Array.isArray(data) || data.length === 0) return data;
	// Just get the most recent value
	const item = data[0];
	return {
		date: item.date,
		value: item.sma || item.ema || item.rsi || item.adx || item.value
	};
}

/**
 * Reduce financial scores
 */
export function reduceFinancialScores(data: any[]): any {
	if (!data || !data[0]) return data;
	const item = data[0];
	return {
		altmanZScore: item.altmanZScore,
		piotroskiScore: item.piotroskiScore
	};
}

/**
 * Generic function to limit array size and stringify for token estimation
 */
export function limitAndEstimateTokens(data: any, maxTokens: number = 2000): any {
	const str = JSON.stringify(data);
	const estimatedTokens = Math.ceil(str.length / 4);
	
	if (estimatedTokens <= maxTokens) {
		return data;
	}
	
	// Truncate if too large
	const truncatedStr = str.substring(0, maxTokens * 4);
	try {
		// Try to parse back (may fail if cut mid-object)
		return JSON.parse(truncatedStr + '"}]}');
	} catch {
		// Return truncated string with indicator
		return { _truncated: true, data: truncatedStr.substring(0, 1000) + '...[truncated]' };
	}
}

