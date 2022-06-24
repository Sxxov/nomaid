<script lang="ts">
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import { RandomUtility, CssUtility } from '../../resources/utilities';
	import type { Css } from '../../resources/utilities';

	// @export
	export let value = '';
	export let isActive = false;
	export function focus(): void {
		input?.focus();
	}

	export function blur(): void {
		input?.blur();
	}

	export let label = 'Input';
	export let name = label;
	export let height: Css = 56;
	export let width: Css = '100%';
	export let buttonWidth: Css = height;
	export let labelTop: Css = 28;
	export let indent: Css = 'max(var(--min-indent), var(--roundness))';
	export let minIndent: Css = 16;
	export let floatingLabelIndent: Css = 0;
	export let backgroundColour: Css = '--colour-background-secondary';
	export let activeBackgroundColour: Css = '--colour-background-primary';
	export let textColour: Css = '--colour-text-primary';
	export let labelColour: Css = '#fff8';
	export let placeholder: string | undefined = undefined;
	export let hasMovingLabel = true;
	export let isMultiLine = false;

	const dispatch = createEventDispatcher();

	const randomFormId = RandomUtility.string();
	const randomInputId = RandomUtility.string();
	let input: HTMLInputElement | HTMLTextAreaElement;
	let mutationObserver: MutationObserver;
	let clientHeight: number;

	onMount(() => {
		clientHeight = CssUtility.unparse(CssUtility.parse(height), input);

		if (isMultiLine) {
			mutationObserver = new MutationObserver((entries) => {
				const [{ attributeName }] = entries;

				if (attributeName === 'style') {
					clientHeight = input.clientHeight;
				}
			});

			mutationObserver.observe(input, {
				attributes: true,
			});
		}
	});

	onDestroy(() => {
		mutationObserver?.disconnect();
	});

	$: if (isActive) {
		focus();
	} else {
		blur();
	}

	function submit(): void {
		dispatch('submit', value);
	}

	function onFocus() {
		isActive = true;
	}

	function onBlur() {
		isActive = false;
	}
</script>

<div
	type="<Input>"
	class="component"
	style="
		--width: {CssUtility.parse(width)};
		--height: {CssUtility.parse(clientHeight ?? height)};
		--label-top: {CssUtility.parse(labelTop)};
		--min-indent: {CssUtility.parse(minIndent)};
		--indent: {CssUtility.parse(indent)};
		--button-width: {CssUtility.parse(buttonWidth)};
	"
>
	<form
		class:inactive={!isActive}
		class:valued={value.length > 0}
		on:submit|preventDefault={() => false}
		id={randomFormId}
		style="
			--colour-background-active: {CssUtility.parse(activeBackgroundColour)};
			--colour-background: {CssUtility.parse(backgroundColour)};
			--form-valued-margin-top: {hasMovingLabel ? 'var(--label-top)' : '0'};
		"
	>
		{#if isMultiLine}
			<div class="grabber" />
			<textarea
				type="text"
				form={randomFormId}
				id={randomInputId}
				class="text"
				{name}
				placeholder={placeholder ?? label}
				bind:value
				bind:clientHeight
				bind:this={input}
				on:input
				on:focus
				on:blur
				on:focus={onFocus}
				on:blur={onBlur}
				style="
					--colour-text: {CssUtility.parse(textColour)};
				"
				{...$$restProps}
			/>
		{:else}
			<input
				type="text"
				form={randomFormId}
				id={randomInputId}
				class="text"
				{name}
				placeholder={placeholder ?? label}
				bind:value
				bind:this={input}
				on:input
				on:focus
				on:blur
				on:focus={onFocus}
				on:blur={onBlur}
				style="
					--colour-text: {CssUtility.parse(textColour)};
				"
				{...$$restProps}
			/>
		{/if}
		<label
			for={randomInputId}
			style="
				--colour-label: {CssUtility.parse(labelColour)};
				--floating-label-indent: {CssUtility.parse(floatingLabelIndent)};
				--label-focused-top: {hasMovingLabel
				? 'calc(0px - var(--label-top))'
				: 'calc((var(--height) - 1em) / 2)'};
				--label-focused-opacity: {hasMovingLabel ? 1 : 0.2};
				--label-focused-opacity-no-placeholder: {hasMovingLabel ? 1 : 0};
				--label-focused-indent: {hasMovingLabel
				? 'var(--floating-label-indent)'
				: 'var(--indent)'};
				--label-transition-duration: {hasMovingLabel ? '0.2s' : '0.1s'};
			"
		>
			<p>
				{label}
			</p>
		</label>
		<slot name="button" {focus} {blur} {submit} />
	</form>
	<slot name="hint" />
</div>

<style lang="postcss">
	.component {
		position: relative;

		/*
		 * don't collapse margins
		 * https://stackoverflow.com/a/1939980/
		 */
		padding-top: 1px;
		margin-top: -1px;

		width: var(--width);
	}

	form {
		display: flex;
		margin: 0;

		transform: matrix(1, 0, 0, 1, 0, 0);

		transition: 0.2s var(--ease-slow-slow);

		border-radius: var(--roundness);

		& input.text {
			background: var(--colour-background);
			box-shadow: var(--shadow-none);

			border-radius: var(--roundness);

			/* Chrome, Safari, Edge, Opera */
			&::-webkit-outer-spin-button,
			&::-webkit-inner-spin-button {
				-webkit-appearance: none;
			}

			/* Firefox */
			&[type='number'] {
				-moz-appearance: textfield;
			}
		}

		& .button {
			width: var(--button-width);
		}

		&:not(.inactive) {
			margin-top: var(--form-valued-margin-top);

			& input.text {
				box-shadow: var(--shadow-xl);

				background: var(--colour-background-active);
			}
		}

		&.valued {
			margin-top: var(--form-valued-margin-top);
		}

		& input.text,
		& textarea.text {
			height: var(--height);
			width: 100%;

			padding: 0;
			border: 0;
			outline: 0;

			background: var(--colour-background);

			padding: 0 var(--indent);

			line-height: 0.9em;
			color: var(--colour-text);

			user-select: text;

			transition: 0.2s var(--ease-slow-slow);

			&::placeholder {
				color: transparent;
			}

			/* reset input */
			&:required,
			&:invalid {
				box-shadow: none;
			}
		}

		& textarea.text {
			padding-top: var(--min-indent);
			padding-bottom: var(--min-indent);
			padding-top: var(--indent);
			padding-bottom: var(--indent);

			resize: vertical;

			box-sizing: border-box;
		}

		& label {
			position: absolute;
			display: block;

			/* for browsers that doesn't support the default value with 'max()' */
			text-indent: var(--min-indent);
			text-indent: var(--indent);

			cursor: text;
			top: calc((var(--height) - 1em) / 2);

			transition: top var(--label-transition-duration)
					var(--ease-slow-slow),
				opacity var(--label-transition-duration) var(--ease-slow-slow),
				text-indent var(--label-transition-duration)
					var(--ease-slow-slow);

			& > p {
				color: var(--colour-label);
				display: inline;

				transition: color var(--label-transition-duration)
					var(--ease-slow-slow);
			}
		}

		& input.text:focus ~ label,
		& input.text:not(:placeholder-shown) ~ label,
		& textarea.text:focus ~ label,
		& textarea.text:not(:placeholder-shown) ~ label {
			top: var(--label-focused-top);
			opacity: var(--label-focused-opacity-no-placeholder);
			text-indent: var(--label-focused-indent);

			& > p {
				color: var(--colour-accent-primary);
			}
		}

		& input.text:focus:placeholder-shown ~ label,
		& textarea.text:focus:placeholder-shown ~ label {
			opacity: var(--label-focused-opacity);
		}
	}
</style>
