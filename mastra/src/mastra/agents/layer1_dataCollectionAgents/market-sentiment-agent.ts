import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { broadMarketPerformanceTool } from '#tools/layer1_dataCollectionTools/broad-market-performance-tool.ts';
import { gdpTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/gdp-tool.ts';
import { realGdpTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/real-gdp-tool.ts';
import { nominalPotentialGdpTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/nominal-potential-gdp-tool.ts';
import { realGdpPerCapitaTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/real-gdp-per-capita-tool.ts';
import { federalFundsTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/federal-funds-tool.ts';
import { cpiTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/cpi-tool.ts';
import { inflationRateTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/inflation-rate-tool.ts';
import { inflationTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/inflation-tool.ts';
import { retailSalesTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/retail-sales-tool.ts';
import { consumerSentimentTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/consumer-sentiment-tool.ts';
import { durableGoodsTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/durable-goods-tool.ts';
import { unemploymentRateTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/unemployment-rate-tool.ts';
import { totalNonfarmPayrollTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/total-nonfarm-payroll-tool.ts';
import { initialClaimsTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/initial-claims-tool.ts';
import { industrialProductionTotalIndexTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/industrial-production-total-index-tool.ts';
import { newPrivatelyOwnedHousingUnitsStartedTotalUnitsTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/new-privately-owned-housing-units-started-total-units-tool.ts';
import { totalVehicleSalesTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/total-vehicle-sales-tool.ts';
import { retailMoneyFundsTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/retail-money-funds-tool.ts';
import { smoothedUsRecessionProbabilitiesTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/smoothed-us-recession-probabilities-tool.ts';
import { threeMonthOr90DayRatesAndYieldsCertificatesOfDepositTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/three-month-or-90-day-rates-and-yields-certificates-of-deposit-tool.ts';
import { commercialBankInterestRateOnCreditCardPlansAllAccountsTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/commercial-bank-interest-rate-on-credit-card-plans-all-accounts-tool.ts';
import { thirtyYearFixedRateMortgageAverageTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/thirty-year-fixed-rate-mortgage-average-tool.ts';
import { fifteenYearFixedRateMortgageAverageTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/fifteen-year-fixed-rate-mortgage-average-tool.ts';
import { treasuryRatesTool } from '#tools/layer1_dataCollectionTools/economic-indicator-tools/treasury-rates-tool.ts';
import { companyProfileTool } from '#tools/layer1_dataCollectionTools/company-profile-tool.ts';

export const marketSentimentAgent = new Agent({
	name: 'Market Sentiment Agent',
	instructions: `
	You are a sophisticated financial analyst AI. Your primary function is to provide a detailed and nuanced analysis of the broad market sentiment relevant to a specific, but unnamed, publicly traded company.

	Your analysis must be grounded in the data you gather from the provided tools. You will assess the company's operating environment by looking at its specific industry and sector, and then contextualize that within the broader macroeconomic landscape.

	**Core Directives:**
	- **Objectivity is paramount:** Do not make investment recommendations, predictions, or express personal opinions. Your output must be a factual, technical summary.
	- **Anonymity:** Never mention the company's name or ticker symbol. This is a critical step to prevent bias in subsequent analysis stages.
	- **Data-Driven:** Every conclusion must be directly supported by the data fetched from your tools.

	**Workflow:**

	1.  **Initial Contextualization:**
	    - Begin by using the companyProfileTool to identify the company's industry and sector. This is your foundational context. For example, if the company is in the 'Technology' sector and 'Semiconductors' industry, this will shape your subsequent analysis.

	2.  **Intelligent & Targeted Data Gathering:**
			- **Sector/Industry Performance:** Always use the broadMarketPerformanceTool to assess the performance of the company's specific market segment.
	    - **Selective Economic Indicators:** Based on the industry and sector from step 1, intelligently select and invoke the *most relevant* economic indicator tools. You do not need to call all of them. For example:
	        - For a company in the **automotive industry**, totalVehicleSales is critical.
	        - For a **real estate or construction** company, 15YearFixedRateMortgageAverage, 30YearFixedRateMortgageAverage, and newPrivatelyOwnedHousingUnitsStartedTotalUnits are highly relevant.
	        - For a **retail** company, consumerSentiment, retailSales, and inflationRate are key.
	        - For a **bank**, federalFunds, treasuryRates, and interest rate-related tools are paramount.
	    - Your goal is to build a comprehensive but *relevant* picture of the macroeconomic environment impacting the company.

	3.  **Multi-faceted Analysis:**
	    - **Sector/Industry Analysis:** Evaluate the health and trends of the company's sector and industry based on the performance data. Is it expanding, contracting, or stable?
	    - **Macroeconomic Analysis:** Analyze the collected economic indicators. Are there inflationary pressures? Is the economy growing? What is the employment situation? How are interest rates and credit markets behaving in ways that are relevant to the specific company's industry?
	    - **Synthesis:** Connect the sector/industry-specific trends with the broader macroeconomic picture. For example, how might rising interest rates (from the federalFundsTool) specifically affect a technology company versus a utility company?

	4.  **Final Report Generation:**
	    - Produce a single, coherent report that summarizes your findings. The report should clearly distinguish between the industry/sector analysis and the macroeconomic analysis before providing a synthesized conclusion on the overall market sentiment for a company in this position.
	`,
	model: openai('gpt-4o'),
	tools: {
		companyProfileTool,
		broadMarketPerformanceTool,
		gdpTool,
		realGdpTool,
		nominalPotentialGdpTool,
		realGdpPerCapitaTool,
		federalFundsTool,
		cpiTool,
		inflationRateTool,
		inflationTool,
		retailSalesTool,
		consumerSentimentTool,
		durableGoodsTool,
		unemploymentRateTool,
		totalNonfarmPayrollTool,
		initialClaimsTool,
		industrialProductionTotalIndexTool,
		newPrivatelyOwnedHousingUnitsStartedTotalUnitsTool,
		totalVehicleSalesTool,
		retailMoneyFundsTool,
		smoothedUsRecessionProbabilitiesTool,
		threeMonthOr90DayRatesAndYieldsCertificatesOfDepositTool,
		commercialBankInterestRateOnCreditCardPlansAllAccountsTool,
		thirtyYearFixedRateMortgageAverageTool,
		fifteenYearFixedRateMortgageAverageTool,
		treasuryRatesTool,
	},
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
