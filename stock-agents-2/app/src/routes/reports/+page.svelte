<script lang="ts">
	import { getReports } from './data.remote';

	const reportsQuery = getReports();
</script>

<svelte:head>
	<title>Reports | Stock Agents</title>
</svelte:head>

<main class="container mx-auto max-w-4xl px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-100">Analysis Reports</h1>
		<a
			href="/analyze"
			class="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
		>
			New Analysis
		</a>
	</div>

	{#if reportsQuery.loading}
		<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
			<div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			<p class="text-gray-400">Loading reports...</p>
		</div>
	{:else if reportsQuery.error}
		<div class="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-400">
			<p class="font-semibold">Error loading reports</p>
			<p>{reportsQuery.error.message}</p>
		</div>
	{:else if !reportsQuery.current || reportsQuery.current.reports.length === 0}
		<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
			<p class="mb-4 text-gray-400">No reports yet</p>
			<a
				href="/analyze"
				class="inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
			>
				Run your first analysis
			</a>
		</div>
	{:else}
		<div class="space-y-4">
			{#each reportsQuery.current?.reports ?? [] as report}
				<a
					href="/reports/{report.id}"
					class="block rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-colors hover:border-gray-600 hover:bg-gray-800"
				>
					<div class="flex items-center justify-between">
						<div>
							<span class="font-semibold text-gray-100">{report.symbol}</span>
							<span class="ml-2 text-sm text-gray-400">
								{new Date(report.createdAt).toLocaleDateString()}
							</span>
						</div>
						<span class="rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
							{report.decision.includes('BUY') ? '📈 BUY' : report.decision.includes('SELL') ? '📉 SELL' : '⏸️ HOLD'}
						</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</main>

