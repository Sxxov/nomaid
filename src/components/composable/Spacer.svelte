<script lang="ts">
	import { CssUtility } from '../../resources/utilities';
	import type { Css } from '../../resources/utilities';
	import { Axes } from './common/enums/Axes';

	export let height: Css = 24;
	export let width: Css = 24;
	export let direction: Axes = Axes.VERTICAL;
</script>

<div
	type="<Spacer>"
	class="component"
	style="
		--height: calc({CssUtility.parse(direction === Axes.VERTICAL ? height : 0)});
		--width: calc({CssUtility.parse(direction === Axes.HORIZONTAL ? width : 0)});
"
/>

<style>
	.component {
		height: var(--height);
		width: var(--width);

		user-select: none;
		pointer-events: none;
	}
</style>
