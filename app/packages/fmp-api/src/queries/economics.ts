import { buildQuery } from '../_query-builder.js';

export function EconomicsAPI(apiKey: string) {
	return {
		async treasuryRates(options?: { from?: Date; to?: Date }) {
			const query = buildQuery('treasury-rates', { ...options }, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Economics.treasuryRates): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async economicIndicators(
			name: EconomicIndicatorNameOptions,
			options?: { from?: Date; to?: Date }
		) {
			const query = buildQuery(
				'economic-indicators',
				{
					name,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Economics.economicIndicators): ${response.statusText}`
				);
			}
			return await response.json();
		},
	};
}

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
