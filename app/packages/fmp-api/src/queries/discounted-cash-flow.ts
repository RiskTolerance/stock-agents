import { buildQuery } from '../_query-builder.js';

export function DiscountedCashFlowAPI(apiKey: string) {
	return {
		async dcfValuation(symbol: string): Promise<DcfValuationArr> {
			const query = buildQuery('dcf-valuation', { symbol }, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (DiscountedCashFlow.dcfValuation): ${response.statusText}`
				);
			}
			return await response.json();
		},
		async leveredDcf(symbol: string): Promise<LeveredDcfArr> {
			const query = buildQuery('levered-dcf', { symbol }, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (DiscountedCashFlow.leveredDcf): ${response.statusText}`
				);
			}
			return await response.json();
		},
	};
}

export interface DcfValuation {
	symbol: string;
	date: Date;
	dcf: number;
	'Stock Price': number;
}

export type DcfValuationArr = DcfValuation[];

export interface LeveredDcf {
	symbol: string;
	date: Date;
	dcf: number;
	'Stock Price': number;
}

export type LeveredDcfArr = LeveredDcf[];
