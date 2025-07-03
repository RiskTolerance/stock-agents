import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const totalNonfarmPayroll = await fmpApi.Economics.economicIndicators('totalNonfarmPayroll');
	return { totalNonfarmPayroll };
};

export const totalNonfarmPayrollTool = createTool({
	id: 'fetch-total-nonfarm-payroll',
	description: 'Fetch Total Nonfarm Payroll data.',
	inputSchema: z.object({}),
	execute,
});
