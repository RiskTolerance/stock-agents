import { buildQuery } from './_query-builder';
import { z } from 'zod';

export const NewsAPI = {
	/**
	 * @returns The stock news for the given symbol.
	 */
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
		const data = await response.json();
		return StockNewsArrSchema.parse(data);
	},

	/**
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
		const data = await response.json();
		return PressReleaseArrSchema.parse(data);
	},

	// The following endpoints are technically under the analyst catagory, but they fit in the news catagory better.

	/**
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
		const data = await response.json();
		return PriceTargetNewsArrSchema.parse(data);
	},

	/**
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
		const data = await response.json();
		return StockGradeNewsArrSchema.parse(data);
	},
};

// ZOD SCHEMAS ------------------------------------------------------------

const StockNewsSchema = z.object({
	symbol: z.string(),
	publishedDate: z.coerce.date(),
	publisher: z.string(),
	title: z.string(),
	image: z.string(),
	site: z.string(),
	text: z.string(),
	url: z.string(),
});
export const StockNewsArrSchema = z.array(StockNewsSchema);

const PressReleaseSchema = z.object({
	symbol: z.string(),
	publishedDate: z.coerce.date(),
	publisher: z.string(),
	title: z.string(),
	image: z.string(),
	site: z.string(),
	text: z.string(),
	url: z.string(),
});
export const PressReleaseArrSchema = z.array(PressReleaseSchema);

const PriceTargetNewsSchema = z.object({
	symbol: z.string(),
	publishedDate: z.coerce.date(),
	newsURL: z.string(),
	newsTitle: z.string(),
	analystName: z.string(),
	priceTarget: z.number(),
	adjPriceTarget: z.number(),
	priceWhenPosted: z.number(),
	newsPublisher: z.string(),
	newsBaseURL: z.string(),
	analystCompany: z.string(),
});
export const PriceTargetNewsArrSchema = z.array(PriceTargetNewsSchema);

const StockGradeNewsSchema = z.object({
	symbol: z.string(),
	publishedDate: z.coerce.date(),
	newsURL: z.string(),
	newsTitle: z.string(),
	newsBaseURL: z.string(),
	newsPublisher: z.string(),
	newGrade: z.string(),
	previousGrade: z.string(),
	gradingCompany: z.string(),
	action: z.string(),
	priceWhenPosted: z.number(),
});
export const StockGradeNewsArrSchema = z.array(StockGradeNewsSchema);

// ZOD-INFERRED TYPES ------------------------------------------------------------

export type StockNewsArr = z.infer<typeof StockNewsArrSchema>;
export type PressReleaseArr = z.infer<typeof PressReleaseArrSchema>;
export type PriceTargetNewsArr = z.infer<typeof PriceTargetNewsArrSchema>;
export type StockGradeNewsArr = z.infer<typeof StockGradeNewsArrSchema>;
