<script lang="ts">
	import { getReport } from '../data.remote';

	let { params } = $props();

	const reportQuery = $derived(getReport({ id: params.id }));
</script>

<svelte:head>
	<title>Report | Stock Agents</title>
</svelte:head>

<main class="container mx-auto max-w-4xl px-4 py-8">
	<a href="/reports" class="mb-4 inline-block text-blue-400 hover:text-blue-300">
		← Back to Reports
	</a>

	{#if reportQuery.loading}
		<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
			<div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			<p class="text-gray-400">Loading report...</p>
		</div>
	{:else if reportQuery.error}
		<div class="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-400">
			<p class="font-semibold">Error loading report</p>
			<p>{reportQuery.error.message}</p>
		</div>
	{:else if !reportQuery.current?.report}
		<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
			<p class="text-gray-400">Report not found</p>
		</div>
	{:else}
		{@const report = reportQuery.current.report}
		<div class="space-y-6">
			<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
				<div class="mb-4 flex items-center justify-between">
					<h1 class="text-2xl font-bold text-gray-100">{report.symbol} Analysis</h1>
					<span class="text-sm text-gray-400">
						{new Date(report.createdAt).toLocaleString()}
					</span>
				</div>

				<div class="prose prose-invert max-w-none">
					<h2 class="text-lg font-medium text-gray-200">Decision</h2>
					<div class="whitespace-pre-wrap rounded-lg bg-gray-900/50 p-4 text-gray-300">
						{report.decision}
					</div>
				</div>
			</div>

			{#if report.context}
				<details class="rounded-lg border border-gray-700 bg-gray-800/50" open>
					<summary class="cursor-pointer p-4 font-medium text-gray-200 hover:bg-gray-700/30">
						Full Analysis Context
					</summary>
					<div class="border-t border-gray-700 p-4">
						<pre class="overflow-x-auto rounded bg-gray-900/50 p-4 text-xs text-gray-400">{JSON.stringify(report.context, null, 2)}</pre>
					</div>
				</details>
			{/if}
		</div>
	{/if}
</main>

