import { buildQuery } from '../_query-builder.js';

export function NewsAPI(apiKey: string) {
	return {
		/**
		 * @returns The stock news for the given symbol.
		 */
		async stockNews(
			symbol: string,
			options: {
				from?: Date;
				to?: Date;
				page?: number;
				limit?: number;
			}
		): Promise<StockNewsArr> {
			const query = buildQuery(
				'news/stock',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(`API error (News.stockNews): ${response.statusText}`);
			}
			return await response.json();
		},

		// The following endpoints are technically under the analyst category, but they fit in the news category better.

		/**
		 * @returns The price target news for the given symbol.
		 */
		async priceTargetNews(
			symbol: string,
			limit: number
		): Promise<PriceTargetNewsArr> {
			const query = buildQuery(
				'price-target-news',
				{
					symbol,
					limit,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (News.priceTargetNews): ${response.statusText}`
				);
			}
			return await response.json();
		},

		/**
		 * @returns The stock grade news for the given symbol.
		 */
		async stockGradeNews(
			symbol: string,
			options: { page: number; limit: number }
		): Promise<StockGradeNewsArr> {
			const query = buildQuery(
				'grades-news',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (News.stockGradeNews): ${response.statusText}`
				);
			}
			return await response.json();
		},
	};
}

export interface StockNews {
	symbol: string;
	publishedDate: string | Date;
	publisher: string;
	title: string;
	image: string;
	site: string;
	text: string;
	url: string;
}
export type StockNewsArr = StockNews[];

export interface PriceTargetNews {
	symbol: string;
	publishedDate: string | Date;
	newsURL: string;
	newsTitle: string;
	analystName: string;
	priceTarget: number;
	adjPriceTarget: number;
	priceWhenPosted: number;
	newsPublisher: string;
	newsBaseURL: string;
	analystCompany: string;
}
export type PriceTargetNewsArr = PriceTargetNews[];

export interface StockGradeNews {
	symbol: string;
	publishedDate: string | Date;
	newsURL: string;
	newsTitle: string;
	newsBaseURL: string;
	newsPublisher: string;
	newGrade: string;
	previousGrade: string | null;
	gradingCompany: string;
	action: string;
	priceWhenPosted: number;
}
export type StockGradeNewsArr = StockGradeNews[];
