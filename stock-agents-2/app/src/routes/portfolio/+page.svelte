<script lang="ts">
	import { getAccount, getPositions, getOrders } from './data.remote';

	const accountQuery = getAccount();
	const positionsQuery = getPositions();
	const ordersQuery = getOrders({ status: 'all', limit: 10 });

	function formatCurrency(value: string) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(parseFloat(value));
	}

	function formatPercent(value: string) {
		const num = parseFloat(value) * 100;
		const sign = num >= 0 ? '+' : '';
		return `${sign}${num.toFixed(2)}%`;
	}

	function getDayChange(equity: string, lastEquity: string) {
		return parseFloat(equity) - parseFloat(lastEquity);
	}
</script>

<svelte:head>
	<title>Portfolio | Stock Agents</title>
</svelte:head>

<main class="container mx-auto max-w-6xl px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-100">Portfolio</h1>

	<!-- Account Summary -->
	<section class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-gray-200">Account Summary</h2>
		{#if accountQuery.loading}
			<div class="h-32 animate-pulse rounded-lg bg-gray-800/50"></div>
		{:else if accountQuery.error}
			<div class="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-400">
				Error loading account: {accountQuery.error.message}
			</div>
		{:else if accountQuery.current}
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
					<p class="text-sm text-gray-400">Portfolio Value</p>
					<p class="text-2xl font-bold text-gray-100">{formatCurrency(accountQuery.current.account.portfolioValue)}</p>
				</div>
				<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
					<p class="text-sm text-gray-400">Cash</p>
					<p class="text-2xl font-bold text-gray-100">{formatCurrency(accountQuery.current.account.cash)}</p>
				</div>
				<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
					<p class="text-sm text-gray-400">Buying Power</p>
					<p class="text-2xl font-bold text-gray-100">{formatCurrency(accountQuery.current.account.buyingPower)}</p>
				</div>
				{#if accountQuery.current}
					{@const change = getDayChange(accountQuery.current.account.equity, accountQuery.current.account.lastEquity)}
					<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
						<p class="text-sm text-gray-400">Day's Change</p>
						<p class="text-2xl font-bold {change >= 0 ? 'text-green-400' : 'text-red-400'}">
							{change >= 0 ? '+' : ''}{formatCurrency(change.toString())}
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</section>

	<!-- Positions -->
	<section class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-gray-200">Positions</h2>
		{#if positionsQuery.loading}
			<div class="h-48 animate-pulse rounded-lg bg-gray-800/50"></div>
		{:else if positionsQuery.error}
			<div class="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-400">
				Error loading positions: {positionsQuery.error.message}
			</div>
		{:else if !positionsQuery.current || positionsQuery.current.positions.length === 0}
			<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
				<p class="text-gray-400">No positions</p>
				<a
					href="/analyze"
					class="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
				>
					Analyze a stock
				</a>
			</div>
		{:else}
			<div class="overflow-x-auto rounded-lg border border-gray-700">
				<table class="w-full">
					<thead class="bg-gray-800/50">
						<tr>
							<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Symbol</th>
							<th class="px-4 py-3 text-right text-sm font-medium text-gray-300">Qty</th>
							<th class="px-4 py-3 text-right text-sm font-medium text-gray-300">Avg Price</th>
							<th class="px-4 py-3 text-right text-sm font-medium text-gray-300">Current</th>
							<th class="px-4 py-3 text-right text-sm font-medium text-gray-300">Market Value</th>
							<th class="px-4 py-3 text-right text-sm font-medium text-gray-300">P/L</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-700">
						{#each positionsQuery.current?.positions ?? [] as position}
							<tr class="hover:bg-gray-800/30">
								<td class="px-4 py-3 font-medium text-gray-100">{position.symbol}</td>
								<td class="px-4 py-3 text-right text-gray-300">{position.qty}</td>
								<td class="px-4 py-3 text-right text-gray-300">{formatCurrency(position.avgEntryPrice)}</td>
								<td class="px-4 py-3 text-right text-gray-300">{formatCurrency(position.currentPrice)}</td>
								<td class="px-4 py-3 text-right text-gray-300">{formatCurrency(position.marketValue)}</td>
								<td class="px-4 py-3 text-right {parseFloat(position.unrealizedPL) >= 0 ? 'text-green-400' : 'text-red-400'}">
									{formatCurrency(position.unrealizedPL)} ({formatPercent(position.unrealizedPLPC)})
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>

	<!-- Recent Orders -->
	<section>
		<h2 class="mb-4 text-xl font-semibold text-gray-200">Recent Orders</h2>
		{#if ordersQuery.loading}
			<div class="h-48 animate-pulse rounded-lg bg-gray-800/50"></div>
		{:else if ordersQuery.error}
			<div class="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-red-400">
				Error loading orders: {ordersQuery.error.message}
			</div>
		{:else if !ordersQuery.current || ordersQuery.current.orders.length === 0}
			<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
				<p class="text-gray-400">No orders yet</p>
			</div>
		{:else}
			<div class="overflow-x-auto rounded-lg border border-gray-700">
				<table class="w-full">
					<thead class="bg-gray-800/50">
						<tr>
							<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Symbol</th>
							<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Side</th>
							<th class="px-4 py-3 text-right text-sm font-medium text-gray-300">Qty</th>
							<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Type</th>
							<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
							<th class="px-4 py-3 text-left text-sm font-medium text-gray-300">Submitted</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-700">
						{#each ordersQuery.current?.orders ?? [] as order}
							<tr class="hover:bg-gray-800/30">
								<td class="px-4 py-3 font-medium text-gray-100">{order.symbol}</td>
								<td class="px-4 py-3 {order.side === 'buy' ? 'text-green-400' : 'text-red-400'}">
									{order.side.toUpperCase()}
								</td>
								<td class="px-4 py-3 text-right text-gray-300">{order.qty}</td>
								<td class="px-4 py-3 text-gray-300">{order.type}</td>
								<td class="px-4 py-3">
									<span class="rounded-full px-2 py-1 text-xs {
										order.status === 'filled' ? 'bg-green-500/20 text-green-400' :
										order.status === 'canceled' ? 'bg-gray-500/20 text-gray-400' :
										'bg-yellow-500/20 text-yellow-400'
									}">
										{order.status}
									</span>
								</td>
								<td class="px-4 py-3 text-sm text-gray-400">
									{new Date(order.submittedAt).toLocaleString()}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</main>

