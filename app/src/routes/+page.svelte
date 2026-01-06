<script lang="ts">
	import StockChart from '$lib/components/StockChart.svelte';
	import StockAnalysis from '$lib/components/StockAnalysis.svelte';

	let { data } = $props();

	// Use derived for reactive prop values
	const initialPriceChart = $derived(data.priceChart || []);
	const defaultSymbol = $derived(data.defaultSymbol || 'GOOGL');

	// Initialize with default, only update input when user types
	let inputValue = $state('GOOGL');
	// Symbol only changes when user explicitly searches
	let symbol = $state('');

	const handleSymbolSearch = () => {
		const newSymbol = inputValue.trim().toUpperCase();
		if (newSymbol && newSymbol !== symbol) {
			symbol = newSymbol;
		}
	};
</script>

<svelte:head>
	<title>Stock Agents | AI-Powered Stock Analysis</title>
</svelte:head>

<div class="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
	<div
		class="flex w-4/5 h-4/5 bg-zinc-900/40 shadow-2xl shadow-zinc-950/70 rounded-lg flex-col justify-start z-20 p-8 backdrop-blur-sm pointer-events-auto"
	>
		<div class="container mx-auto">
			<div class="z-20 prose-lg text-white font-bold p-8">
				<h1 class="text-white">AI Stock Counsel</h1>
				<p class="text-sm">The future of stock trading is here.</p>
			</div>
			<div class="flex items-end gap-2 mb-4">
				<div class="flex flex-col gap-1">
					<label class="text-[10px] text-white font-medium" for="symbol">Ticker Symbol</label>
					<input
						id="symbol"
						class="w-24 h-10 bg-white rounded-md p-2 text-gray-900"
						type="text"
						bind:value={inputValue}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								handleSymbolSearch();
							}
						}}
					/>
				</div>
				<button
					type="button"
					onclick={handleSymbolSearch}
					class="bg-teal-400 hover:bg-teal-500 text-gray-900 hover:text-white px-4 py-2 rounded-md h-10 cursor-pointer flex gap-2 group transition-colors duration-400"
				>
					Search
					<svg
						class="h-full aspect-square stroke-teal-900 group-hover:stroke-white transition-colors duration-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</button>
			</div>
			
			<StockChart {symbol} initialData={initialPriceChart} />
			
			<StockAnalysis {symbol} />
		</div>
	</div>
</div>

<style>
	:global(body) {
		background: linear-gradient(to bottom, rgb(39 39 42), rgb(24 24 27));
		color: #e2e8f0;
	}
</style>
