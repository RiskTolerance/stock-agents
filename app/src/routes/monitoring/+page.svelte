<script lang="ts">
	import { getAgentSessions, getSessionStats } from './data.remote';
	import { onMount } from 'svelte';

	let sessions: Awaited<ReturnType<typeof getAgentSessions>> = [];
	let stats: Awaited<ReturnType<typeof getSessionStats>> | null = null;
	let loading = true;
	let error: string | null = null;
	let expandedSession: string | null = null;
	let filterStatus: 'all' | 'running' | 'completed' | 'failed' = 'all';
	let triggering = false;
	let triggerMessage: string | null = null;

	async function loadData() {
		try {
			loading = true;
			error = null;
			[sessions, stats] = await Promise.all([
				getAgentSessions({ limit: 50, status: filterStatus }),
				getSessionStats({})
			]);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load monitoring data';
			console.error('Error loading monitoring data:', e);
		} finally {
			loading = false;
		}
	}

	function toggleSession(id: string) {
		expandedSession = expandedSession === id ? null : id;
	}

	function formatDuration(seconds: number | null): string {
		if (seconds === null) return 'N/A';
		if (seconds < 60) return `${seconds}s`;
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes}m ${secs}s`;
	}

	function formatTimestamp(iso: string): string {
		return new Date(iso).toLocaleString();
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'failed':
				return 'bg-red-100 text-red-800';
			case 'running':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	async function triggerAgent() {
		try {
			triggering = true;
			triggerMessage = null;
			error = null;

			const response = await fetch('/api/scheduler/trigger', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result = await response.json();

			if (result.success) {
				triggerMessage = result.message || 'Agent triggered successfully';
				// Wait a moment for the session to be created, then refresh
				setTimeout(() => {
					loadData();
				}, 1000);
			} else {
				error = result.error || 'Failed to trigger agent';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to trigger agent';
			console.error('Error triggering agent:', e);
		} finally {
			triggering = false;
			// Clear success message after 5 seconds
			if (triggerMessage) {
				setTimeout(() => {
					triggerMessage = null;
				}, 5000);
			}
		}
	}

	onMount(() => {
		loadData();
		// Refresh every 30 seconds
		const interval = setInterval(loadData, 30000);
		return () => clearInterval(interval);
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold mb-2">Agent Monitoring Dashboard</h1>
			<p class="text-gray-600">Track all agent sessions, decisions, and actions</p>
		</div>
		<button
			onclick={triggerAgent}
			disabled={triggering}
			class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
		>
			{#if triggering}
				<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
				<span>Triggering...</span>
			{:else}
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>Trigger Agent</span>
			{/if}
		</button>
	</div>

	{#if triggerMessage}
		<div class="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
			<p>{triggerMessage}</p>
		</div>
	{/if}

	{#if loading && !stats}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
			<p>Error: {error}</p>
			<button
				onclick={loadData}
				class="mt-2 text-sm underline hover:no-underline"
			>
				Retry
			</button>
		</div>
	{:else}
		<!-- Statistics Cards -->
		{#if stats}
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-sm text-gray-600 mb-1">Total Sessions</div>
					<div class="text-3xl font-bold">{stats.total}</div>
				</div>
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-sm text-gray-600 mb-1">Running</div>
					<div class="text-3xl font-bold text-blue-600">{stats.running}</div>
				</div>
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-sm text-gray-600 mb-1">Completed</div>
					<div class="text-3xl font-bold text-green-600">{stats.completed}</div>
				</div>
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-sm text-gray-600 mb-1">Failed</div>
					<div class="text-3xl font-bold text-red-600">{stats.failed}</div>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-sm text-gray-600 mb-1">Total Tool Calls</div>
					<div class="text-2xl font-bold">{stats.totalToolCalls}</div>
				</div>
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-sm text-gray-600 mb-1">Total Decisions</div>
					<div class="text-2xl font-bold">{stats.totalDecisions}</div>
				</div>
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-sm text-gray-600 mb-1">Total Actions</div>
					<div class="text-2xl font-bold">{stats.totalActions}</div>
				</div>
			</div>
		{/if}

		<!-- Filter -->
		<div class="mb-4 flex gap-2">
			<button
				onclick={() => {
					filterStatus = 'all';
					loadData();
				}}
				class="px-4 py-2 rounded {filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}"
			>
				All
			</button>
			<button
				onclick={() => {
					filterStatus = 'running';
					loadData();
				}}
				class="px-4 py-2 rounded {filterStatus === 'running' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}"
			>
				Running
			</button>
			<button
				onclick={() => {
					filterStatus = 'completed';
					loadData();
				}}
				class="px-4 py-2 rounded {filterStatus === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}"
			>
				Completed
			</button>
			<button
				onclick={() => {
					filterStatus = 'failed';
					loadData();
				}}
				class="px-4 py-2 rounded {filterStatus === 'failed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}"
			>
				Failed
			</button>
		</div>

		<!-- Sessions List -->
		<div class="space-y-4">
			{#each sessions as session}
				<div class="bg-white rounded-lg shadow overflow-hidden">
					<div
						class="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
						onclick={() => toggleSession(session.id)}
					>
						<div class="flex-1">
							<div class="flex items-center gap-3 mb-2">
								<span class="px-2 py-1 rounded text-xs font-semibold {getStatusColor(session.status)}">
									{session.status}
								</span>
								<span class="text-sm text-gray-600">Trigger: {session.trigger}</span>
								{#if session.duration !== null}
									<span class="text-sm text-gray-600">Duration: {formatDuration(session.duration)}</span>
								{/if}
							</div>
							<div class="text-sm text-gray-600">
								Started: {formatTimestamp(session.startedAt)}
								{#if session.endedAt}
									• Ended: {formatTimestamp(session.endedAt)}
								{/if}
							</div>
							<div class="mt-1 text-sm">
								<span class="text-gray-600">
									{session.toolCalls.length} tool calls • {session.decisionsMade.length} decisions • {session.actionsTaken.length} actions
								</span>
							</div>
						</div>
						<div class="ml-4">
							<svg
								class="w-5 h-5 text-gray-400 transform transition-transform {expandedSession === session.id ? 'rotate-180' : ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>

					{#if expandedSession === session.id}
						<div class="border-t p-4 space-y-4">
							<!-- Tool Calls -->
							{#if session.toolCalls.length > 0}
								<div>
									<h3 class="font-semibold mb-2">Tool Calls ({session.toolCalls.length})</h3>
									<div class="space-y-2">
										{#each session.toolCalls as toolCall}
											<div class="bg-gray-50 p-3 rounded text-sm">
												<div class="font-mono text-xs text-gray-600 mb-1">
													{toolCall.tool} @ {new Date(toolCall.timestamp).toLocaleTimeString()}
												</div>
												<div class="text-xs">
													<strong>Input:</strong>
													<pre class="mt-1 p-2 bg-white rounded overflow-x-auto">{JSON.stringify(toolCall.input, null, 2)}</pre>
												</div>
												<div class="text-xs mt-2">
													<strong>Output:</strong>
													<pre class="mt-1 p-2 bg-white rounded overflow-x-auto">{JSON.stringify(toolCall.output, null, 2)}</pre>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Decisions -->
							{#if session.decisionsMade.length > 0}
								<div>
									<h3 class="font-semibold mb-2">Decisions ({session.decisionsMade.length})</h3>
									<div class="space-y-2">
										{#each session.decisionsMade as decision}
											<div class="bg-blue-50 p-3 rounded text-sm">
												<span class="font-semibold">{decision.symbol}</span>
												<span class="mx-2">→</span>
												<span class="px-2 py-1 rounded {decision.decision === 'BUY' ? 'bg-green-200' : decision.decision === 'SELL' ? 'bg-red-200' : 'bg-gray-200'}">
													{decision.decision}
												</span>
												{#if decision.confidence}
													<span class="ml-2 text-gray-600">(Confidence: {decision.confidence})</span>
												{/if}
												<div class="text-xs text-gray-600 mt-1">
													{formatTimestamp(decision.timestamp)}
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Actions -->
							{#if session.actionsTaken.length > 0}
								<div>
									<h3 class="font-semibold mb-2">Actions ({session.actionsTaken.length})</h3>
									<div class="space-y-2">
										{#each session.actionsTaken as action}
											<div class="bg-green-50 p-3 rounded text-sm">
												<span class="font-semibold capitalize">{action.type}</span>
												{#if action.symbol}
													<span class="ml-2">({action.symbol})</span>
												{/if}
												<div class="text-xs text-gray-600 mt-1">
													{formatTimestamp(action.timestamp)}
												</div>
												{#if action.details && Object.keys(action.details).length > 0}
													<pre class="mt-2 text-xs bg-white p-2 rounded overflow-x-auto">{JSON.stringify(action.details, null, 2)}</pre>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Full Reasoning -->
							{#if session.fullReasoning}
								<div>
									<h3 class="font-semibold mb-2">Full Reasoning</h3>
									<div class="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
										{session.fullReasoning}
									</div>
								</div>
							{/if}

							<!-- Error -->
							{#if session.error}
								<div>
									<h3 class="font-semibold mb-2 text-red-600">Error</h3>
									<div class="bg-red-50 p-3 rounded text-sm text-red-700">
										{session.error}
									</div>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{:else}
				<div class="bg-white rounded-lg shadow p-8 text-center text-gray-500">
					No sessions found
				</div>
			{/each}
		</div>
	{/if}
</div>

