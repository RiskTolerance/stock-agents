// ============================================================================
// FMP Tools - Index
// ============================================================================
// Export all FMP tools from individual files for better organization

// Core tools
export { analystDataTool } from './analyst-data-tool.js';
export { companyDataTool } from './company-data-tool.js';
export { newsDataTool } from './news-data-tool.js';
export { insiderDataTool } from './insider-data-tool.js';
export { technicalDataTool } from './technical-data-tool.js';
export { chartDataTool } from './chart-data-tool.js';
export { economicDataTool } from './economic-data-tool.js';
export { marketPerformanceTool } from './market-performance-tool.js';
export { discountedCashFlowTool } from './discounted-cash-flow-tool.js';

// Company statement tools
export { incomeStatementTool } from './company-statements/income-statement-tool.js';
export { balanceSheetTool } from './company-statements/balance-sheet-tool.js';
export { cashFlowTool } from './company-statements/cash-flow-tool.js';
export { financialRatiosTool } from './company-statements/financial-ratios-tool.js';
export { keyMetricsTool } from './company-statements/key-metrics-tool.js';
export { otherStatementTool } from './company-statements/other-statement-tool.js';
export { incomeStatementGrowthTool } from './company-statements/income-statement-growth-tool.js';
export { balanceSheetGrowthTool } from './company-statements/balance-sheet-growth-tool.js';
export { cashFlowGrowthTool } from './company-statements/cash-flow-growth-tool.js';

// Utilities
export { getFmpApi, getToday, getDateDaysAgo } from './utils.js';

// ============================================================================
// Export all tools as an object (for backward compatibility)
// ============================================================================

import { analystDataTool } from './analyst-data-tool.js';
import { companyDataTool } from './company-data-tool.js';
import { incomeStatementTool } from './company-statements/income-statement-tool.js';
import { balanceSheetTool } from './company-statements/balance-sheet-tool.js';
import { cashFlowTool } from './company-statements/cash-flow-tool.js';
import { financialRatiosTool } from './company-statements/financial-ratios-tool.js';
import { keyMetricsTool } from './company-statements/key-metrics-tool.js';
import { otherStatementTool } from './company-statements/other-statement-tool.js';
import { incomeStatementGrowthTool } from './company-statements/income-statement-growth-tool.js';
import { balanceSheetGrowthTool } from './company-statements/balance-sheet-growth-tool.js';
import { cashFlowGrowthTool } from './company-statements/cash-flow-growth-tool.js';
import { newsDataTool } from './news-data-tool.js';
import { insiderDataTool } from './insider-data-tool.js';
import { technicalDataTool } from './technical-data-tool.js';
import { chartDataTool } from './chart-data-tool.js';
import { economicDataTool } from './economic-data-tool.js';
import { marketPerformanceTool } from './market-performance-tool.js';
import { discountedCashFlowTool } from './discounted-cash-flow-tool.js';

export const fmpTools = {
	analystDataTool,
	companyDataTool,
	incomeStatementTool,
	balanceSheetTool,
	cashFlowTool,
	financialRatiosTool,
	keyMetricsTool,
	otherStatementTool,
	incomeStatementGrowthTool,
	balanceSheetGrowthTool,
	cashFlowGrowthTool,
	newsDataTool,
	insiderDataTool,
	technicalDataTool,
	chartDataTool,
	economicDataTool,
	marketPerformanceTool,
	discountedCashFlowTool
};

