<script lang="ts">
	import { analyzeStock } from './data.remote';
	import { marked } from 'marked';

	let symbol = $state('');
	let isAnalyzing = $state(false);
	let result = $state<Awaited<ReturnType<typeof analyzeStock>> | null>(null);
	let error = $state<string | null>(null);

	// Computed values for result data
	const layer1Data = $derived(result ? getLayer1Data(result.context) : {});
	const layer2Reasoning = $derived(result?.context?.layer2Reasoning);
	const layer3Rebuttals = $derived(result?.context?.layer3Rebuttals);

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

	// Helper to get layer1 data with proper key mapping
	function getLayer1Data(context: any) {
		if (!context?.layer1Data) return {};
		return context.layer1Data;
	}

	// Helper to render markdown synchronously
	function renderMarkdown(text: string): string {
		if (!text) return '';
		try {
			return marked.parse(text) as string;
		} catch {
			return text;
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
		<div class="flex flex-col gap-4 bg-gray-50/10 w-full h-3/4 max-h-[3/4] rounded-md">
			{#snippet resultCard(title: string, text: string, colspan: number)}
				{@const htmlContent = renderMarkdown(text)}
				<div
					style="grid-column: span {colspan} / span {colspan};"
					class="result-card overflow-clip bg-gray-50 rounded-md w-full h-[200px]"
				>
					<div class="w-full h-full overflow-y-scroll p-4">
						<h3 class="text-xl font-bold mb-2 text-gray-900">{title}</h3>
						<div class="text-gray-700 prose prose-sm max-w-none">{@html htmlContent}</div>
					</div>
				</div>
			{/snippet}

			<div class="grid grid-cols-4 gap-4 p-6 overflow-y-scroll h-full py-12">
				<!-- Layer 1: Data Collection (10 cards, 1 column each) -->
				{#if layer1Data.analyst}
					{@render resultCard('Analyst', typeof layer1Data.analyst === 'string' ? layer1Data.analyst : JSON.stringify(layer1Data.analyst), 1)}
				{/if}
				{#if layer1Data.balance_sheet}
					{@render resultCard('Balance Sheet', typeof layer1Data.balance_sheet === 'string' ? layer1Data.balance_sheet : JSON.stringify(layer1Data.balance_sheet), 1)}
				{/if}
				{#if layer1Data.balance_sheet_growth}
					{@render resultCard('Balance Sheet Growth', typeof layer1Data.balance_sheet_growth === 'string' ? layer1Data.balance_sheet_growth : JSON.stringify(layer1Data.balance_sheet_growth), 1)}
				{/if}
				{#if layer1Data.cash_flow}
					{@render resultCard('Cash Flow', typeof layer1Data.cash_flow === 'string' ? layer1Data.cash_flow : JSON.stringify(layer1Data.cash_flow), 1)}
				{/if}
				{#if layer1Data.cash_flow_growth}
					{@render resultCard('Cash Flow Growth', typeof layer1Data.cash_flow_growth === 'string' ? layer1Data.cash_flow_growth : JSON.stringify(layer1Data.cash_flow_growth), 1)}
				{/if}
				{#if layer1Data.income_statement}
					{@render resultCard('Income Statement', typeof layer1Data.income_statement === 'string' ? layer1Data.income_statement : JSON.stringify(layer1Data.income_statement), 1)}
				{/if}
				{#if layer1Data.insider}
					{@render resultCard('Insider', typeof layer1Data.insider === 'string' ? layer1Data.insider : JSON.stringify(layer1Data.insider), 1)}
				{/if}
				{#if layer1Data.key_metrics}
					{@render resultCard('Key Metrics', typeof layer1Data.key_metrics === 'string' ? layer1Data.key_metrics : JSON.stringify(layer1Data.key_metrics), 1)}
				{/if}
				{#if layer1Data.news}
					{@render resultCard('News', typeof layer1Data.news === 'string' ? layer1Data.news : JSON.stringify(layer1Data.news), 1)}
				{/if}
				{#if layer1Data.technical}
					{@render resultCard('Technical', typeof layer1Data.technical === 'string' ? layer1Data.technical : JSON.stringify(layer1Data.technical), 1)}
				{/if}

				<!-- Empty cells for spacing -->
				<div></div>
				<div></div>

				<!-- Layer 2: Reasoning (2 cards, 2 columns each) -->
				{#if layer2Reasoning?.bullish}
					{@render resultCard('Bullish', typeof layer2Reasoning.bullish === 'string' ? layer2Reasoning.bullish : JSON.stringify(layer2Reasoning.bullish), 2)}
				{/if}
				{#if layer2Reasoning?.bearish}
					{@render resultCard('Bearish', typeof layer2Reasoning.bearish === 'string' ? layer2Reasoning.bearish : JSON.stringify(layer2Reasoning.bearish), 2)}
				{/if}

				<!-- Layer 3: Rebuttals (2 cards, 2 columns each) -->
				{#if layer3Rebuttals?.bullish}
					{@render resultCard('Bullish Rebuttal', typeof layer3Rebuttals.bullish === 'string' ? layer3Rebuttals.bullish : JSON.stringify(layer3Rebuttals.bullish), 2)}
				{/if}
				{#if layer3Rebuttals?.bearish}
					{@render resultCard('Bearish Rebuttal', typeof layer3Rebuttals.bearish === 'string' ? layer3Rebuttals.bearish : JSON.stringify(layer3Rebuttals.bearish), 2)}
				{/if}

				<!-- Layer 4: Decision (1 card, 4 columns) -->
				{#if result.decision}
					{@render resultCard('Decision', result.decision, 4)}
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		background: linear-gradient(to bottom, rgb(39 39 42), rgb(24 24 27));
		color: #e2e8f0;
	}
</style>
