import { IncomeStatementQuarterly } from '../types';
import type { IncomeStatementHistoryQuarterly } from '../yahoo-types';

export function getIncomeStatementQuarterly(ishq: IncomeStatementHistoryQuarterly): IncomeStatementQuarterly[] {
  let incomeStatementQuarterly: IncomeStatementQuarterly[] =
    ishq.incomeStatementHistory
      .filter((q: any): q is Required<typeof q> => q !== undefined)
      .slice(0, 8)
      .map((q: any) => ({
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
  return incomeStatementQuarterly;
} 