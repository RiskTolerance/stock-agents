import { buildQuery } from '../_query-builder.js';

export function InsiderTradesAPI(apiKey: string) {
	return {
		async searchInsiderTrades(
			symbol: string,
			options: InsiderTradeQueryOptions
		): Promise<InsiderTradesArr> {
			const query = buildQuery(
				'insider-trading/search',
				{ symbol, ...options },
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (InsiderTrades.searchInsiderTrades): ${response.statusText}`
				);
			}
			return await response.json();
		},
	};
}

type InsiderTradeQueryOptions = {
	from?: Date;
	to?: Date;
	reportingCik?: string;
	companyCik?: string;
	transactionType?: string;
};

export interface InsiderTrades {
	symbol: string;
	filingDate: Date;
	transactionDate: Date;
	reportingCik: string;
	companyCik: string;
	transactionType: string;
	securitiesOwned: number;
	reportingName: string;
	typeOfOwner: string;
	acquisitionOrDisposition: string;
	directOrIndirect: string;
	formType: string;
	securitiesTransacted: number;
	price: number;
	securityName: string;
	url: string;
}

export type InsiderTradesArr = InsiderTrades[];
