/**
 * Structured logging utilities for agent sessions
 */

export interface ToolCall {
	tool: string;
	input: unknown;
	output: unknown;
	timestamp: string;
}

export interface Decision {
	symbol: string;
	decision: string;
	confidence?: number;
	timestamp: string;
}

export interface Action {
	type: 'analyze' | 'trade' | 'monitor';
	symbol?: string;
	details: unknown;
	timestamp: string;
}

/**
 * Log a tool call with structured format
 */
export function logToolCall(tool: string, input: unknown, output: unknown): ToolCall {
	const toolCall: ToolCall = {
		tool,
		input,
		output,
		timestamp: new Date().toISOString()
	};

	console.log(`[Heartbeat] --- Tool Call: ${tool} ---`);
	if (input && typeof input === 'object') {
		const inputStr = JSON.stringify(input).substring(0, 200);
		console.log(`[Heartbeat] Input: ${inputStr}${JSON.stringify(input).length > 200 ? '...' : ''}`);
	}
	if (output && typeof output === 'object') {
		const outputStr = JSON.stringify(output).substring(0, 300);
		console.log(`[Heartbeat] Result: ${outputStr}${JSON.stringify(output).length > 300 ? '...' : ''}`);
	}

	return toolCall;
}

/**
 * Log a decision made by the agent
 */
export function logDecision(symbol: string, decision: string, confidence?: number): Decision {
	const decisionObj: Decision = {
		symbol,
		decision,
		confidence,
		timestamp: new Date().toISOString()
	};

	console.log(`[Heartbeat] Decision: ${symbol} -> ${decision}${confidence ? ` (Confidence: ${confidence})` : ''}`);

	return decisionObj;
}

/**
 * Log an action taken by the agent
 */
export function logAction(type: 'analyze' | 'trade' | 'monitor', symbol?: string, details?: unknown): Action {
	const action: Action = {
		type,
		symbol,
		details: details || {},
		timestamp: new Date().toISOString()
	};

	const symbolStr = symbol ? ` (${symbol})` : '';
	console.log(`[Heartbeat] Action: ${type}${symbolStr}`);

	return action;
}

/**
 * Log session start
 */
export function logSessionStart(sessionId: string, trigger: string, context: Record<string, unknown>): void {
	console.log(`[Heartbeat] === Agent Session Started ===`);
	console.log(`[Heartbeat] Session ID: ${sessionId}`);
	console.log(`[Heartbeat] Trigger: ${trigger}`);
	if (context.idleMinutes !== undefined) {
		console.log(`[Heartbeat] Idle time: ${context.idleMinutes} minutes`);
	}
	if (context.marketStatus) {
		console.log(`[Heartbeat] Market Status: ${context.marketStatus}`);
	}
}

/**
 * Log session completion
 */
export function logSessionComplete(
	sessionId: string,
	status: 'completed' | 'failed',
	summary: {
		toolCalls: number;
		decisions: number;
		actions: number;
		error?: string;
	}
): void {
	console.log(`[Heartbeat] === Session ${status.toUpperCase()} ===`);
	console.log(`[Heartbeat] Session ID: ${sessionId}`);
	console.log(`[Heartbeat] Tool calls: ${summary.toolCalls}`);
	console.log(`[Heartbeat] Decisions: ${summary.decisions}`);
	console.log(`[Heartbeat] Actions: ${summary.actions}`);
	if (summary.error) {
		console.log(`[Heartbeat] Error: ${summary.error}`);
	}
	console.log(`[Heartbeat] ===============================`);
}

