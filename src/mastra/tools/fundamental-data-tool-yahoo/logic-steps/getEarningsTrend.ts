import { EarningsTrendPeriod } from '../types';
import type { EarningsTrend as YahooEarningsTrend } from '../yahoo-types';

export function getEarningsTrend(et: YahooEarningsTrend): EarningsTrendPeriod[] {
  return et.trend.map((e: any) => {
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
} 