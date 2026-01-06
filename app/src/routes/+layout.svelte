<script lang="ts">
	import './layout.css';
	import Navigation from '$lib/components/ui/Navigation.svelte';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="min-h-screen bg-linear-to-b from-zinc-800 to-zinc-900">
	<nav class="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-lg relative z-50">
		<div class="container mx-auto flex items-center justify-between px-4 py-4">
			<a href="/" class="text-xl font-bold text-white hover:text-teal-400 transition-colors">
				Stock Agents
			</a>
			<Navigation currentPath={$page.url.pathname} />
		</div>
	</nav>

	{@render children()}
</div>
