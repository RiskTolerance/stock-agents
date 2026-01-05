<script lang="ts">
	import { analyzeStock } from './data.remote';

	let symbol = $state('');
	let isAnalyzing = $state(false);
	let result = $state<Awaited<ReturnType<typeof analyzeStock>> | null>(null);
	let error = $state<string | null>(null);

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

<main class="container mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-100">Stock Analysis</h1>

	<form onsubmit={(e) => { e.preventDefault(); handleAnalyze(); }} class="mb-8">
		<div class="flex gap-4">
			<input
				type="text"
				bind:value={symbol}
				placeholder="Enter stock symbol (e.g., AAPL)"
				class="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
				disabled={isAnalyzing}
			/>
			<button
				type="submit"
				disabled={isAnalyzing || !symbol.trim()}
				class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isAnalyzing ? 'Analyzing...' : 'Analyze'}
			</button>
		</div>
	</form>

	{#if isAnalyzing}
		<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
			<div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			<p class="text-gray-400">Running analysis for {symbol.toUpperCase()}...</p>
			<p class="mt-2 text-sm text-gray-500">This may take 30-60 seconds</p>
		</div>
	{/if}

	{#if error}
		<div class="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-400">
			<p class="font-semibold">Error</p>
			<p>{error}</p>
		</div>
	{/if}

	{#if result}
		<div class="space-y-6">
			<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-xl font-semibold text-gray-100">Analysis Result</h2>
					<span class="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
						{result.symbol}
					</span>
				</div>

				<div class="prose prose-invert max-w-none">
					<h3 class="text-lg font-medium text-gray-200">Decision</h3>
					<div class="whitespace-pre-wrap rounded-lg bg-gray-900/50 p-4 text-gray-300">
						{result.decision}
					</div>
				</div>
			</div>

			{#if result.context?.layer1Data}
				<details class="rounded-lg border border-gray-700 bg-gray-800/50">
					<summary class="cursor-pointer p-4 font-medium text-gray-200 hover:bg-gray-700/30">
						Layer 1: Data Collection
					</summary>
					<div class="border-t border-gray-700 p-4">
						<div class="grid gap-4 md:grid-cols-2">
							{#each Object.entries(result.context.layer1Data) as [key, value]}
								<details class="rounded border border-gray-600 bg-gray-900/30">
									<summary class="cursor-pointer p-2 text-sm font-medium capitalize text-gray-300 hover:bg-gray-700/20">
										{key.replace(/_/g, ' ')}
									</summary>
									<div class="max-h-48 overflow-y-auto border-t border-gray-600 p-2 text-xs text-gray-400">
										<pre class="whitespace-pre-wrap">{typeof value === 'string' ? value : JSON.stringify(value, null, 2)}</pre>
									</div>
								</details>
							{/each}
						</div>
					</div>
				</details>
			{/if}

			{#if result.context?.layer2Reasoning}
				<details class="rounded-lg border border-gray-700 bg-gray-800/50">
					<summary class="cursor-pointer p-4 font-medium text-gray-200 hover:bg-gray-700/30">
						Layer 2: Reasoning
					</summary>
					<div class="border-t border-gray-700 p-4">
						<div class="grid gap-4 md:grid-cols-2">
							<div class="rounded border border-green-500/30 bg-green-900/10 p-4">
								<h4 class="mb-2 font-medium text-green-400">Bullish Case</h4>
								<p class="whitespace-pre-wrap text-sm text-gray-300">{result.context.layer2Reasoning.bullish}</p>
							</div>
							<div class="rounded border border-red-500/30 bg-red-900/10 p-4">
								<h4 class="mb-2 font-medium text-red-400">Bearish Case</h4>
								<p class="whitespace-pre-wrap text-sm text-gray-300">{result.context.layer2Reasoning.bearish}</p>
							</div>
						</div>
					</div>
				</details>
			{/if}

			{#if result.context?.layer3Rebuttals}
				<details class="rounded-lg border border-gray-700 bg-gray-800/50">
					<summary class="cursor-pointer p-4 font-medium text-gray-200 hover:bg-gray-700/30">
						Layer 3: Rebuttals
					</summary>
					<div class="border-t border-gray-700 p-4">
						<div class="grid gap-4 md:grid-cols-2">
							<div class="rounded border border-green-500/30 bg-green-900/10 p-4">
								<h4 class="mb-2 font-medium text-green-400">Bullish Rebuttal</h4>
								<p class="whitespace-pre-wrap text-sm text-gray-300">{result.context.layer3Rebuttals.bullish}</p>
							</div>
							<div class="rounded border border-red-500/30 bg-red-900/10 p-4">
								<h4 class="mb-2 font-medium text-red-400">Bearish Rebuttal</h4>
								<p class="whitespace-pre-wrap text-sm text-gray-300">{result.context.layer3Rebuttals.bearish}</p>
							</div>
						</div>
					</div>
				</details>
			{/if}

			<p class="text-right text-sm text-gray-500">
				Analyzed at {new Date(result.timestamp).toLocaleString()}
			</p>
		</div>
	{/if}
</main>

<style>
	/* Dark theme base */
	:global(body) {
		background-color: #0f172a;
		color: #e2e8f0;
	}
</style>

