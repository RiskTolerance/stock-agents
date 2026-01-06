<script lang="ts">
	import { getReports, deleteReport, deleteAllReports } from './data.remote';

	const reportsQuery = getReports();
	
	// Reactive derived list that updates when query changes
	const reports = $derived(reportsQuery.current?.reports ?? []);

	async function handleDelete(id: string, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		
		if (!confirm('Are you sure you want to delete this report?')) {
			return;
		}

		try {
			// Command refreshes the query on the server, data updates automatically
			await deleteReport({ id });
		} catch (error) {
			alert(`Failed to delete report: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	async function handleDeleteAll() {
		if (!confirm('Are you sure you want to delete ALL reports? This cannot be undone.')) {
			return;
		}

		try {
			await deleteAllReports();
		} catch (error) {
			alert(`Failed to delete reports: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
</script>

<svelte:head>
	<title>Reports | Stock Agents</title>
</svelte:head>

<main class="container mx-auto max-w-4xl px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-100">Analysis Reports</h1>
		<div class="flex gap-3">
			{#if reports.length > 0}
				<button
					onclick={handleDeleteAll}
					class="rounded-lg bg-red-600/20 px-4 py-2 font-semibold text-red-400 transition-colors hover:bg-red-600/30"
				>
					Delete All
				</button>
			{/if}
		<a
			href="/"
			class="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-teal-700"
		>
			New Analysis
		</a>
		</div>
	</div>

	{#if reportsQuery.loading}
		<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
			<div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
			<p class="text-gray-400">Loading reports...</p>
		</div>
	{:else if reportsQuery.error}
		<div class="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-400">
			<p class="font-semibold">Error loading reports</p>
			<p>{reportsQuery.error.message}</p>
		</div>
	{:else if !reports || reports.length === 0}
		<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
			<p class="mb-4 text-gray-400">No reports yet</p>
			<a
				href="/"
				class="inline-block rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-teal-700"
			>
				Run your first analysis
			</a>
		</div>
	{:else}
		<div class="space-y-4">
			{#each reports as report}
				<div
					class="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/40 backdrop-blur-sm shadow-lg p-4 transition-colors hover:border-teal-400/50 hover:bg-zinc-800/60"
				>
					<a href="/reports/{report.id}" class="flex flex-1 items-center justify-between">
						<div>
							<span class="font-semibold text-gray-100">{report.symbol}</span>
							<span class="ml-2 text-sm text-gray-400">
								{new Date(report.createdAt).toLocaleDateString()}
							</span>
						</div>
						<span class="rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
							{report.decision.includes('BUY') ? '📈 BUY' : report.decision.includes('SELL') ? '📉 SELL' : '⏸️ HOLD'}
						</span>
					</a>
					<button
						onclick={(e) => handleDelete(report.id, e)}
						class="ml-4 rounded-lg bg-red-600/20 px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-600/30"
						title="Delete report"
					>
						Delete
					</button>
				</div>
			{/each}
		</div>
	{/if}
</main>

