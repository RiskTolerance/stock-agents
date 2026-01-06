<script lang="ts">
	import { getAgentSession } from '../data.remote';
	import { marked } from 'marked';

	let { params } = $props();

	const hasValidId = $derived(
		params.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id)
	);
	const sessionQuery = $derived(hasValidId ? getAgentSession({ id: params.id }) : null);

	function renderMarkdown(text: string): string {
		if (!text) return '';
		try {
			return marked.parse(text) as string;
		} catch {
			return text;
		}
	}

	function formatDuration(start: string, end?: string | null): string {
		if (!end) return 'Running...';
		const duration = new Date(end).getTime() - new Date(start).getTime();
		const seconds = Math.floor(duration / 1000);
		const minutes = Math.floor(seconds / 60);
		if (minutes > 0) {
			return `${minutes}m ${seconds % 60}s`;
		}
		return `${seconds}s`;
	}
</script>

<svelte:head>
	<title>Agent Session | Stock Agents</title>
</svelte:head>

<main class="container mx-auto max-w-6xl px-4 py-8">
	<a href="/sessions" class="mb-4 inline-block text-blue-400 hover:text-blue-300">
		← Back to Sessions
	</a>

	{#if !hasValidId}
		<div class="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-400">
			<p class="font-semibold">Invalid session ID</p>
		</div>
	{:else if sessionQuery?.loading}
		<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
			<div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			<p class="text-gray-400">Loading session...</p>
		</div>
	{:else if sessionQuery.error}
		<div class="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-400">
			<p class="font-semibold">Error loading session</p>
			<p>{sessionQuery.error.message}</p>
		</div>
	{:else if !sessionQuery.current?.session}
		<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
			<p class="text-gray-400">Session not found</p>
		</div>
	{:else}
		{@const session = sessionQuery.current.session}
		<div class="space-y-6">
			<!-- Session Overview -->
			<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
				<div class="mb-4 flex items-center justify-between">
					<h1 class="text-2xl font-bold text-gray-100">Agent Session</h1>
					<span class="text-sm text-gray-400">
						{new Date(session.startedAt).toLocaleString()}
					</span>
				</div>

				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div>
						<p class="text-sm text-gray-400">Status</p>
						<p
							class="text-lg font-semibold {session.status === 'completed'
								? 'text-green-400'
								: session.status === 'failed'
									? 'text-red-400'
									: 'text-yellow-400'}"
						>
							{session.status}
						</p>
					</div>
					<div>
						<p class="text-sm text-gray-400">Trigger</p>
						<p class="text-lg font-semibold text-gray-200">{session.trigger}</p>
					</div>
					<div>
						<p class="text-sm text-gray-400">Duration</p>
						<p class="text-lg font-semibold text-gray-200">
							{formatDuration(session.startedAt, session.endedAt)}
						</p>
					</div>
					<div>
						<p class="text-sm text-gray-400">Iterations</p>
						<p class="text-lg font-semibold text-gray-200">{session.iterations.length}</p>
					</div>
				</div>

				{#if session.error}
					<div class="mt-4 rounded-lg border border-red-500/50 bg-red-900/20 p-4">
						<p class="font-semibold text-red-400">Error</p>
						<p class="text-red-300">{session.error}</p>
					</div>
				{/if}
			</div>

			<!-- Iterations -->
			<div class="space-y-4">
				<h2 class="text-xl font-bold text-gray-100">Iterations</h2>
				{#each session.iterations as iter}
					<details class="rounded-lg border border-gray-700 bg-gray-800/50" open={iter.iteration === 1}>
						<summary class="cursor-pointer p-4 font-medium text-gray-200 hover:bg-gray-700/30">
							Iteration {iter.iteration} - {new Date(iter.createdAt).toLocaleTimeString()}
						</summary>
						<div class="border-t border-gray-700 p-4 space-y-4">
							<!-- Reasoning -->
							<div>
								<h3 class="mb-2 font-semibold text-gray-300">Reasoning</h3>
								<div class="prose prose-invert max-w-none rounded-lg bg-gray-900/50 p-4 text-sm text-gray-300">
									{@html renderMarkdown(iter.reasoning)}
								</div>
							</div>

							<!-- Tool Calls -->
							{#if iter.toolCalls && Array.isArray(iter.toolCalls) && iter.toolCalls.length > 0}
								<div>
									<h3 class="mb-2 font-semibold text-gray-300">Tool Calls ({iter.toolCalls.length})</h3>
									<div class="space-y-2">
										{#each iter.toolCalls as toolCall}
											<div class="rounded-lg bg-gray-900/50 p-3">
												<p class="font-medium text-gray-200">{toolCall.tool}</p>
												{#if toolCall.input}
													<p class="mt-1 text-xs text-gray-400">
														Input: <code class="text-gray-300">{JSON.stringify(toolCall.input, null, 2)}</code>
													</p>
												{/if}
												{#if toolCall.output}
													<p class="mt-1 text-xs text-gray-400">
														Output: <code class="text-gray-300">{JSON.stringify(toolCall.output, null, 2)}</code>
													</p>
												{/if}
												{#if toolCall.error}
													<p class="mt-1 text-xs text-red-400">Error: {toolCall.error}</p>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Decisions Considered -->
							{#if iter.decisionsConsidered && Array.isArray(iter.decisionsConsidered) && iter.decisionsConsidered.length > 0}
								<div>
									<h3 class="mb-2 font-semibold text-gray-300">Decisions Considered</h3>
									<div class="space-y-2">
										{#each iter.decisionsConsidered as decision}
											<div
												class="rounded-lg p-3 {decision.decided
													? 'bg-green-900/20 border border-green-700/50'
													: 'bg-yellow-900/20 border border-yellow-700/50'}"
											>
												<div class="flex items-center justify-between">
													<p class="font-medium text-gray-200">
														{decision.action} {decision.symbol ? `(${decision.symbol})` : ''}
													</p>
													<span
														class="text-xs {decision.decided
															? 'text-green-400'
															: 'text-yellow-400'}"
													>
														{decision.decided ? 'Executed' : 'Not Executed'}
													</span>
												</div>
												<p class="mt-1 text-sm text-gray-300">{decision.reasoning}</p>
												{#if decision.reasonNotExecuted}
													<p class="mt-1 text-xs text-gray-400">
														Reason: {decision.reasonNotExecuted}
													</p>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Context -->
							{#if iter.context}
								<details class="rounded-lg bg-gray-900/50">
									<summary class="cursor-pointer p-2 text-sm font-medium text-gray-300">
										Context Snapshot
									</summary>
									<pre class="overflow-x-auto p-4 text-xs text-gray-400">
										{JSON.stringify(iter.context, null, 2)}
									</pre>
								</details>
							{/if}
						</div>
					</details>
				{/each}
			</div>

			<!-- Conversation History -->
			{#if session.conversationHistory && Array.isArray(session.conversationHistory) && session.conversationHistory.length > 0}
				<details class="rounded-lg border border-gray-700 bg-gray-800/50">
					<summary class="cursor-pointer p-4 font-medium text-gray-200 hover:bg-gray-700/30">
						Conversation History ({session.conversationHistory.length} messages)
					</summary>
					<div class="border-t border-gray-700 p-4 space-y-3">
						{#each session.conversationHistory as message}
							<div
								class="rounded-lg p-3 {message.role === 'user'
									? 'bg-blue-900/20 border border-blue-700/50'
									: 'bg-gray-900/50 border border-gray-700'}"
							>
								<p class="mb-1 text-xs font-semibold text-gray-400 uppercase">
									{message.role === 'user' ? 'User' : 'Assistant'}
								</p>
								<div class="prose prose-invert prose-sm max-w-none text-gray-300">
									{@html renderMarkdown(message.content)}
								</div>
							</div>
						{/each}
					</div>
				</details>
			{/if}

			<!-- Initial Context -->
			{#if session.initialContext}
				<details class="rounded-lg border border-gray-700 bg-gray-800/50">
					<summary class="cursor-pointer p-4 font-medium text-gray-200 hover:bg-gray-700/30">
						Initial Context
					</summary>
					<div class="border-t border-gray-700 p-4">
						<pre class="overflow-x-auto rounded bg-gray-900/50 p-4 text-xs text-gray-400">
							{JSON.stringify(session.initialContext, null, 2)}
						</pre>
					</div>
				</details>
			{/if}

			<!-- Final Context -->
			{#if session.finalContext}
				<details class="rounded-lg border border-gray-700 bg-gray-800/50">
					<summary class="cursor-pointer p-4 font-medium text-gray-200 hover:bg-gray-700/30">
						Final Context
					</summary>
					<div class="border-t border-gray-700 p-4">
						<pre class="overflow-x-auto rounded bg-gray-900/50 p-4 text-xs text-gray-400">
							{JSON.stringify(session.finalContext, null, 2)}
						</pre>
					</div>
				</details>
			{/if}
		</div>
	{/if}
</main>

