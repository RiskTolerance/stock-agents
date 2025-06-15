
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { tradingWorkflow } from './workflows/trading-workflow';
import { fundamentalAgent } from './agents/fundamental-agent';
import { decisionAgent } from './agents/decision-agent';

export const mastra = new Mastra({
  workflows: { tradingWorkflow },
  agents: { fundamentalAgent, decisionAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
