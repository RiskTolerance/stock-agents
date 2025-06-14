import { RecommendationPeriod } from '../types';
import type { RecommendationTrend as YahooRecommendationTrend } from '../yahoo-types';

export function getRecommendationTrend(rt: YahooRecommendationTrend): RecommendationPeriod[] {
  return rt.trend.map((r: any, i: number, arr: any[]) => {
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
} 