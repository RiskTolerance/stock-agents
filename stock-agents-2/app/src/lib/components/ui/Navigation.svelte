<script lang="ts">
	let { currentPath } = $props();
</script>

<div class="flex justify-center items-center h-full text-white gap-8">
	<a class="hover:text-teal-200 transition-colors {currentPath === '/reports' ? 'text-teal-400' : ''}" href="/reports">Reports</a>
	<a class="hover:text-teal-200 transition-colors {currentPath === '/portfolio' ? 'text-teal-400' : ''}" href="/portfolio">Portfolio</a>
	<a class="hover:text-teal-200 transition-colors {currentPath === '/monitoring' ? 'text-teal-400' : ''}" href="/monitoring">Monitoring</a>
	<a class="hover:text-teal-200 transition-colors {currentPath === '/sessions' ? 'text-teal-400' : ''}" href="/sessions">Sessions</a>
</div>

