<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="min-h-screen bg-slate-900">
	<nav class="border-b border-gray-800 bg-slate-900/80 backdrop-blur-sm">
		<div class="container mx-auto flex items-center justify-between px-4 py-4">
			<a href="/" class="text-xl font-bold text-gray-100 hover:text-blue-400">
				Stock Agents
			</a>
			<div class="flex gap-6">
				<a href="/analyze" class="text-gray-400 transition-colors hover:text-gray-100">
					Analyze
				</a>
				<a href="/reports" class="text-gray-400 transition-colors hover:text-gray-100">
					Reports
				</a>
				<a href="/portfolio" class="text-gray-400 transition-colors hover:text-gray-100">
					Portfolio
				</a>
			</div>
		</div>
	</nav>

	{@render children()}
</div>
