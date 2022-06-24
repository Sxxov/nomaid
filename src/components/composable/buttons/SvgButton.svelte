<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Button from '../Button.svelte';
	import { CssUtility } from '../../../resources/utilities';
	import type { Css } from '../../../resources/utilities';

	export let svgHeight: Css = '16px';
	export let svgWidth: Css = '24px';

	export let svg = '';
	export let svgColour: Css = '--colour-accent-primary';
	export let hoverSvgColour: Css = svgColour;
	export let isClickable = true;

	$: sizeCorrectedSvg = svg
		.replace(/(?<=height=")\s*.*?\s*(?=")/, CssUtility.parse(svgHeight))
		.replace(/(?<=width=")\s*.*?\s*(?=")/, CssUtility.parse(svgWidth));
</script>

<div type="<SvgButton>" class="component">
	{#if isClickable}
		<Button
			isIconSpacerEnabledOverride={Boolean($$slots.default)}
			padding={$$slots.default
				? '16px max(var(--border-radius), 24px)'
				: '16px'}
			{...$$restProps}
			on:blur
			on:click
			on:focus
			on:mousedown
			on:mouseout
			on:mouseover
			on:mouseup
			on:touchend
			on:touchstart
			let:isAnimated
			let:isDisabled
			let:isFocused
			let:isHovered
		>
			<div
				slot="icon"
				class="icon"
				style="
					--colour-svg: {CssUtility.parse(isHovered ? hoverSvgColour : svgColour)};
				"
			>
				{@html sizeCorrectedSvg}
			</div>
			<slot {isHovered} {isDisabled} {isAnimated} {isFocused} />
		</Button>
	{:else}
		<div
			class="icon"
			style="
				--colour-svg: {CssUtility.parse(svgColour)};
			"
		>
			{@html sizeCorrectedSvg}
		</div>
	{/if}
</div>

<style>
	.component {
		display: contents;
	}

	.icon {
		display: contents;

		/* required to prevent bug in button, where it fires a mousedown but not a click, sometimes */
		pointer-events: none;

		fill: var(--colour-svg);

		transition: fill 0.2s var(--ease-slow-slow);
	}
</style>
