<script lang="ts">
	import Button from '../Button.svelte';
	import { CssUtility } from '../../../resources/utilities';
	import type { Css } from '../../../resources/utilities';
	import Svg from '../Svg.svelte';

	export let svgHeight: Css = '16px';
	export let svgWidth: Css = '24px';

	export let svg = '';
	export let svgColour: Css = '--colour-accent-primary';
	export let hoverSvgColour: Css = svgColour;
</script>

<div type="<SvgButton>" class="component">
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
		<Svg
			{svg}
			height={svgHeight}
			width={svgWidth}
			colour={CssUtility.parse(isHovered ? hoverSvgColour : svgColour)}
		/>
		<slot {isHovered} {isDisabled} {isAnimated} {isFocused} />
	</Button>
</div>

<style lang="postcss">
	.component {
		display: contents;
	}
</style>
