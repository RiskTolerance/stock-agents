<script lang="ts">
	// Dashboard home page
</script>

<svelte:head>
	<title>Stock Agents | AI-Powered Stock Analysis</title>
</svelte:head>

<main class="container mx-auto max-w-4xl px-4 py-8">
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-100">Stock Agents</h1>
		<p class="text-lg text-gray-400">
			AI-powered multi-agent stock analysis with paper trading
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-3">
		<a
			href="/analyze"
			class="group rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition-all hover:border-blue-500/50 hover:bg-gray-800"
		>
			<div class="mb-4 text-3xl">📊</div>
			<h2 class="mb-2 text-xl font-semibold text-gray-100 group-hover:text-blue-400">
				Analyze Stock
			</h2>
			<p class="text-sm text-gray-400">
				Run comprehensive 4-layer AI analysis on any stock symbol
			</p>
		</a>

		<a
			href="/reports"
			class="group rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition-all hover:border-green-500/50 hover:bg-gray-800"
		>
			<div class="mb-4 text-3xl">📋</div>
			<h2 class="mb-2 text-xl font-semibold text-gray-100 group-hover:text-green-400">
				View Reports
			</h2>
			<p class="text-sm text-gray-400">
				Browse past analysis reports and trading decisions
			</p>
		</a>

		<a
			href="/portfolio"
			class="group rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition-all hover:border-purple-500/50 hover:bg-gray-800"
		>
			<div class="mb-4 text-3xl">💼</div>
			<h2 class="mb-2 text-xl font-semibold text-gray-100 group-hover:text-purple-400">
				Portfolio
			</h2>
			<p class="text-sm text-gray-400">
				View positions, orders, and account balance
			</p>
		</a>
	</div>

	<div class="mt-12 rounded-xl border border-gray-700 bg-gray-800/30 p-6">
		<h3 class="mb-4 text-lg font-semibold text-gray-200">How it works</h3>
		<div class="space-y-4 text-sm text-gray-400">
			<div class="flex items-start gap-3">
				<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">1</span>
				<div>
					<p class="font-medium text-gray-300">Layer 1: Data Collection</p>
					<p>15 specialized agents gather financial data, news, technical indicators, and more</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-xs text-green-400">2</span>
				<div>
					<p class="font-medium text-gray-300">Layer 2: Reasoning</p>
					<p>Bullish and bearish agents construct arguments based on the collected data</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-xs text-yellow-400">3</span>
				<div>
					<p class="font-medium text-gray-300">Layer 3: Rebuttals</p>
					<p>Each side critiques the other's arguments for a balanced view</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs text-purple-400">4</span>
				<div>
					<p class="font-medium text-gray-300">Layer 4: Decision</p>
					<p>Final agent weighs all evidence and makes a BUY/SELL/HOLD recommendation</p>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	:global(body) {
		background-color: #0f172a;
		color: #e2e8f0;
	}
</style>
