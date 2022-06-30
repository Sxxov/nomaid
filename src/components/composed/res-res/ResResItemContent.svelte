<script lang="ts">
	import { CssUtility, type Css } from '../../../resources/utilities';

	export let height: Css = '100%';
	export let width: Css = '100%';
</script>

<div
	type="<ResResItemContent>"
	class="component"
	style="
		--height: {CssUtility.parse(height)};
		--width: {CssUtility.parse(width)};
	"
/>

<style lang="postcss">
	.component {
		min-height: 56px;
		min-width: 56px;

		height: var(--height);
		width: var(--width);

		transition: 0.3s var(--ease-fast-slow);

		background: red;
		border: blue solid 4px;
		box-sizing: border-box;
	}
</style>
