import YahooFinance from 'yahoo-finance2';
import {
  Fundamentals,
  SimpleQuoteData,
  DefaultKeyStatistics,
  FinancialDataSummary,
  OverviewStatistics,
  CashflowQuarterly,
  IncomeStatementQuarterly,
  SummaryDetailSnapshot,
  EarningsTrendPeriod,
  RecommendationPeriod,
  BalanceSheetYearly,
  BalanceSheetQuarterly,
} from './types';

// Helper to assert presence of required fields
export function assertPresent<T>(value: T | undefined | null, name: string): T {
  if (value === undefined || value === null) {
    throw new Error(`No ${name} found`);
  }
  return value;
}

export const execute = async ({ context }: { context: any }): Promise<Fundamentals> => {
  const quote = await YahooFinance.quote(context.symbol);
  const q = assertPresent(
    Array.isArray(quote) ? quote[0] : quote,
    'quote data'
  );

  const summary = await YahooFinance.quoteSummary(context.symbol, {
    modules: 'all',
  });

  const dks = assertPresent(summary.defaultKeyStatistics, 'default key statistics');
  const fd = assertPresent(summary.financialData, 'financial data');
  const sd = assertPresent(summary.summaryDetail, 'summary detail');
  const ishq = assertPresent(summary.incomeStatementHistoryQuarterly, 'income statement history');
  const cshq = assertPresent(summary.cashflowStatementHistoryQuarterly, 'cash flow statement history');
  const et = assertPresent(summary.earningsTrend, 'earnings trend');
  const rt = assertPresent(summary.recommendationTrend, 'recommendation trend');
  const bs = assertPresent(summary.balanceSheetHistoryQuarterly, 'balance sheet history');

  const simpleQuoteData: SimpleQuoteData = {
    marketCap: q.marketCap!,
    sharesOutstanding: q.sharesOutstanding!,
    bookValue: q.bookValue!,
    priceToBook: q.priceToBook!,
    trailingPE: q.trailingPE!,
    forwardPE: q.forwardPE!,
    epsTrailingTwelveMonths: q.epsTrailingTwelveMonths!,
    epsForward: q.epsForward!,
    fiftyTwoWeekRange: {
      low: q.fiftyTwoWeekLow!,
      high: q.fiftyTwoWeekHigh!,
    },
    fiftyTwoWeekChangePercent: q.fiftyTwoWeekChangePercent!,
    fiftyDayAverage: q.fiftyDayAverage!,
    twoHundredDayAverage: q.twoHundredDayAverage!,
    dividendDate: q.dividendDate!,
    trailingAnnualDividendRate: q.trailingAnnualDividendRate!,
    trailingAnnualDividendYield: q.trailingAnnualDividendYield!,
  };

  const defaultKeyStatistics: DefaultKeyStatistics = {
    enterpriseValue: dks.enterpriseValue!,
    profitMargins: dks.profitMargins!,
    pegRatio: dks.pegRatio!,
    enterpriseToRevenue: dks.enterpriseToRevenue!,
    enterpriseToEbitda: dks.enterpriseToEbitda!,
    floatShares: dks.floatShares!,
    sharesShort: dks.sharesShort!,
    sharesPercentSharesOut: dks.sharesPercentSharesOut!,
    shortRatio: dks.shortRatio!,
    heldPercentInsiders: dks.heldPercentInsiders!,
    heldPercentInstitutions: dks.heldPercentInstitutions!,
    week52Change: dks['52WeekChange']!,
    sp500Week52Change: dks.SandP52WeekChange!,
  };

  const financialOverview: FinancialDataSummary = {
    currentPrice: fd.currentPrice!,
    priceTargets: {
      high: fd.targetHighPrice!,
      mean: fd.targetMeanPrice!,
      low: fd.targetLowPrice!,
      median: fd.targetMedianPrice!,
    },
    analystSentiment: {
      meanRating: fd.recommendationMean!,
      key: fd.recommendationKey!,
      opinions: fd.numberOfAnalystOpinions!,
    },
    cash: {
      total: fd.totalCash!,
      perShare: fd.totalCashPerShare!,
    },
    debt: { total: fd.totalDebt! },
    ebitda: fd.ebitda!,
    ratios: {
      quick: fd.quickRatio!,
      current: fd.currentRatio!,
      debtToEquity: fd.debtToEquity!,
    },
    revenue: {
      total: fd.totalRevenue!,
      perShare: fd.revenuePerShare!,
    },
    cashFlows: {
      operating: fd.operatingCashflow!,
      free: fd.freeCashflow!,
    },
    growth: {
      revenue: fd.revenueGrowth!,
      earnings: fd.earningsGrowth!,
    },
    margins: {
      gross: fd.grossMargins!,
      ebitda: fd.ebitdaMargins!,
      operating: fd.operatingMargins!,
      profit: fd.profitMargins!,
    },
    upsidePct: (fd.targetMeanPrice! - fd.currentPrice!) / fd.currentPrice!,
    cashYield: fd.totalCash! / simpleQuoteData.marketCap!,
    fcfYield: fd.freeCashflow! / simpleQuoteData.marketCap!,
    opCfMargin: fd.operatingCashflow! / fd.totalRevenue!,
    growthDiff: fd.earningsGrowth! - fd.revenueGrowth!,
  };

  const overviewStatistics: OverviewStatistics = {
    simpleQuoteData,
    defaultKeyStatistics,
  };

  let cashflowQuarterly: CashflowQuarterly[] = cshq.cashflowStatements
    .filter((q): q is Required<typeof q> => q !== undefined)
    .slice(0, 8)
    .map((c) => ({
      endDate: c.endDate!,
      netIncome: c.netIncome!,
      totalCashFromOperatingActivities: c.totalCashFromOperatingActivities!,
      depreciation: c.depreciation!,
      capitalExpenditures: c.capitalExpenditures!,
      totalCashflowsFromInvestingActivities: c.totalCashflowsFromInvestingActivities!,
      dividendsPaid: c.dividendsPaid!,
      repurchaseOfStock: c.repurchaseOfStock!,
      issuanceOfStock: c.issuanceOfStock!,
      netBorrowings: c.netBorrowings!,
      totalCashFromFinancingActivities: c.totalCashFromFinancingActivities!,
      changeInCash: c.changeInCash!,
      freeCashFlow: c.totalCashFromOperatingActivities! + c.capitalExpenditures!,
    }));

  cashflowQuarterly = cashflowQuarterly.map((curr, i, arr) => {
    const prev = arr[i + 1];
    const marketCap = overviewStatistics.simpleQuoteData.marketCap;
    const cfoGrowthYoY = prev
      ? (curr.totalCashFromOperatingActivities - prev.totalCashFromOperatingActivities) /
        prev.totalCashFromOperatingActivities
      : undefined;
    const fcfGrowthYoY = prev
      ? (curr.freeCashFlow - prev.freeCashFlow) / prev.freeCashFlow
      : undefined;
    return {
      ...curr,
      cfoGrowthYoY,
      fcfGrowthYoY,
      dividendPayoutRatio: curr.dividendsPaid / curr.totalCashFromOperatingActivities,
      buybackYield: curr.repurchaseOfStock / marketCap,
      netLeverageChange: curr.netBorrowings / curr.totalCashFromOperatingActivities,
    };
  });

  let incomeStatementQuarterly: IncomeStatementQuarterly[] =
    ishq.incomeStatementHistory
      .filter((q): q is Required<typeof q> => q !== undefined)
      .slice(0, 8)
      .map((q) => ({
        endDate: q.endDate!,
        totalRevenue: q.totalRevenue!,
        costOfRevenue: q.costOfRevenue!,
        grossProfit: q.grossProfit!,
        researchDevelopment: q.researchDevelopment!,
        sellingGeneralAdministrative: q.sellingGeneralAdministrative!,
        totalOperatingExpenses: q.totalOperatingExpenses!,
        operatingIncome: q.operatingIncome!,
        ebit: q.ebit!,
        interestExpense: q.interestExpense!,
        incomeBeforeTax: q.incomeBeforeTax!,
        incomeTaxExpense: q.incomeTaxExpense!,
        netIncomeFromContinuingOps: q.netIncomeFromContinuingOps!,
        netIncomeApplicableToCommonShares: q.netIncomeApplicableToCommonShares!,
        grossMargin: q.grossProfit! / q.totalRevenue!,
        rdPctOfRevenue: q.researchDevelopment! / q.totalRevenue!,
        sgnaPctOfRevenue: q.sellingGeneralAdministrative! / q.totalRevenue!,
        operatingMargin: q.operatingIncome! / q.totalRevenue!,
        ebitMargin: q.ebit! / q.totalRevenue!,
        netMargin: q.netIncomeApplicableToCommonShares! / q.totalRevenue!,
        effectiveTaxRate:
          q.incomeBeforeTax !== 0
            ? (q.incomeTaxExpense! ?? 0) / q.incomeBeforeTax!
            : undefined,
      }));

  incomeStatementQuarterly = incomeStatementQuarterly.map((curr, i, arr) => {
    const prev = arr[i + 1];
    return {
      ...curr,
      revenueGrowthQoQ: prev
        ? (curr.totalRevenue - prev.totalRevenue) / prev.totalRevenue
        : undefined,
      netIncomeGrowthQoQ: prev
        ? (curr.netIncomeApplicableToCommonShares - prev.netIncomeApplicableToCommonShares) /
          Math.abs(prev.netIncomeApplicableToCommonShares || 1)
        : undefined,
    };
  });

  const summaryDetail: SummaryDetailSnapshot = {
    open: sd.open!,
    previousClose: sd.previousClose!,
    dayLow: sd.dayLow!,
    dayHigh: sd.dayHigh!,
    volume: sd.volume!,
    averageVolume: sd.averageVolume!,
    beta: sd.beta!,
    payoutRatio: sd.payoutRatio!,
    priceToSalesTrailing12Months: sd.priceToSalesTrailing12Months!,
    gapPct: (sd.open! - sd.previousClose!) / sd.previousClose!,
    intradayRangePct: (sd.dayHigh! - sd.dayLow!) / sd.dayLow!,
    relativeVolume: sd.volume! / sd.averageVolume!,
  };

  const earningsTrend: EarningsTrendPeriod[] = et.trend.map((e) => {
    const {
      period,
      earningsEstimate,
      revenueEstimate,
      epsTrend,
      epsRevisions,
    } = e;
    const eps7: number = epsTrend['7daysAgo']!;
    const eps30: number = epsTrend['30daysAgo']!;
    const up30: number = epsRevisions.upLast30days!;
    const down30: number = epsRevisions.downLast30days!;
    const totalRevs: number = up30 + down30;
    return {
      period,
      earnings: {
        avg: earningsEstimate.avg!,
        low: earningsEstimate.low!,
        high: earningsEstimate.high!,
        yearAgoEps: earningsEstimate.yearAgoEps!,
        growth: earningsEstimate.growth!,
        analysts: earningsEstimate.numberOfAnalysts!,
      },
      revenue: {
        avg: revenueEstimate.avg!,
        low: revenueEstimate.low!,
        high: revenueEstimate.high!,
        yearAgo: revenueEstimate.yearAgoRevenue!,
        growth: revenueEstimate.growth!,
      },
      epsTrend: {
        current: epsTrend.current!,
        ago7d: eps7,
        ago30d: eps30,
      },
      epsRevisions: {
        up7d: epsRevisions.upLast7days!,
        up30d: up30,
        down30d: down30,
      },
      growthDifferential: earningsEstimate.growth! - revenueEstimate.growth!,
      epsMomentum7d: eps7 !== undefined ? epsTrend.current! - eps7! : undefined,
      epsMomentum30d: eps30 !== undefined ? epsTrend.current! - eps30! : undefined,
      revisionRatio: totalRevs && totalRevs > 0 ? up30 / totalRevs : undefined,
    };
  });

  const recommendationTrend: RecommendationPeriod[] = rt.trend.map((r, i, arr) => {
    const { strongBuy, buy, hold, sell, strongSell, period } = r;
    const total = strongBuy + buy + hold + sell + strongSell;
    const netBuy = strongBuy + buy - (sell + strongSell);
    const buySellRatio = (strongBuy + buy) / Math.max(1, sell + strongSell);
    let sentimentChange1m: number | undefined;
    if (i + 1 < arr.length) {
      const next = arr[i + 1];
      const nextNetBuy = next.strongBuy + next.buy - (next.sell + next.strongSell);
      sentimentChange1m = netBuy - nextNetBuy;
    }
    return {
      period,
      strongBuy,
      buy,
      hold,
      sell,
      strongSell,
      totalOpinions: total,
      buyPct: (strongBuy + buy) / total,
      holdPct: hold / total,
      sellPct: (sell + strongSell) / total,
      netBuyScore: netBuy,
      buySellRatio,
      sentimentChange1m,
    };
  });

  const balanceSheetsYearly: BalanceSheetYearly[] = bs.balanceSheetStatements
    .filter((q): q is Required<typeof q> => q !== undefined)
    .slice(0, 2)
    .map((q) => ({
      endDate: q.endDate,
      cash: q.cash,
      shortTermInvestments: q.shortTermInvestments,
      totalCurrentAssets: q.totalCurrentAssets,
      totalCurrentLiabilities: q.totalCurrentLiabilities,
      totalAssets: q.totalAssets,
      totalLiab: q.totalLiab,
      totalStockholderEquity: q.totalStockholderEquity,
      netTangibleAssets: q.netTangibleAssets,
      currentRatio: q.totalCurrentAssets / q.totalCurrentLiabilities,
      workingCapital: q.totalCurrentAssets - q.totalCurrentLiabilities,
      debtToEquity: q.totalLiab / q.totalStockholderEquity,
      netDebt: q.longTermDebt + (q.cash - q.shortTermInvestments),
    }));

  const balanceSheetsQuarterly: BalanceSheetQuarterly[] = bs.balanceSheetStatements
    .filter((q): q is Required<typeof q> => q !== undefined)
    .slice(0, 9)
    .map((q) => ({
      endDate: q.endDate,
      cash: q.cash,
      shortTermInvestments: q.shortTermInvestments,
      netReceivables: q.netReceivables,
      totalCurrentAssets: q.totalCurrentAssets,
      totalCurrentLiabilities: q.totalCurrentLiabilities,
      longTermDebt: q.longTermDebt,
      totalLiab: q.totalLiab,
      totalStockholderEquity: q.totalStockholderEquity,
      netTangibleAssets: q.netTangibleAssets,
      currentRatio: q.totalCurrentAssets / q.totalCurrentLiabilities,
      quickRatio: (q.totalCurrentAssets - q.inventory) / q.totalCurrentLiabilities,
      workingCapital: q.totalCurrentAssets - q.totalCurrentLiabilities,
      debtToEquity: q.totalLiab / q.totalStockholderEquity,
      netDebt: q.longTermDebt + (q.cash - q.shortTermInvestments),
    }));

  const balanceSheetQuarterlyWithQoQ = balanceSheetsQuarterly.map((q, i, arr) => {
    const prevQ = arr[i - 1];
    if (!prevQ) {
      return q;
    }
    return {
      ...q,
      assetsGrowthQoQ: (q.totalCurrentAssets - prevQ.totalCurrentAssets) / prevQ.totalCurrentAssets,
      equityGrowthQoQ: (q.totalStockholderEquity - prevQ.totalStockholderEquity) / prevQ.totalStockholderEquity,
      netDebtChangeQoQ: q.netDebt - prevQ.netDebt,
    };
  });

  const fundamentals: Fundamentals = {
    symbol: context.symbol,
    overviewStatistics,
    financialOverview,
    summaryDetail,
    earningsTrend,
    cashflowQuarterly,
    incomeStatementQuarterly,
    recommendationTrend,
    balanceSheetsYearly: balanceSheetsYearly,
    balanceSheetsQuarterly: balanceSheetQuarterlyWithQoQ,
  };

  return fundamentals;
}; 