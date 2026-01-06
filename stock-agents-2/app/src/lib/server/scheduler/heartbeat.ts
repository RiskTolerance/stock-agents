import { mastra } from '../mastra/index.js';
import { getLastAgentActivity, logActivity } from '../mastra/tools/activity-tools.js';
import { getMarketStatusTool } from '../mastra/tools/account-manager-tools.js';
import { env } from '$env/dynamic/private';
import { db } from '../db/index.js';
import { agentSessions } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import {
	logSessionStart,
	logSessionComplete,
	logToolCall,
	logDecision,
	logAction,
	type ToolCall,
	type Decision,
	type Action
} from './logging.js';

/**
 * Check if agent has been idle and wake it up if needed
 * @param trigger - Type of trigger ('heartbeat', 'manual', 'api')
 * @param force - If true, bypass idle check and force agent to run
 */
export async function checkAndWakeAgent(
	trigger: 'heartbeat' | 'manual' | 'api' = 'heartbeat',
	force: boolean = false
): Promise<{
	woke: boolean;
	reason: string;
	idleMinutes: number | null;
	sessionId?: string;
}> {
	const lastActivity = await getLastAgentActivity();
	const now = new Date();

	// Calculate idle time
	let idleMinutes: number | null = null;
	if (lastActivity && lastActivity.createdAt) {
		idleMinutes = Math.floor((now.getTime() - new Date(lastActivity.createdAt).getTime()) / (1000 * 60));
	} else {
		// No activity recorded - consider it idle
		idleMinutes = null;
	}

	// Get market status (needed for logging and prompt regardless of force)
	const marketStatus = await getMarketStatusTool.execute({ context: {} });
	const isMarketHours = marketStatus.isMarketHours;

	// Get thresholds from environment or use defaults
	const thresholdMarketHours = parseInt(env.IDLE_THRESHOLD_MARKET_HOURS || '15', 10);
	const thresholdOffHours = parseInt(env.IDLE_THRESHOLD_OFF_HOURS || '60', 10);
	const threshold = isMarketHours ? thresholdMarketHours : thresholdOffHours;

	// If force is true, skip idle check and always wake agent
	if (!force) {
		// Check if agent should be woken
		const shouldWake = idleMinutes === null || idleMinutes >= threshold;

		if (!shouldWake) {
			return {
				woke: false,
				reason: `Agent is active (idle for ${idleMinutes} minutes, threshold: ${threshold} minutes)`,
				idleMinutes
			};
		}
	}

	// Wake the agent
	const wakeReason = force
		? `Force triggered (idle for ${idleMinutes || 'unknown'} minutes)`
		: `Waking agent - idle for ${idleMinutes || 'unknown'} minutes (threshold: ${threshold} minutes)`;
	console.log(`[Heartbeat] ${wakeReason}, market hours: ${isMarketHours}`);

	const agent = mastra.getAgent('accountManagerAgent');
	if (!agent) {
		throw new Error('accountManagerAgent not found');
	}

	// Log wake-up activity
	await logActivity({
		activityType: 'wake_up',
		details: {
			idleMinutes,
			threshold,
			isMarketHours,
			lastActivityType: lastActivity?.activityType || null
		}
	});

	// Create session
	const [session] = await db
		.insert(agentSessions)
		.values({
			trigger,
			status: 'running',
			toolCalls: [],
			decisionsMade: [],
			actionsTaken: []
		})
		.returning();

	const sessionId = session.id;

	// Build wake-up prompt with context
	const lastActionInfo = lastActivity
		? `Last action: ${lastActivity.activityType}${lastActivity.createdAt ? ` at ${new Date(lastActivity.createdAt).toLocaleString()}` : ''}`
		: 'No previous activity recorded';

	const wakeUpPrompt = `You are being activated by the heartbeat system. Here's your current context:

- Time since last activity: ${idleMinutes === null ? 'No activity recorded' : `${idleMinutes} minutes`}
- ${lastActionInfo}
- Market status: ${marketStatus.message}
- Current time: ${now.toLocaleString('en-US', { timeZone: 'America/New_York' })} ET

Based on this context, assess the current state of the portfolio and decide what action to take next. Consider:
- Should you monitor the portfolio?
- Are there stocks that need analysis?
- Should you execute any pending trades?
- Is rebalancing needed?

Use your tools to assess the situation and take appropriate action. Be strategic and thoughtful.`;

	// Log session start
	logSessionStart(sessionId, trigger, {
		idleMinutes,
		marketStatus: marketStatus.message
	});

	// Track session data
	const toolCalls: ToolCall[] = [];
	const decisions: Decision[] = [];
	const actions: Action[] = [];
	const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [
		{ role: 'user', content: wakeUpPrompt }
	];

	let fullReasoning = '';
	let sessionError: string | undefined;
	const maxIterations = 5; // Reduced to prevent excessive looping
	let iteration = 0;
	const analyzedSymbols = new Set<string>(); // Track analyzed stocks to prevent re-analysis
	let tradeExecuted = false; // Track if we've executed a trade this session

	try {
		// Execution loop - continue until agent indicates completion or max iterations
		while (iteration < maxIterations && !tradeExecuted) {
			iteration++;

			// Generate agent response
			const result = await agent.generate(conversationHistory);

			// Track full reasoning
			fullReasoning += result.text + '\n\n';

			// Track tool calls and their results
			if (result.toolCalls && result.toolCalls.length > 0) {
				console.log(`[Heartbeat] Iteration ${iteration}: ${result.toolCalls.length} tool calls`);
				
				for (const toolCall of result.toolCalls) {
					// Mastra tool calls have structure: { type, runId, from, payload: { toolCallId, toolName, args } }
					const payload = (toolCall as any).payload || toolCall;
					const toolName = 
						payload.toolName || 
						(toolCall as any).toolName || 
						(toolCall as any).name || 
						'unknown';
					const args = (payload.args || (toolCall as any).args || {}) as Record<string, unknown>;

					// Log tool call
					const toolCallObj = logToolCall(toolName, args, undefined);
					toolCalls.push(toolCallObj);

					// Track analysis tool calls (by args, since results aren't in this structure)
					if (toolName === 'triggerAnalysisTool' || toolName === 'trigger-stock-analysis') {
						const symbol = (args.symbol as string)?.toUpperCase();
						if (symbol) {
							if (analyzedSymbols.has(symbol)) {
								console.log(`[Heartbeat] Skipping duplicate analysis for ${symbol}`);
							} else {
								analyzedSymbols.add(symbol);
								const actionObj = logAction('analyze', symbol, { triggered: true });
								actions.push(actionObj);
								console.log(`[Heartbeat] Analysis triggered for ${symbol}`);
							}
						}
					}

					// Track trade executions (by args - Mastra auto-executes, so if tool is called, trade happened)
					if (toolName === 'executeTradeTool' || toolName === 'execute-trade') {
						const symbol = (args.symbol as string)?.toUpperCase();
						const side = args.side as string;
						const qty = args.qty as number;
						
						if (symbol && side && qty) {
							tradeExecuted = true;
							const actionObj = logAction('trade', symbol, { side, qty });
							actions.push(actionObj);
							const decisionObj = logDecision(symbol, side.toUpperCase());
							decisions.push(decisionObj);
							console.log(`[Heartbeat] ✓ Trade executed: ${side.toUpperCase()} ${qty} ${symbol}`);
						}
					}

					// Track monitoring
					if (toolName === 'getPortfolioSummaryTool' || toolName === 'get-portfolio-summary') {
						// Only log monitor action once per session
						if (!actions.some(a => a.type === 'monitor')) {
							const actionObj = logAction('monitor');
							actions.push(actionObj);
						}
					}
				}
			}

			// Add assistant response to conversation
			conversationHistory.push({ role: 'assistant', content: result.text });

			// Break if trade was executed
			if (tradeExecuted) {
				console.log(`[Heartbeat] Session complete - trade executed after ${iteration} iterations`);
				break;
			}

			// Check if agent indicates completion
			const lowerText = result.text.toLowerCase();
			const indicatesDone =
				lowerText.includes('completed') ||
				lowerText.includes('finished') ||
				lowerText.includes('done') ||
				lowerText.includes('no further action') ||
				lowerText.includes('going idle') ||
				lowerText.includes('nothing more to do') ||
				lowerText.includes('no trades') ||
				lowerText.includes('will wait');

			if (indicatesDone) {
				console.log(`[Heartbeat] Agent indicates completion after ${iteration} iterations`);
				break;
			}

			// If no tool calls, agent is done thinking
			if (!result.toolCalls || result.toolCalls.length === 0) {
				console.log(`[Heartbeat] No tool calls, ending session after ${iteration} iterations`);
				break;
			}
		}
		
		// Log final summary
		console.log(`[Heartbeat] === Session Summary ===`);
		console.log(`[Heartbeat] Iterations: ${iteration}`);
		console.log(`[Heartbeat] Analyzed: ${Array.from(analyzedSymbols).join(', ') || 'none'}`);
		console.log(`[Heartbeat] Trade executed: ${tradeExecuted ? 'YES' : 'NO'}`);
		console.log(`[Heartbeat] Actions: ${actions.length}`);
		console.log(`[Heartbeat] ========================`)

		// Update session with results
		await db
			.update(agentSessions)
			.set({
				status: 'completed',
				endedAt: new Date(),
				toolCalls: toolCalls as unknown as Record<string, unknown>,
				decisionsMade: decisions as unknown as Record<string, unknown>,
				actionsTaken: actions as unknown as Record<string, unknown>,
				fullReasoning: fullReasoning.trim()
			})
			.where(eq(agentSessions.id, sessionId));

		// Log session completion
		logSessionComplete(sessionId, 'completed', {
			toolCalls: toolCalls.length,
			decisions: decisions.length,
			actions: actions.length
		});

		return {
			woke: true,
			reason: `Woke agent after ${idleMinutes || 'unknown'} minutes of inactivity`,
			idleMinutes,
			sessionId
		};
	} catch (error) {
		sessionError = error instanceof Error ? error.message : String(error);
		console.error(`[Heartbeat] Session error: ${sessionError}`);

		// Update session with error
		await db
			.update(agentSessions)
			.set({
				status: 'failed',
				endedAt: new Date(),
				toolCalls: toolCalls as unknown as Record<string, unknown>,
				decisionsMade: decisions as unknown as Record<string, unknown>,
				actionsTaken: actions as unknown as Record<string, unknown>,
				fullReasoning: fullReasoning.trim(),
				error: sessionError
			})
			.where(eq(agentSessions.id, sessionId));

		logSessionComplete(sessionId, 'failed', {
			toolCalls: toolCalls.length,
			decisions: decisions.length,
			actions: actions.length,
			error: sessionError
		});

		throw error;
	}
}
