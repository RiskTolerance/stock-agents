<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900">
	<nav class="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-lg relative z-50">
		<div class="container mx-auto flex items-center justify-between px-4 py-4">
			<a href="/" class="text-xl font-bold text-white hover:text-teal-400 transition-colors">
				Stock Agents
			</a>
			<div class="flex gap-6">
				<a href="/analyze" class="text-gray-400 transition-colors hover:text-teal-300">
					Analyze
				</a>
				<a href="/reports" class="text-gray-400 transition-colors hover:text-teal-300">
					Reports
				</a>
				<a href="/portfolio" class="text-gray-400 transition-colors hover:text-teal-300">
					Portfolio
				</a>
				<a href="/monitoring" class="text-gray-400 transition-colors hover:text-teal-300">
					Monitoring
				</a>
			</div>
		</div>
	</nav>

	{@render children()}
</div>
