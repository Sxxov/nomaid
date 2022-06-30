<script lang="ts">
	import { CssUtility } from '../../resources/utilities';
	import type { Css } from '../../resources/utilities';

	export let height: Css = '16px';
	export let width: Css = '24px';

	export let svg = '';
	export let colour: Css = '--colour-accent-primary';

	$: sizeCorrectedSvg = svg
		.replace(/(?<=height=")\s*.*?\s*(?=")/, CssUtility.parse(height))
		.replace(/(?<=width=")\s*.*?\s*(?=")/, CssUtility.parse(width));
</script>

<div
	class="icon"
	style="
	--colour-svg: {CssUtility.parse(colour)};
"
>
	{@html sizeCorrectedSvg}
</div>

<style lang="postcss">
	.icon {
		display: contents;

		/* required to prevent bug in button, where it fires a mousedown but not a click, sometimes */
		pointer-events: none;

		fill: var(--colour-svg);

		transition: fill 0.2s var(--ease-slow-slow);
	}
</style>
