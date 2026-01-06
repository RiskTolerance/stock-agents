<script lang="ts">
	import { getReport } from '../data.remote';
	import ReportDisplay from '$lib/components/ReportDisplay.svelte';

	let { params } = $props();

	// Only call getReport if id is available and valid (UUID format)
	const hasValidId = $derived(params.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id));
	const reportQuery = $derived(hasValidId ? getReport({ id: params.id }) : null);

	// Extract report data for component props
	const layer1Data = $derived(reportQuery.current?.report?.context?.layer1Data || {});
	const layer2Reasoning = $derived(reportQuery.current?.report?.context?.layer2Reasoning || null);
	const layer3Rebuttals = $derived(reportQuery.current?.report?.context?.layer3Rebuttals || null);
	const decision = $derived(reportQuery.current?.report?.decision || null);
</script>

<svelte:head>
	<title>Report | Stock Agents</title>
</svelte:head>

<main class="container mx-auto max-w-4xl px-4 py-8">
	<a href="/reports" class="mb-4 inline-block text-blue-400 hover:text-blue-300">
		← Back to Reports
	</a>

	{#if !hasValidId}
		<div class="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-400">
			<p class="font-semibold">Invalid report ID</p>
			<p>The report ID format is invalid.</p>
		</div>
	{:else if reportQuery?.loading}
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
			<div class="mb-4 flex items-center justify-between">
				<h1 class="text-2xl font-bold text-gray-100">{report.symbol} Analysis</h1>
				<span class="text-sm text-gray-400">
					{new Date(report.createdAt).toLocaleString()}
				</span>
			</div>
			<ReportDisplay
				{layer1Data}
				{layer2Reasoning}
				{layer3Rebuttals}
				{decision}
			/>
		</div>
	{/if}
</main>

