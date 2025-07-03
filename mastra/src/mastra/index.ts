import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { tradingWorkflow } from './workflows/trading-workflow.ts';
import { analystAgent } from '#agents/layer1_dataCollectionAgents/analyst-agent.ts';
import { eventsAgent } from '#agents/layer1_dataCollectionAgents/events-agent.ts';
import { decisionAgent } from '../agents/decision-agent.ts';

export const mastra = new Mastra({
	workflows: { tradingWorkflow },
	agents: { fundamentalAgent, decisionAgent },
	storage: new LibSQLStore({
		// stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
		url: ':memory:',
	}),
	logger: new PinoLogger({
		name: 'Mastra',
		level: 'info',
	}),
});
