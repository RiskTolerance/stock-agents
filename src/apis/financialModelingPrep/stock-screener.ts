import { buildQuery } from './_query-builder';

/**
 * Returns all stocks that match the screeners criteria
 * @param options - The options for the stock screener.
 * @param options.marketCapMoreThan - The minimum market cap for the stocks.
 * @param options.marketCapLessThan - The maximum market cap for the stocks.
 * @param options.sector - The sector for the stocks.
 * @param options.industry - The industry for the stocks.
 * @param options.betaMoreThan - The minimum beta for the stocks.
 * @param options.betaLowerThan - The maximum beta for the stocks.
 * @param options.priceMoreThan - The minimum price for the stocks.
 * @param options.priceLowerThan - The maximum price for the stocks.
 * @param options.dividendMoreThan - The minimum dividend for the stocks.
 * @param options.dividendLowerThan - The maximum dividend for the stocks.
 * @param options.volumeMoreThan - The minimum volume for the stocks.
 * @param options.volumeLowerThan - The maximum volume for the stocks.
 * @param options.exchange - The exchange for the stocks.
 * @param options.country - The country for the stocks.
 * @param options.isEtf - Whether the stocks are ETFs.
 * @param options.isFund - Whether the stocks are funds.
 * @param options.isActivelyTrading - Whether the stocks are actively trading.
 * @param options.limit - The number of stocks to return.
 * @param options.includeAllShareClasses - Whether to include all share classes.
 * @returns The stocks that match the screeners criteria.
 */
const stockScreener = async <S extends MarketSector = MarketSector>({
	options,
}: {
	options: ScreenerOptions<S>;
}): Promise<ScreenerResultArr> => {
	const query = buildQuery('company-screener', options);
	const response = await fetch(query);
	return await response.json();
};

export default stockScreener;

// STOCK SCREENER TYPES ------------------------------------------------------------

interface ScreenerResult {
	symbol: string;
	companyName: string;
	marketCap: number;
	sector: string;
	industry: string;
	beta: number;
	price: number;
	lastAnnualDividend: number;
	volume: number;
	exchange: string;
	exchangeShortName: string;
	country: string;
	isEtf: boolean;
	isFund: boolean;
	isActivelyTrading: boolean;
}

export type ScreenerResultArr = ScreenerResult[];

export type MarketSector = keyof SectorIndustryMap;
export type IndustryForSector<S extends MarketSector> = SectorIndustryMap[S];

type ScreenerOptions<S extends MarketSector = MarketSector> = {
	marketCapMoreThan?: number;
	marketCapLessThan?: number;
	sector?: S;
	industry?: S extends MarketSector ? IndustryForSector<S> : never;
	betaMoreThan?: number;
	betaLowerThan?: number;
	priceMoreThan?: number;
	priceLowerThan?: number;
	dividendMoreThan?: number;
	dividendLowerThan?: number;
	volumeMoreThan?: number;
	volumeLowerThan?: number;
	exchange?: string;
	country?: string;
	isEtf?: boolean;
	isFund?: boolean;
	isActivelyTrading: boolean;
	limit?: number;
	includeAllShareClasses?: boolean;
};

type SectorIndustryMap = {
	Healthcare:
		| 'Biotechnology'
		| 'Medical - Devices'
		| 'Drug Manufacturers - Specialty & Generic'
		| 'Medical - Instruments & Supplies'
		| 'Diagnostics & Research'
		| 'Medical - Care Facilities'
		| 'Health Information Services'
		| 'Drug Manufacturers - General'
		| 'Medical - Distribution'
		| 'Healthcare Plans'
		| 'Pharmaceutical Retailers';
	Financials:
		| 'Banks - Regional'
		| 'Shell Companies'
		| 'Asset Management'
		| 'Capital Markets'
		| 'Credit Services'
		| 'Insurance - Property & Casualty'
		| 'Insurance Brokers'
		| 'Banks - Diversified'
		| 'Insurance - Specialty'
		| 'Insurance - Life'
		| 'Financial Data & Stock Exchanges'
		| 'Mortgage Finance'
		| 'Insurance - Diversified'
		| 'Insurance - Reinsurance'
		| 'Financial Conglomerates';
	Technology:
		| 'Software - Application'
		| 'Software - Infrastructure'
		| 'Information Technology Services'
		| 'Semiconductors'
		| 'Communication Equipment'
		| 'Electronic Components'
		| 'Computer Hardware'
		| 'Scientific & Technical Instruments'
		| 'Semiconductor Equipment & Materials'
		| 'Solar'
		| 'Consumer Electronics'
		| 'Electronics & Computer Distribution';
	Energy:
		| 'Oil & Gas Exploration & Production'
		| 'Oil & Gas Midstream'
		| 'Oil & Gas Equipment & Services'
		| 'Oil & Gas Integrated'
		| 'Oil & Gas Refining & Marketing'
		| 'Uranium'
		| 'Oil & Gas Drilling'
		| 'Thermal Coal';
	Industrials:
		| 'Specialty Industrial Machinery'
		| 'Aerospace & Defense'
		| 'Engineering & Construction'
		| 'Electrical Equipment & Parts'
		| 'Specialty Business Services'
		| 'Marine Shipping'
		| 'Building Products & Equipment'
		| 'Integrated Freight & Logistics'
		| 'Farm & Heavy Construction Machinery'
		| 'Security & Protection Services'
		| 'Conglomerates'
		| 'Staffing & Employment Services'
		| 'Rental & Leasing Services'
		| 'Industrial Distribution'
		| 'Airlines'
		| 'Pollution & Treatment Controls'
		| 'Waste Management'
		| 'Metal Fabrication'
		| 'Trucking'
		| 'Consulting Services'
		| 'Railroads'
		| 'Tools & Accessories'
		| 'Airports & Air Services'
		| 'Business Equipment & Supplies'
		| 'Infrastructure Operations';
	'Communication Services':
		| 'Internet Content & Information'
		| 'Telecom Services'
		| 'Entertainment'
		| 'Advertising Agencies'
		| 'Electronic Gaming & Multimedia'
		| 'Broadcasting'
		| 'Publishing';
	'Consumer Staples':
		| 'Packaged Foods'
		| 'Education & Training Services'
		| 'Household & Personal Products'
		| 'Farm Products'
		| 'Beverages - Non-Alcoholic'
		| 'Food Distribution'
		| 'Beverages - Wineries & Distilleries'
		| 'Grocery Stores'
		| 'Tobacco'
		| 'Discount Stores'
		| 'Beverages - Brewers'
		| 'Confectioners';
	'Consumer Discretionary':
		| 'Auto Parts'
		| 'Restaurants'
		| 'Specialty Retail'
		| 'Internet Retail'
		| 'Furnishings, Fixtures & Appliances'
		| 'Apparel Retail'
		| 'Auto Manufacturers'
		| 'Leisure'
		| 'Auto & Truck Dealerships'
		| 'Apparel Manufacturing'
		| 'Packaging & Containers'
		| 'Residential Construction'
		| 'Travel Services'
		| 'Resorts & Casinos'
		| 'Gambling'
		| 'Footwear & Accessories'
		| 'Recreational Vehicles'
		| 'Personal Services'
		| 'Lodging'
		| 'Luxury Goods'
		| 'Home Improvement Retail'
		| 'Textile Manufacturing'
		| 'Department Stores';
	Materials:
		| 'Specialty Chemicals'
		| 'Gold'
		| 'Other Industrial Metals & Mining'
		| 'Steel'
		| 'Chemicals'
		| 'Agricultural Inputs'
		| 'Building Materials'
		| 'Other Precious Metals & Mining'
		| 'Copper'
		| 'Coking Coal'
		| 'Lumber & Wood Production'
		| 'Paper & Paper Products'
		| 'Silver'
		| 'Aluminum';
	'Real Estate':
		| 'Real Estate - Services'
		| 'REIT - Mortgage'
		| 'REIT - Retail'
		| 'REIT - Office'
		| 'REIT - Residential'
		| 'REIT - Specialty'
		| 'REIT - Healthcare Facilities'
		| 'REIT - Industrial'
		| 'REIT - Diversified'
		| 'Real Estate - Development'
		| 'REIT - Hotel & Motel'
		| 'Real Estate - Diversified';
	Utilities:
		| 'Utilities - Regulated Electric'
		| 'Utilities - Renewable'
		| 'Utilities - Regulated Gas'
		| 'Utilities - Regulated Water'
		| 'Utilities - Diversified'
		| 'Utilities - Independent Power Producers';
};
