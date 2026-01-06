<script lang="ts">
	import { analyzeStock } from './data.remote';
	import ReportDisplay from '$lib/components/ReportDisplay.svelte';

	let symbol = $state('');
	let isAnalyzing = $state(false);
	let result = $state<Awaited<ReturnType<typeof analyzeStock>> | null>(null);
	let error = $state<string | null>(null);

	// Computed values for result data
	const layer1Data = $derived(result?.context?.layer1Data || {});
	const layer2Reasoning = $derived(result?.context?.layer2Reasoning);
	const layer3Rebuttals = $derived(result?.context?.layer3Rebuttals);
	const decision = $derived(result?.decision || null);

	async function handleAnalyze() {
		if (!symbol.trim()) return;

		isAnalyzing = true;
		error = null;
		result = null;

		try {
			result = await analyzeStock({ symbol: symbol.toUpperCase() });
		} catch (e) {
			error = e instanceof Error ? e.message : 'Analysis failed';
		} finally {
			isAnalyzing = false;
		}
	}
</script>

<svelte:head>
	<title>Stock Analysis | Stock Agents</title>
</svelte:head>

<div class="flex flex-col justify-start items-center gap-6 h-4/5 w-4/5 min-h-screen py-8">
	<h1 class="text-white text-4xl font-bold">Generate Report</h1>
	<p class="text-white text-lg">Enter a ticker symbol to generate a report.</p>
	<div class="flex flex-col w-full items-center gap-4 max-w-md">
		<input
			bind:value={symbol}
			type="text"
			placeholder="Enter stock symbol (e.g., AAPL)"
			class="w-full p-2 rounded-lg bg-white text-gray-900"
			disabled={isAnalyzing}
			onkeydown={(e) => e.key === 'Enter' && handleAnalyze()}
		/>
		<button
			onclick={handleAnalyze}
			disabled={isAnalyzing || !symbol.trim()}
			class="bg-teal-300 px-4 py-2 rounded-lg w-40 text-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-400 transition-colors"
		>
			{isAnalyzing ? 'Analyzing...' : 'Generate Report'}
		</button>
	</div>

	{#if isAnalyzing}
		<div class="flex flex-col gap-4 bg-gray-50/10 w-full h-3/4 max-h-[3/4] rounded-md items-center justify-center">
			<div></div>
			<p class="text-green-400 text-lg col-span-2 text-center">Loading...</p>
			<div></div>
		</div>
	{:else if error}
		<div class="flex flex-col gap-4 bg-gray-50/10 w-full h-3/4 max-h-[3/4] rounded-md items-center justify-center">
			<div></div>
			<p class="text-red-400 text-lg col-span-2 text-center">Error: {error}</p>
			<div></div>
		</div>
	{:else if result}
		<div class="flex w-full justify-start">
			<h2 class="text-white text-3xl font-bold">Report</h2>
		</div>
		<ReportDisplay
			{layer1Data}
			{layer2Reasoning}
			{layer3Rebuttals}
			{decision}
		/>
	{/if}
</div>

<style>
	:global(body) {
		background: linear-gradient(to bottom, rgb(39 39 42), rgb(24 24 27));
		color: #e2e8f0;
	}
</style>
