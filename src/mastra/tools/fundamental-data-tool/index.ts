import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { execute } from './logic';
import {
	Fundamentals,
} from './types';

// Helper to assert presence of required fields
function assertPresent<T>(value: T | undefined | null, name: string): T {
	if (value === undefined || value === null) {
		throw new Error(`No ${name} found`);
	}
	return value;
}

export const fundamentalDataTool = createTool({
	id: 'fetch-financial-data',
	description: 'Fetch company financial data for a given stock symbol',
	inputSchema: z.object({ symbol: z.string() }),
	outputSchema: z.any(),
	execute,
});

export type FinancialData = Record<string, Fundamentals>;
