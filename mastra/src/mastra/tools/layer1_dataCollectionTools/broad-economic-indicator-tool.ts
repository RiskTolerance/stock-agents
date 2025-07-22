import { createTool } from '@mastra/core/tools';
import dayjs from 'dayjs';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	// options: GDP,realGDP,nominalPotentialGDP,realGDPPerCapita,federalFunds,CPI,inflationRate,inflation,retailSales,consumerSentiment,durableGoods,unemploymentRate,totalNonfarmPayroll,initialClaims,industrialProductionTotalIndex,newPrivatelyOwnedHousingUnitsStartedTotalUnits,totalVehicleSales,retailMoneyFunds,smoothedUSRecessionProbabilities,3MonthOr90DayRatesAndYieldsCertificatesOfDeposit,commercialBankInterestRateOnCreditCardPlansAllAccounts,30YearFixedRateMortgageAverage,15YearFixedRateMortgageAverage
	const gdp = await fmpApi.Economics.economicIndicators('GDP');
	const realGDP = await fmpApi.Economics.economicIndicators('realGDP');
	const nominalPotentialGDP = await fmpApi.Economics.economicIndicators(
		'nominalPotentialGDP'
	);
	const realGDPPerCapita = await fmpApi.Economics.economicIndicators(
		'realGDPPerCapita'
	);
	const federalFunds = await fmpApi.Economics.economicIndicators(
		'federalFunds'
	);
	const CPI = await fmpApi.Economics.economicIndicators('CPI');
	const inflationRate = await fmpApi.Economics.economicIndicators(
		'inflationRate'
	);
	const inflation = await fmpApi.Economics.economicIndicators('inflation');
	const retailSales = await fmpApi.Economics.economicIndicators('retailSales');
	const consumerSentiment = await fmpApi.Economics.economicIndicators(
		'consumerSentiment'
	);
	const durableGoods = await fmpApi.Economics.economicIndicators(
		'durableGoods'
	);
	const unemploymentRate = await fmpApi.Economics.economicIndicators(
		'unemploymentRate'
	);
	const totalNonfarmPayroll = await fmpApi.Economics.economicIndicators(
		'totalNonfarmPayroll'
	);
	const initialClaims = await fmpApi.Economics.economicIndicators(
		'initialClaims'
	);
	const industrialProductionTotalIndex =
		await fmpApi.Economics.economicIndicators('industrialProductionTotalIndex');
	const newPrivatelyOwnedHousingUnitsStartedTotalUnits =
		await fmpApi.Economics.economicIndicators(
			'newPrivatelyOwnedHousingUnitsStartedTotalUnits'
		);
	const totalVehicleSales = await fmpApi.Economics.economicIndicators(
		'totalVehicleSales'
	);
	const retailMoneyFunds = await fmpApi.Economics.economicIndicators(
		'retailMoneyFunds'
	);
	const smoothedUSRecessionProbabilities =
		await fmpApi.Economics.economicIndicators(
			'smoothedUSRecessionProbabilities'
		);
	const threeMonthOr90DayRatesAndYieldsCertificatesOfDeposit =
		await fmpApi.Economics.economicIndicators(
			'3MonthOr90DayRatesAndYieldsCertificatesOfDeposit'
		);
	const commercialBankInterestRateOnCreditCardPlansAllAccounts =
		await fmpApi.Economics.economicIndicators(
			'commercialBankInterestRateOnCreditCardPlansAllAccounts'
		);
	const thirtyYearFixedRateMortgageAverage =
		await fmpApi.Economics.economicIndicators('30YearFixedRateMortgageAverage');
	const fifteenYearFixedRateMortgageAverage =
		await fmpApi.Economics.economicIndicators('15YearFixedRateMortgageAverage');

	return {
		gdp,
		realGDP,
		nominalPotentialGDP,
		realGDPPerCapita,
		federalFunds,
		CPI,
		inflationRate,
		inflation,
		consumerSentiment,
		durableGoods,
		unemploymentRate,
		totalNonfarmPayroll,
		initialClaims,
		industrialProductionTotalIndex,
		newPrivatelyOwnedHousingUnitsStartedTotalUnits,
		totalVehicleSales,
		retailMoneyFunds,
		smoothedUSRecessionProbabilities,
		threeMonthOr90DayRatesAndYieldsCertificatesOfDeposit,
		commercialBankInterestRateOnCreditCardPlansAllAccounts,
		thirtyYearFixedRateMortgageAverage,
		fifteenYearFixedRateMortgageAverage,
	};
};

export const broadEconomicIndicatorTool = createTool({
	id: 'fetch-broad-economic-indicator',
	description: 'Fetch broad economic indicator data',
	execute,
});
