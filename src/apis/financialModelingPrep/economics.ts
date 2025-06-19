import { buildQuery } from '#apis/financialModelingPrep/_query-builder.ts';

export const EconomicsAPI = {
	async treasuryRates(): Promise<TreasuryRatesArr> {
		const query = buildQuery('treasury-rates', {});
		const response = await fetch(query);
		return await response.json();
	},

	async economicIndicators(
		name: EconomicIndicatorNameOptions,
		options: { from: Date; to: Date }
	): Promise<EconomicIndicatorsArr> {
		const query = buildQuery('economic-indicators', {
			name,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},
};

export interface TreasuryRate {
	date: Date;
	month1: number;
	month2: number;
	month3: number;
	month6: number;
	year1: number;
	year2: number;
	year3: number;
	year5: number;
	year7: number;
	year10: number;
	year20: number;
	year30: number;
}
export type TreasuryRatesArr = TreasuryRate[];

export type EconomicIndicatorNameOptions =
	| 'GDP'
	| 'realGDP'
	| 'nominalPotentialGDP'
	| 'realGDPPerCapita'
	| 'federalFunds'
	| 'CPI'
	| 'inflationRate'
	| 'inflation'
	| 'retailSales'
	| 'consumerSentiment'
	| 'durableGoods'
	| 'unemploymentRate'
	| 'totalNonfarmPayroll'
	| 'initialClaims'
	| 'industrialProductionTotalIndex'
	| 'newPrivatelyOwnedHousingUnitsStartedTotalUnits'
	| 'totalVehicleSales'
	| 'retailMoneyFunds'
	| 'smoothedUSRecessionProbabilities'
	| '3MonthOr90DayRatesAndYieldsCertificatesOfDeposit'
	| 'commercialBankInterestRateOnCreditCardPlansAllAccounts'
	| '30YearFixedRateMortgageAverage'
	| '15YearFixedRateMortgageAverage';

export interface EconomicIndicator {
	name: string;
	date: Date;
	value: number;
}
export type EconomicIndicatorsArr = EconomicIndicator[];
