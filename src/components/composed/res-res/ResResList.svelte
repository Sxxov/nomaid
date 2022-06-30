<script lang="ts">
	import { CssUtility, type Css } from '../../../resources/utilities';
	import { Axes } from '../../composable/common/enums/Axes';
	import type { IResResContext } from './IResResContext';

	export let itemCount: number;
	export let height: Css = '100%';
	export let width: Css = '100%';
	export let stackedCount = 3;
	export let smallCount = 3;
	export let smallSizePx = 56;
	export let bigMinSizePx = 200;
	export let gapSizePx = 8;
	export let scrollDenominator = 100;

	let position = 0;
	let clientHeight: number;
	let clientWidth: number;
	let ctx: IResResContext;

	$: bigAvailableLayoutSize =
		(currAxis === Axes.Y ? clientHeight : clientWidth) -
		(smallCount + Math.min(position, smallCount - 1)) *
			(smallSizePx + gapSizePx) -
		(stackedCount * 2 + Math.min(position, stackedCount)) * gapSizePx;
	$: bigCount = Math.floor(bigAvailableLayoutSize / bigMinSizePx);
	$: bigSizePx = bigAvailableLayoutSize / bigCount;
	$: currAxis = clientHeight > clientWidth ? Axes.Y : Axes.X;
	$: ctx = {
		smallCount,
		stackedCount,
		bigCount,
		position,
		bigSizePx,
		smallSizePx,
		gapSizePx,
		currAxis,
	};
</script>

<div
	type="<ResResList>"
	class="component"
	bind:clientHeight
	bind:clientWidth
	style="
		--height: {CssUtility.parse(height)};
		--width: {CssUtility.parse(width)};
	"
>
	<div
		class="wrapper"
		style="
			--height: {currAxis === Axes.Y ? `${clientHeight}px` : '100%'};
			--width: {currAxis === Axes.X ? `${clientWidth}px` : '100%'};
			--overflow: {currAxis === Axes.Y ? 'hidden scroll' : 'scroll hidden'};
		"
		on:scroll={(e) => {
			position =
				(currAxis === Axes.Y
					? e.currentTarget.scrollTop
					: e.currentTarget.scrollLeft) / scrollDenominator;
		}}
	>
		<div
			class="content"
			style="
				--height: {currAxis === Axes.Y ? '0' : '100%'};
				--width: {currAxis === Axes.X ? '0' : '100%'};
				--flow: {currAxis === Axes.Y ? 'row' : 'column'};
			"
		>
			<slot {ctx} />
		</div>
		<div
			class="padder"
			style="
				--height: {currAxis === Axes.Y
				? `${itemCount * scrollDenominator + clientHeight}px`
				: '100%'};
				--width: {currAxis === Axes.X
				? `${itemCount * scrollDenominator + clientHeight}px`
				: '100%'};
			"
		/>
	</div>
</div>

<style lang="postcss">
	.component {
		height: var(--height);
		width: var(--width);

		& > .wrapper {
			overflow: var(--overflow);

			height: var(--height);
			width: var(--width);

			& > .content {
				position: sticky;
				top: 0;
				left: 0;

				height: var(--height);
				width: var(--width);

				display: grid;
				grid-auto-flow: var(--flow);
			}

			& > .padder {
				height: var(--height);
				width: var(--width);
			}
		}
	}
</style>
