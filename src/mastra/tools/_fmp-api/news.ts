import { buildQuery } from './_query-builder';

export const NewsAPI = {
	async stockNews(
		symbol: string,
		options: {
			from: Date;
			to: Date;
			page: number;
			limit: number;
		}
	): Promise<StockNewsArr> {
		const query = buildQuery('stock-news', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns press releases for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get press releases for.
	 * @param options - The options for the press releases.
	 * @param options.from - The start date of the press releases.
	 * @param options.to - The end date of the press releases.
	 * @param options.page - The page number of the press releases.
	 * @param options.limit - The number of press releases to return (must be less than 10).
	 * @returns The press releases for the given symbol.
	 */
	async pressReleases(
		symbol: string,
		options: {
			from: Date;
			to: Date;
			page: number;
			limit: number;
		}
	): Promise<PressReleaseArr> {
		const query = buildQuery('press-releases', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	// The following endpoints are technically under the analyst catagory, but they fit in the news catagory better imo.

	/**
	 * Returns price target news for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get price target news for.
	 * @param limit - The number of price target news to return (must be less than 10).
	 * @returns The price target news for the given symbol.
	 */
	async priceTargetNews(
		symbol: string,
		limit: number
	): Promise<PriceTargetNewsArr> {
		const query = buildQuery('price-target-news', {
			symbol,
			limit,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns stock grade news for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get stock grade news for.
	 * @param options - The options for the stock grade news.
	 * @param options.page - The page number of the stock grade news.
	 * @param options.limit - The number of stock grade news to return (must be less than 10).
	 * @returns The stock grade news for the given symbol.
	 */
	async stockGradeNews(
		symbol: string,
		options: { page: number; limit: number }
	): Promise<StockGradeNewsArr> {
		const query = buildQuery('grades-news', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},
};

// NEWS TYPES ------------------------------------------------------------

export interface StockNews {
	symbol: string;
	publishedDate: Date;
	publisher: string;
	title: string;
	image: string;
	site: string;
	text: string;
	url: string;
}
export type StockNewsArr = StockNews[];

export interface PressRelease {
	symbol: string;
	publishedDate: Date;
	publisher: string;
	title: string;
	image: string;
	site: string;
	text: string;
	url: string;
}
export type PressReleaseArr = PressRelease[];

export interface PriceTargetNews {
	symbol: string;
	publishedDate: Date;
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
	publishedDate: Date;
	newsURL: string;
	newsTitle: string;
	newsBaseURL: string;
	newsPublisher: string;
	newGrade: string;
	previousGrade: string;
	gradingCompany: string;
	action: string;
	priceWhenPosted: number;
}
export type StockGradeNewsArr = StockGradeNews[];
