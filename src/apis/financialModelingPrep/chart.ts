import { buildQuery } from '#apis/financialModelingPrep/_query-builder.ts';

export const ChartAPI = {
	async light(
		symbol: string,
		options: {
			from: Date;
			to: Date;
		}
	): Promise<ChartLightArr> {
		const query = buildQuery('historical-price-eod/light', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	async full(
		symbol: string,
		options: {
			from: Date;
			to: Date;
		}
	): Promise<ChartFullArr> {
		const query = buildQuery('historical-price-eod/full', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	async unadjustedStockPrice(
		symbol: string,
		options: {
			from: Date;
			to: Date;
		}
	): Promise<UnadjustedStockPriceArr> {
		const query = buildQuery('historical-price-eod/non-split-adjusted', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	async dividendAdjustedStockPrice(
		symbol: string,
		options: {
			from: Date;
			to: Date;
		}
	): Promise<DividendAdjustedStockPriceArr> {
		const query = buildQuery('historical-price-eod/dividend-adjusted', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	async stockPriceInterval(
		symbol: string,
		interval: '5min' | '15min' | '30min' | '1hour' | '4hour',
		options: {
			from: Date;
			to: Date;
			nonadjusted?: boolean;
		}
	): Promise<StockPriceIntervalArr> {
		const query = buildQuery(`historical-chart/${interval}`, {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},
};

export interface ChartLight {
	symbol: string;
	date: Date;
	price: number;
	volume: number;
}
export type ChartLightArr = ChartLight[];
export interface ChartFull {
	symbol: string;
	date: Date;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	change: number;
	changePercent: number;
	vwap: number;
}
export type ChartFullArr = ChartFull[];
export interface UnadjustedStockPrice {
	symbol: string;
	date: Date;
	adjOpen: number;
	adjHigh: number;
	adjLow: number;
	adjClose: number;
	volume: number;
}
export type UnadjustedStockPriceArr = UnadjustedStockPrice[];
export interface DividendAdjustedStockPrice {
	symbol: string;
	date: Date;
	adjOpen: number;
	adjHigh: number;
	adjLow: number;
	adjClose: number;
	volume: number;
}
export type DividendAdjustedStockPriceArr = DividendAdjustedStockPrice[];
export interface StockPriceInterval {
	date: Date;
	open: number;
	low: number;
	high: number;
	close: number;
	volume: number;
}
export type StockPriceIntervalArr = StockPriceInterval[];
