<script lang="ts">
	import { getAgentSessions, deleteSession, deleteAllSessions } from './data.remote';

	const sessionsQuery = getAgentSessions({ limit: 50 });
	
	// Reactive derived list that updates when query changes
	const sessions = $derived(sessionsQuery.current?.sessions ?? []);

	async function handleDelete(id: string, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		
		if (!confirm('Are you sure you want to delete this session?')) {
			return;
		}

		try {
			// Command refreshes the query on the server, data updates automatically
			await deleteSession({ id });
		} catch (error) {
			alert(`Failed to delete session: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	async function handleDeleteAll() {
		if (!confirm('Are you sure you want to delete ALL sessions? This cannot be undone.')) {
			return;
		}

		try {
			await deleteAllSessions();
		} catch (error) {
			alert(`Failed to delete sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
</script>

<svelte:head>
	<title>Agent Sessions | Stock Agents</title>
</svelte:head>

<main class="container mx-auto max-w-6xl px-4 py-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-100">Agent Sessions</h1>
		{#if sessions.length > 0}
			<button
				onclick={handleDeleteAll}
				class="rounded-lg bg-red-600/20 px-4 py-2 font-semibold text-red-400 transition-colors hover:bg-red-600/30"
			>
				Delete All
			</button>
		{/if}
	</div>

	{#if sessionsQuery?.loading}
		<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
			<div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			<p class="text-gray-400">Loading sessions...</p>
		</div>
	{:else if sessionsQuery.error}
		<div class="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-400">
			<p class="font-semibold">Error loading sessions</p>
			<p>{sessionsQuery.error.message}</p>
		</div>
	{:else if !sessions || sessions.length === 0}
		<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
			<p class="text-gray-400">No sessions found</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full border-collapse rounded-lg border border-gray-700 bg-gray-800/50">
				<thead>
					<tr class="border-b border-gray-700">
						<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Started</th>
						<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
						<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Trigger</th>
						<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Tool Calls</th>
						<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Decisions</th>
						<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
						<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Duration</th>
						<th class="px-4 py-3 text-left text-sm font-medium text-gray-300"></th>
					</tr>
				</thead>
				<tbody>
					{#each sessions as session}
					<tr class="border-b border-gray-700/50 hover:bg-gray-700/30">
						<td class="px-4 py-3 text-sm text-gray-300">
							{new Date(session.startedAt).toLocaleString()}
						</td>
						<td class="px-4 py-3">
							<span
								class="inline-flex rounded-full px-2 py-1 text-xs font-medium {session.status === 'completed'
									? 'bg-green-900/50 text-green-300'
									: session.status === 'failed'
										? 'bg-red-900/50 text-red-300'
										: 'bg-yellow-900/50 text-yellow-300'}"
							>
								{session.status}
							</span>
						</td>
						<td class="px-4 py-3 text-sm text-gray-300">{session.trigger}</td>
						<td class="px-4 py-3 text-sm text-gray-300">{session.toolCallsCount}</td>
						<td class="px-4 py-3 text-sm text-gray-300">{session.decisionsCount}</td>
						<td class="px-4 py-3 text-sm text-gray-300">{session.actionsCount}</td>
						<td class="px-4 py-3 text-sm text-gray-300">
							{#if session.endedAt}
								{Math.round(
									(new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000
								)}s
							{:else}
								-
							{/if}
						</td>
						<td class="px-4 py-3">
							<div class="flex items-center gap-3">
								<a
									href="/sessions/{session.id}"
									class="text-blue-400 hover:text-blue-300"
								>
									View →
								</a>
								<button
									onclick={(e) => handleDelete(session.id, e)}
									class="text-red-400 hover:text-red-300 text-sm"
									title="Delete session"
								>
									Delete
								</button>
							</div>
						</td>
					</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</main>

