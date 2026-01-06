<script lang="ts">
	import { analyzeStock } from '../../routes/analyze/data.remote.js';
	import ReportDisplay from './ReportDisplay.svelte';

	interface Props {
		symbol: string;
	}

	let { symbol }: Props = $props();

	let isAnalyzing = $state(false);
	let result = $state<Awaited<ReturnType<typeof analyzeStock>> | null>(null);
	let error = $state<string | null>(null);
	let lastAnalyzedSymbol = $state('');

	// Computed values for result data
	const layer1Data = $derived(result?.context?.layer1Data || {});
	const layer2Reasoning = $derived(result?.context?.layer2Reasoning);
	const layer3Rebuttals = $derived(result?.context?.layer3Rebuttals);
	const decision = $derived(result?.decision || null);

	async function handleAnalyze(sym: string) {
		const normalizedSymbol = sym.trim().toUpperCase();
		
		// Skip if already analyzing or already analyzed this symbol
		if (!normalizedSymbol || isAnalyzing || normalizedSymbol === lastAnalyzedSymbol) {
			return;
		}

		isAnalyzing = true;
		error = null;
		result = null;
		lastAnalyzedSymbol = normalizedSymbol;

		try {
			result = await analyzeStock({ symbol: normalizedSymbol });
		} catch (e) {
			error = e instanceof Error ? e.message : 'Analysis failed';
			// Reset lastAnalyzedSymbol on error so user can retry
			lastAnalyzedSymbol = '';
		} finally {
			isAnalyzing = false;
		}
	}

	// Trigger analysis when symbol changes (but not on initial mount with empty/default value)
	$effect(() => {
		const sym = symbol;
		// Only run if symbol is provided and different from last analyzed
		if (sym.trim() && sym.trim().toUpperCase() !== lastAnalyzedSymbol) {
			handleAnalyze(sym);
		}
	});
</script>

<div class="mt-8 pt-8 border-t border-teal-400/20">
	<div class="flex flex-col gap-4">

		{#if isAnalyzing}
			<div class="flex flex-col gap-4 bg-gray-50/10 w-full rounded-md items-center justify-center p-8 min-h-[200px]">
				<div class="text-teal-400 text-lg">Analyzing {symbol.toUpperCase()}...</div>
			</div>
		{:else if error}
			<div class="flex flex-col gap-4 bg-gray-50/10 w-full rounded-md items-center justify-center p-8 min-h-[200px]">
				<p class="text-red-400 text-lg">Error: {error}</p>
			</div>
		{:else if result}
			<div class="w-full">
				<h3 class="text-white text-xl font-bold mb-4">Analysis Report</h3>
				<ReportDisplay
					{layer1Data}
					{layer2Reasoning}
					{layer3Rebuttals}
					{decision}
				/>
			</div>
		{/if}
	</div>
</div>

