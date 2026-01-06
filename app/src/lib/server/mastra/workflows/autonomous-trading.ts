import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { executeTradeTool, calculatePositionSizeTool, getPositionDetailsTool } from '../tools/account-manager-tools.js';

// ============================================================================
// Autonomous Trading Workflow
// ============================================================================
// This workflow runs the account manager agent to make autonomous trading decisions.
// It can be triggered periodically (e.g., hourly, daily) or on-demand.

const autonomousTradingInputSchema = z.object({
	mode: z.enum(['monitor', 'analyze', 'trade', 'rebalance', 'full']).default('full').describe(
		'Mode of operation: monitor (check status), analyze (find opportunities), trade (execute trades), rebalance (rebalance portfolio), full (complete cycle)'
	),
	maxActions: z.number().min(1).max(10).default(5).describe('Maximum number of actions the agent can take in this cycle'),
	symbols: z.array(z.string()).optional().describe('Optional list of symbols to focus on. If not provided, agent decides.')
});

// ============================================================================
// Step 1: Account Manager Decision Making
// ============================================================================

const accountManagerStep = createStep({
	id: 'account-manager-decision',
	inputSchema: autonomousTradingInputSchema,
	outputSchema: z.object({
		actions: z.array(
			z.object({
				type: z.enum(['analyze', 'buy', 'sell', 'monitor', 'rebalance']),
				symbol: z.string().optional(),
				reasoning: z.string(),
				details: z.unknown().optional()
			})
		),
		summary: z.string()
	}),
	execute: async ({ inputData, mastra }) => {
		const { mode, maxActions, symbols } = inputData;

		const agent = mastra.getAgent('accountManagerAgent');
		if (!agent) {
			throw new Error('accountManagerAgent not found');
		}

		// Build prompt based on mode
		let prompt = `You are managing an autonomous trading account. `;

		switch (mode) {
			case 'monitor':
				prompt += `Your task is to monitor the portfolio status and provide a status report. Check positions, performance, and identify any issues or opportunities.`;
				break;
			case 'analyze':
				prompt += `Your task is to identify stocks to analyze. Review the portfolio, market conditions, and decide which stocks need analysis. `;
				if (symbols && symbols.length > 0) {
					prompt += `Focus on these symbols: ${symbols.join(', ')}. `;
				}
				prompt += `Use triggerAnalysisTool to analyze stocks.`;
				break;
			case 'trade':
				prompt += `Your task is to execute trades based on existing analyses. Review analysis history and current positions, then execute buy or sell orders as appropriate.`;
				break;
			case 'rebalance':
				prompt += `Your task is to rebalance the portfolio. Check current positions, ensure proper diversification, and adjust positions to meet target allocations.`;
				break;
			case 'full':
				prompt += `Your task is to run a complete trading cycle: 
1. Monitor portfolio status
2. Identify stocks to analyze
3. Analyze promising stocks
4. Execute trades based on analyses
5. Ensure proper risk management and diversification

You can take up to ${maxActions} actions in this cycle. Be strategic and thoughtful.`;
				break;
		}

		prompt += `\n\nProvide your decisions and actions. Be specific about what you're doing and why.`;

		const result = await agent.generate([
			{
				role: 'user',
				content: prompt
			}
		]);

		// Extract actions from tool calls - this is the key!
		// The agent makes tool calls, and we need to execute them and track what happened
		const actions: Array<{
			type: 'analyze' | 'buy' | 'sell' | 'monitor' | 'rebalance';
			symbol?: string;
			reasoning: string;
			details?: unknown;
		}> = [];

		// Process tool calls to extract actual actions taken
		if (result.toolCalls && result.toolCalls.length > 0) {
			for (const toolCall of result.toolCalls.slice(0, maxActions)) {
				const toolName = toolCall.toolName;
				const args = toolCall.args as Record<string, unknown>;

				if (toolName === 'trigger-stock-analysis' && args.symbol) {
					actions.push({
						type: 'analyze',
						symbol: String(args.symbol).toUpperCase(),
						reasoning: `Analyzed ${args.symbol} - decision: ${toolCall.result?.decision || 'pending'}`,
						details: toolCall.result
					});
				} else if (toolName === 'execute-trade' && args.symbol) {
					const side = String(args.side || '').toLowerCase();
					if (side === 'buy' || side === 'sell') {
						actions.push({
							type: side as 'buy' | 'sell',
							symbol: String(args.symbol).toUpperCase(),
							reasoning: `Executed ${side} order for ${args.symbol}`,
							details: toolCall.result
						});
					}
				} else if (toolName === 'get-portfolio-summary') {
					actions.push({
						type: 'monitor',
						reasoning: 'Checked portfolio status',
						details: toolCall.result
					});
				}
			}
		}

		// Also parse text for any actions mentioned but not executed via tools
		const text = result.text.toLowerCase();
		const mentionedActions = new Set<string>();

		// Check for analysis mentions
		const analyzeMatches = text.matchAll(/analyze\s+([A-Z]{1,5})/gi);
		for (const match of analyzeMatches) {
			const symbol = match[1].toUpperCase();
			if (!actions.some(a => a.type === 'analyze' && a.symbol === symbol)) {
				mentionedActions.add(`analyze-${symbol}`);
				actions.push({
					type: 'analyze',
					symbol,
					reasoning: 'Agent mentioned analyzing this stock'
				});
			}
		}

		// Check for buy mentions
		const buyMatches = text.matchAll(/buy\s+([A-Z]{1,5})/gi);
		for (const match of buyMatches) {
			const symbol = match[1].toUpperCase();
			if (!actions.some(a => a.type === 'buy' && a.symbol === symbol)) {
				mentionedActions.add(`buy-${symbol}`);
				actions.push({
					type: 'buy',
					symbol,
					reasoning: 'Agent mentioned buying this stock'
				});
			}
		}

		// Check for sell mentions
		const sellMatches = text.matchAll(/sell\s+([A-Z]{1,5})/gi);
		for (const match of sellMatches) {
			const symbol = match[1].toUpperCase();
			if (!actions.some(a => a.type === 'sell' && a.symbol === symbol)) {
				mentionedActions.add(`sell-${symbol}`);
				actions.push({
					type: 'sell',
					symbol,
					reasoning: 'Agent mentioned selling this stock'
				});
			}
		}

		return {
			actions: actions.slice(0, maxActions),
			summary: result.text
		};
	}
});

// ============================================================================
// Step 2: Execute Actions Based on Analysis Results
// ============================================================================

const executeActionsStep = createStep({
	id: 'execute-actions',
	inputSchema: z.object({
		actions: z.array(
			z.object({
				type: z.enum(['analyze', 'buy', 'sell', 'monitor', 'rebalance']),
				symbol: z.string().optional(),
				reasoning: z.string(),
				details: z.unknown().optional()
			})
		),
		summary: z.string()
	}),
	outputSchema: z.object({
		executedActions: z.array(
			z.object({
				type: z.string(),
				symbol: z.string().optional(),
				success: z.boolean(),
				message: z.string(),
				details: z.unknown().optional()
			})
		),
		summary: z.string()
	}),
	execute: async ({ inputData }) => {
		const { actions, summary } = inputData;
		const executedActions: Array<{
			type: string;
			symbol?: string;
			success: boolean;
			message: string;
			details?: unknown;
		}> = [];

		for (const action of actions) {
			if (action.type === 'analyze' && action.symbol) {
				// Check if analysis resulted in BUY/SELL decision
				const analysisResult = action.details as { decision?: string; reportId?: string } | undefined;
				const decision = analysisResult?.decision?.toUpperCase() || '';

				if (decision.includes('BUY')) {
					// Analysis says BUY - execute trade
					try {
						// Calculate position size (5% allocation)
						const positionSizeResult = await calculatePositionSizeTool.execute({
							context: { symbol: action.symbol, allocationPercent: 5 }
						});

						if (positionSizeResult.recommendedQty && positionSizeResult.recommendedQty > 0) {
							// Execute buy order
							const tradeResult = await executeTradeTool.execute({
								context: {
									symbol: action.symbol,
									qty: positionSizeResult.recommendedQty,
									side: 'buy',
									type: 'market',
									timeInForce: 'day',
									reportId: analysisResult.reportId
								}
							});

							executedActions.push({
								type: 'buy',
								symbol: action.symbol,
								success: tradeResult.success,
								message: `Executed BUY order: ${tradeResult.message}`,
								details: tradeResult
							});
						} else {
							executedActions.push({
								type: 'buy',
								symbol: action.symbol,
								success: false,
								message: `Could not calculate position size for ${action.symbol}`
							});
						}
					} catch (error) {
						executedActions.push({
							type: 'buy',
							symbol: action.symbol,
							success: false,
							message: `Failed to execute BUY: ${error instanceof Error ? error.message : 'Unknown error'}`
						});
					}
				} else if (decision.includes('SELL')) {
					// Analysis says SELL - check if we have position and sell
					try {
						const positionDetails = await getPositionDetailsTool.execute({
							context: { symbol: action.symbol }
						});

						if (positionDetails.hasPosition && positionDetails.position) {
							const qty = parseInt(positionDetails.position.qty, 10);
							if (qty > 0) {
								const tradeResult = await executeTradeTool.execute({
									context: {
										symbol: action.symbol,
										qty,
										side: 'sell',
										type: 'market',
										timeInForce: 'day',
										reportId: analysisResult.reportId
									}
								});

								executedActions.push({
									type: 'sell',
									symbol: action.symbol,
									success: tradeResult.success,
									message: `Executed SELL order: ${tradeResult.message}`,
									details: tradeResult
								});
							} else {
								executedActions.push({
									type: 'sell',
									symbol: action.symbol,
									success: false,
									message: `No position to sell for ${action.symbol}`
								});
							}
						} else {
							executedActions.push({
								type: 'sell',
								symbol: action.symbol,
								success: false,
								message: `No position found for ${action.symbol} - cannot sell`
							});
						}
					} catch (error) {
						executedActions.push({
							type: 'sell',
							symbol: action.symbol,
							success: false,
							message: `Failed to execute SELL: ${error instanceof Error ? error.message : 'Unknown error'}`
						});
					}
				} else {
					// HOLD or other decision - just record the analysis
					executedActions.push({
						type: 'analyze',
						symbol: action.symbol,
						success: true,
						message: `Analysis completed: ${decision || 'HOLD'}`,
						details: action.details
					});
				}
			} else if (action.type === 'buy' && action.symbol) {
				// Direct buy action (from text parsing)
				try {
					const positionSizeResult = await calculatePositionSizeTool.execute({
						context: { symbol: action.symbol, allocationPercent: 5 }
					});

					if (positionSizeResult.recommendedQty && positionSizeResult.recommendedQty > 0) {
						const tradeResult = await executeTradeTool.execute({
							context: {
								symbol: action.symbol,
								qty: positionSizeResult.recommendedQty,
								side: 'buy',
								type: 'market',
								timeInForce: 'day'
							}
						});

						executedActions.push({
							type: 'buy',
							symbol: action.symbol,
							success: tradeResult.success,
							message: `Executed BUY order: ${tradeResult.message}`,
							details: tradeResult
						});
					}
				} catch (error) {
					executedActions.push({
						type: 'buy',
						symbol: action.symbol,
						success: false,
						message: `Failed to execute BUY: ${error instanceof Error ? error.message : 'Unknown error'}`
					});
				}
			} else if (action.type === 'sell' && action.symbol) {
				// Direct sell action (from text parsing)
				try {
					const positionDetails = await getPositionDetailsTool.execute({
						context: { symbol: action.symbol }
					});

					if (positionDetails.hasPosition && positionDetails.position) {
						const qty = parseInt(positionDetails.position.qty, 10);
						if (qty > 0) {
							const tradeResult = await executeTradeTool.execute({
								context: {
									symbol: action.symbol,
									qty,
									side: 'sell',
									type: 'market',
									timeInForce: 'day'
								}
							});

							executedActions.push({
								type: 'sell',
								symbol: action.symbol,
								success: tradeResult.success,
								message: `Executed SELL order: ${tradeResult.message}`,
								details: tradeResult
							});
						}
					}
				} catch (error) {
					executedActions.push({
						type: 'sell',
						symbol: action.symbol,
						success: false,
						message: `Failed to execute SELL: ${error instanceof Error ? error.message : 'Unknown error'}`
					});
				}
			} else {
				// Monitor or other actions - just record them
				executedActions.push({
					type: action.type,
					symbol: action.symbol,
					success: true,
					message: action.reasoning,
					details: action.details
				});
			}
		}

		return {
			executedActions,
			summary
		};
	}
});

// ============================================================================
// Main Workflow
// ============================================================================

export const autonomousTradingWorkflow = createWorkflow({
	id: 'autonomous-trading',
	inputSchema: autonomousTradingInputSchema,
	outputSchema: z.object({
		executedActions: z.array(
			z.object({
				type: z.string(),
				symbol: z.string().optional(),
				success: z.boolean(),
				message: z.string(),
				details: z.unknown().optional()
			})
		),
		summary: z.string()
	})
})
	.then(accountManagerStep)
	.then(executeActionsStep)
	.commit();

