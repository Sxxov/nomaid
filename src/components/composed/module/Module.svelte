<script lang="ts">
	import { onMount } from 'svelte';
	import {
		dropIn,
		dropOut,
		noop,
	} from '../../../core/transitioner/Transitioner';
	import { CssUtility, type Css } from '../../../resources/utilities';
	import { Axes } from '../../composable/common/enums/Axes';
	import Svg from '../../composable/Svg.svelte';

	export let height: Css = '100%';
	export let width: Css = '100%';
	export let svg: string;
	export let name: string;

	let componentDiv: HTMLDivElement;

	const dropOutOnlyOnY = (...args: Parameters<typeof dropOut>) =>
		currAxis === Axes.Y ? dropOut(...args) : noop;

	const dropInOnlyOnY = (...args: Parameters<typeof dropIn>) =>
		currAxis === Axes.Y ? dropIn(...args) : noop;

	let clientHeight: number;
	let clientWidth: number;

	$: currAxis = clientHeight > clientWidth ? Axes.Y : Axes.X;

	onMount(() => {
		requestAnimationFrame(() => {
			// force sync layout & set clientHeight, clientWidth
			({ clientHeight, clientWidth } = componentDiv);
		});
	});
</script>

<div
	type="<Module>"
	class="component"
	style="
		--height: {CssUtility.parse(height)};
		--width: {CssUtility.parse(width)};
		--height-bar: {currAxis === Axes.Y ? `56px` : '100%'};
		--width-bar: {currAxis === Axes.X ? `56px` : '100%'};
		--height-inner: {currAxis === Axes.Y ? `calc(100% - 56px)` : '100%'};
		--width-inner: {currAxis === Axes.X ? `calc(100% - 56px)` : '100%'};
	"
	bind:clientHeight
	bind:clientWidth
	bind:this={componentDiv}
>
	<div
		class="name"
		class:landscape={currAxis === Axes.Y && clientWidth <= 180}
		in:dropIn
		out:dropOut
	>
		<Svg {svg} />
		<p>{name}</p>
	</div>
	{#if clientHeight > 56 && clientWidth > 180}
		<div class="inner" in:dropInOnlyOnY out:dropOutOnlyOnY>
			<div class="content">
				<p class="label">when:</p>
				<slot name="hooks" />
				<hr />
				<p class="label">do:</p>
				<slot name="actions" />
			</div>
			<div class="gradient" />
		</div>
	{/if}
</div>

<style lang="postcss">
	.component {
		min-height: 56px;
		min-width: 56px;

		height: var(--height);
		width: var(--width);

		background: var(--colour-background-secondary);
		border: #fff3 solid 1px;
		border-radius: var(--roundness);
		box-sizing: border-box;

		transition: 0.3s var(--ease-fast-slow);

		& > .name {
			display: flex;
			align-items: center;

			gap: 8px;

			padding: 0 14px;
			min-width: 56px;
			min-height: 56px;
			box-sizing: border-box;

			& > p {
				margin: 0;
			}

			&.landscape {
				margin-top: 21px;
				writing-mode: vertical-rl;
			}
		}

		& > .inner {
			display: flex;
			flex-direction: column;

			height: calc(100% - 56px);
			width: 100%;

			bottom: 0;

			background: #fff1;
			border: #fff3 solid 1px;
			border-radius: var(--roundness);
			box-sizing: border-box;

			overflow: hidden;

			& > .content {
				padding: 14px;

				box-sizing: border-box;

				& > hr {
					width: calc(100% - 28px);
					border: none;
					border-top: var(--colour-background-primary) 1px solid;
					margin: 8px 14px;
				}

				& > .label {
					margin: 0;
					margin-bottom: 14px;
				}
			}

			& > .gradient {
				position: absolute;

				bottom: 0;

				min-height: 56px;
				min-width: 56px;
				width: 100%;

				pointer-events: none;

				background: linear-gradient(
					0deg,
					var(--colour-background-secondary) 0%,
					#0000 100%
				);

				border-radius: var(--roundness);
			}
		}
	}
</style>
