import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getFmpApi } from '../utils.js';
import { reduceFinancialScores } from '../../../utils/data-reduction.js';

export const otherStatementTool = createTool({
	id: 'fetch-other-statement',
	description: 'Fetch financial scores (Altman Z-score, Piotroski score) for a stock symbol',
	inputSchema: z.object({
		symbol: z.string().describe('Stock ticker symbol')
	}),
	outputSchema: z.object({
		financialScores: z.any()
	}),
	execute: async ({ context }) => {
		const { symbol } = context;
		console.log(`[Other Statement Tool] Executing for symbol: ${symbol}`);
		
		const fmpApi = getFmpApi();
		const financialScores = await fmpApi.Statements.financialScores(symbol);
		return { financialScores: reduceFinancialScores(financialScores) };
	}
});

