import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { tradingWorkflow } from './workflows/trading-workflow.ts';
import { tradingWorkflowParallel } from './workflows/trading-workflow-parallel.ts';

export const mastra = new Mastra({
	workflows: { tradingWorkflow, tradingWorkflowParallel },
	storage: new LibSQLStore({
		// stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
		url: ':memory:',
	}),
	logger: new PinoLogger({
		name: 'Mastra',
		level: 'info',
	}),
});
