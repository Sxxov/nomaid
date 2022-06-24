<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Ripple, { type IRippleVector } from './Ripple.svelte';
	import { CssUtility } from '../../resources/utilities';
	import type { Css } from '../../resources/utilities';
	import Spacer from './Spacer.svelte';
	import { Axes } from './common/enums/Axes';

	const enum Coords {
		x = 50,
		y = 50,
	}

	export let isSlotHooksEnabled = true;
	export let backgroundColour: Css = '--colour-accent-secondary';
	export let hoverBackgroundColour: Css = '--colour-background-secondary';
	export let rippleColour: Css = 'white';
	export let textColour: Css = '--colour-accent-primary';
	export let hoverTextColour: Css = '--colour-accent-primary';
	export let iconFilter: Css = '--filter-accent-primary';
	export let hoverIconFilter: Css = '--filter-accent-primary';
	export let border: Css = '';
	export let hoverBorder: Css = '';
	export let iconSize: Css = '1rem';
	export let width: Css = 'max-content';
	export let roundness: Css = '--roundness';
	export let height: Css = 'max(calc(var(--border-radius) * 2), 56px)';
	export let isText = true;
	export let textAlign: Css = 'center';
	export let padding: Css = $$slots.default
		? '16px max(var(--border-radius), 24px)'
		: '16px';
	export let overflow = '';
	export let isIconSpacerEnabledOverride: boolean | null = null;
	export let isShaded = true;
	export let isFocused = false;
	export let isDisabled = false;
	export let isHovered = false;
	export let isAnimated = true;
	export let transition = isAnimated ? '0.2s var(--ease-slow-slow)' : 'unset';
	export let isTextInvertedAgainstBackground = false;
	export let type = 'button';
	export let rippleProps: Omit<
		Partial<Ripple['$$prop_def']>,
		keyof IRippleVector
	> = {};

	$: rippleSpeed = rippleProps.speed ?? 1000;

	const dispatch = createEventDispatcher();
	let ripples: IRippleVector[] = [];

	let button: HTMLButtonElement;
	let offsetWidth: number;
	let offsetHeight: number;

	$: offsetX = Math.abs(offsetWidth / 2 - Coords.x);
	$: offsetY = Math.abs(offsetHeight / 2 - Coords.y);
	$: deltaX = offsetWidth / 2 + offsetX;
	$: deltaY = offsetHeight / 2 + offsetY;
	$: scaleRatio = Math.sqrt(deltaX ** 3 + deltaY ** 3);

	$: isPressed = !isFocused;

	let isTouched = false;
	let timeoutHandle: ReturnType<typeof setTimeout>;

	function onDown(event: MouseEvent | TouchEvent) {
		const { x, y } = button.getBoundingClientRect();

		/**
		 * @bug TouchEvent/MotionEvent can not be defined when touch/mouse is not present
		 * in certain browsers (FF)
		 */
		if (window.TouchEvent && event instanceof TouchEvent) {
			isTouched = true;

			ripples.push({
				x: event.touches[0].pageX - x,
				y: event.touches[0].pageY - y,
				size: scaleRatio,
			});
			ripples = ripples;
		}

		if (window.MouseEvent && event instanceof MouseEvent) {
			if (isTouched) {
				isTouched = false;
			} else {
				ripples.push({
					x: event.clientX - x,
					y: event.clientY - y,
					size: scaleRatio,
				});
				ripples = ripples;
			}
		}

		clearTimeout(timeoutHandle);
		timeoutHandle = setTimeout(() => {
			ripples.length = 0;
		}, Number(rippleSpeed) + Number(rippleSpeed * 2));

		isPressed = false;
	}

	function onUp() {
		isPressed = false;
	}
</script>

<div
	type="<Button>"
	class="component"
	class:pressed={isPressed}
	class:hover={isHovered}
	class:shaded={isShaded}
	style="
		--width: {CssUtility.parse(width)};
		--height: {CssUtility.parse(height)};
		--border: {CssUtility.parse(border)};
		--border-hover: {CssUtility.parse(isAnimated ? hoverBorder : border)};
		--border-radius: {CssUtility.parse(roundness)};
		--transition: {isAnimated ? transition : 'unset'};
		--overflow: {overflow};
	"
	on:mouseover
	on:mouseover={() => {
		isHovered = true;
	}}
	on:mouseout
	on:mouseout={() => {
		isHovered = false;
	}}
	on:focus
	on:blur
>
	{#if $$slots.background}
		<div class="background">
			<slot name="background" />
		</div>
	{/if}
	<button
		{type}
		bind:this={button}
		bind:offsetHeight
		bind:offsetWidth
		style="
			--colour-background: {CssUtility.parse(backgroundColour)};
			--colour-background-hover: {CssUtility.parse(
			isAnimated ? hoverBackgroundColour : backgroundColour,
		)};
			--colour-ripple: {CssUtility.parse(rippleColour)};
			--colour-text: {CssUtility.parse(
			isTextInvertedAgainstBackground ? 'white' : textColour,
		)};
			--colour-text-hover: {CssUtility.parse(
			isAnimated ? hoverTextColour : textColour,
		)};
			--filter-icon: {CssUtility.parse(
			isTextInvertedAgainstBackground ? 'brightness(100)' : iconFilter,
		)};
			--filter-icon-hover: {CssUtility.parse(
			isAnimated ? hoverIconFilter : iconFilter,
		)};
			--button-padding: {CssUtility.parse(padding)};
			--icon-size: {CssUtility.parse(iconSize)};
			--text-align: {textAlign};
			--mix-blend-mode: {isTextInvertedAgainstBackground ? 'difference' : 'unset'};
		"
		on:click
		on:focus={() => {
			isFocused = true;
		}}
		on:blur={() => {
			isFocused = false;
		}}
		on:touchstart|passive
		on:mousedown
		on:touchend|passive
		on:mouseup
		on:touchstart|passive={onDown}
		on:mousedown={onDown}
		on:touchend={onUp}
		on:mouseup={onUp}
		disabled={isDisabled}
	>
		<span class="content">
			<slot name="icon" />
			{#if isIconSpacerEnabledOverride == null ? $$slots.icon && $$slots.default : isIconSpacerEnabledOverride}
				<Spacer width={8} direction={Axes.HORIZONTAL} />
			{/if}
			{#if isText}
				<p>
					<slot {isHovered} {isDisabled} {isAnimated} {isFocused} />
				</p>
			{:else}
				<!-- 
					this if statement needs to be structured this way to keep
					svelte's intellisense happy
				-->
				{#if !isSlotHooksEnabled}
					<slot
						isHovered={undefined}
						isDisabled={undefined}
						isAnimated={undefined}
						isFocused={undefined}
					/>
				{:else}
					<slot {isHovered} {isDisabled} {isAnimated} {isFocused} />
				{/if}
			{/if}
		</span>
		<svg>
			{#each ripples as ripple}
				<Ripple
					x={ripple.x}
					y={ripple.y}
					size={ripple.size}
					speed={1000}
					sizeIn={20}
					opacityIn={0.2}
					fill="white"
					{...rippleProps}
				/>
			{/each}
		</svg>
	</button>
</div>

<style lang="postcss">
	.component {
		box-shadow: var(--shadow-none);

		height: var(--height);
		width: var(--width);

		border: var(--border);
		border-radius: var(--border-radius);

		overflow: var(--overflow);

		&.pressed.shaded {
			box-shadow: var(--shadow-xl);
		}

		&,
		& * {
			transition: var(--transition), box-shadow 0.2s var(--ease-slow-slow);
		}
	}

	button {
		height: var(--height);
		width: var(--width);

		background: var(--colour-background);

		transform: matrix(1, 0, 0, 1, 0, 0);
		padding: var(--button-padding);

		border: 0;
		outline: none;
		-webkit-tap-highlight-color: transparent;

		cursor: pointer;

		border-radius: var(--border-radius);

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&:hover,
		.hover > & {
			background: var(--colour-background-hover);

			& * {
				color: var(--colour-text-hover);
			}
		}

		&:active {
			box-shadow: var(--shadow-inner);
		}

		& * {
			color: var(--colour-text);
			mix-blend-mode: var(--mix-blend-mode);
		}
	}

	.content {
		position: relative;
		height: 100%;
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: var(--text-align);

		margin: 0;
		padding: 0;

		p {
			font-size: 1rem;

			margin: 0;
			user-select: none;
		}
	}

	svg {
		height: 100%;
		width: 100%;

		border-radius: var(--border-radius);

		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
	}

	.background {
		height: 100%;
		width: 100%;

		position: absolute;
	}
</style>
