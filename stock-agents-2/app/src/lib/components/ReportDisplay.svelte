<script lang="ts">
	import { marked } from 'marked';

	let {
		layer1Data = {},
		layer2Reasoning = null,
		layer3Rebuttals = null,
		decision = null
	}: {
		layer1Data?: Record<string, any>;
		layer2Reasoning?: { bullish?: string; bearish?: string } | null;
		layer3Rebuttals?: { bullish?: string; bearish?: string } | null;
		decision?: string | null;
	} = $props();

	// Helper to render markdown synchronously
	function renderMarkdown(text: string): string {
		if (!text) return '';
		try {
			return marked.parse(text) as string;
		} catch {
			return text;
		}
	}

	// Helper to safely get text content from layer data
	function getTextContent(value: any): string {
		if (typeof value === 'string') return value;
		if (value === null || value === undefined) return '';
		try {
			return JSON.stringify(value);
		} catch {
			return String(value);
		}
	}
</script>

{#snippet resultCard(title: string, text: string, colspan: number)}
	{@const htmlContent = renderMarkdown(text)}
	<div
		style="grid-column: span {colspan} / span {colspan};"
		class="result-card bg-gray-50 rounded-md w-full h-[400px]"
	>
		<div class="w-full h-full overflow-y-scroll p-4">
			<h3 class="text-xl font-bold mb-2 text-gray-900">{title}</h3>
			<div class="text-gray-700 prose prose-sm max-w-full">{@html htmlContent}</div>
		</div>
	</div>
{/snippet}

<div class="flex flex-col gap-4 bg-gray-50/10 w-full rounded-md">
	<div class="grid grid-cols-4 gap-4 p-6 h-full">

				<!-- Layer 4: Decision (1 card, 4 columns) -->
				{#if decision}
				{@render resultCard('Decision', getTextContent(decision), 4)}
			{/if}
		<!-- Layer 3: Rebuttals (2 cards, 2 columns each) -->
		{#if layer3Rebuttals?.bullish}
			{@render resultCard('Bullish Rebuttal', getTextContent(layer3Rebuttals.bullish), 2)}
		{/if}
		{#if layer3Rebuttals?.bearish}
			{@render resultCard('Bearish Rebuttal', getTextContent(layer3Rebuttals.bearish), 2)}
		{/if}
				<!-- Layer 2: Reasoning (2 cards, 2 columns each) -->
				{#if layer2Reasoning?.bullish}
				{@render resultCard('Bullish', getTextContent(layer2Reasoning.bullish), 2)}
			{/if}
			{#if layer2Reasoning?.bearish}
				{@render resultCard('Bearish', getTextContent(layer2Reasoning.bearish), 2)}
			{/if}

		<!-- Layer 1: Data Collection (15 cards, 1 column each) -->
		{#if layer1Data.analyst}
			{@render resultCard('Analyst', getTextContent(layer1Data.analyst), 2)}
		{/if}
		{#if layer1Data.company}
			{@render resultCard('Company', getTextContent(layer1Data.company), 2)}
		{/if}
		{#if layer1Data.income_statement}
			{@render resultCard('Income Statement', getTextContent(layer1Data.income_statement), 2)}
		{/if}
		{#if layer1Data.balance_sheet}
			{@render resultCard('Balance Sheet', getTextContent(layer1Data.balance_sheet), 2)}
		{/if}
		{#if layer1Data.cash_flow}
			{@render resultCard('Cash Flow', getTextContent(layer1Data.cash_flow), 2)}
		{/if}
		{#if layer1Data.financial_ratios}
			{@render resultCard('Financial Ratios', getTextContent(layer1Data.financial_ratios), 2)}
		{/if}
		{#if layer1Data.key_metrics}
			{@render resultCard('Key Metrics', getTextContent(layer1Data.key_metrics), 2)}
		{/if}
		{#if layer1Data.other_statement}
			{@render resultCard('Other Statement', getTextContent(layer1Data.other_statement), 2)}
		{/if}
		{#if layer1Data.income_statement_growth}
			{@render resultCard('Income Statement Growth', getTextContent(layer1Data.income_statement_growth), 2)}
		{/if}
		{#if layer1Data.balance_sheet_growth}
			{@render resultCard('Balance Sheet Growth', getTextContent(layer1Data.balance_sheet_growth), 2)}
		{/if}
		{#if layer1Data.cash_flow_growth}
			{@render resultCard('Cash Flow Growth', getTextContent(layer1Data.cash_flow_growth), 2)}
		{/if}
		{#if layer1Data.insider}
			{@render resultCard('Insider', getTextContent(layer1Data.insider), 2)}
		{/if}
		{#if layer1Data.news}
			{@render resultCard('News', getTextContent(layer1Data.news), 2)}
		{/if}
		{#if layer1Data.technical}
			{@render resultCard('Technical', getTextContent(layer1Data.technical), 2)}
		{/if}
		{#if layer1Data.economic}
			{@render resultCard('Economic', getTextContent(layer1Data.economic), 2)}
		{/if}






	</div>
</div>

