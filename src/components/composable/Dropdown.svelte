<script context="module" lang="ts">
	const LOADING_ITEM = Dropdown.from({
		label: true,
		svg: border_clear,
		text: 'Loading, give me a bit...',
	});
	const NO_ITEMS_ITEM = Dropdown.from({
		label: true,
		svg: clear,
		text: 'No items found',
	});
</script>

<script lang="ts">
	import {
		border_clear,
		clear,
		keyboard_arrow_down,
		keyboard_arrow_up,
	} from '!i/twotone::border_clear,clear,keyboard_arrow_up,keyboard_arrow_down';
	import { dropIn, dropOut } from '../../core/transitioner/Transitioner';
	import type { Css } from '../../resources/utilities';
	import { CssUtility } from '../../resources/utilities';
	import SvgButton from './buttons/SvgButton.svelte';
	import { Dropdown } from './dropdown/Dropdown';
	import Input from './Input.svelte';

	export let isActive = false;
	export let items: (Promise<Dropdown> | Dropdown)[] = [];
	export let height: Css = 56;
	export let width: Css = 'auto';
	export let itemsHeight: Css = 192;
	export let label = '...';
	export let chosenItem: Dropdown | undefined = undefined;
	export let chosenId: string | undefined = undefined;

	const resolvedItems: Dropdown[] = [];
	let isBlurCancelled = false;
	let searchPhrase = '';
	let currItems: Dropdown[] = resolvedItems;
	let currIndexOfSearchPhrases: number[] = [];

	for (let i = 0, l = items.length; i < l; ++i) {
		const item = items[i];

		if (item instanceof Promise) {
			resolvedItems[i] = LOADING_ITEM;
			void item.then((v) => {
				resolvedItems[i] = v;
			});
		} else {
			resolvedItems[i] = item;
		}
	}

	// sort items according to search phrase text
	$: {
		const matchingItems: Dropdown[] = [];
		const restItems: Dropdown[] = [];
		const indexOfSearchPhrases: number[] = [];

		for (const item of resolvedItems) {
			const indexOfSearchPhrase = item.text
				.toLowerCase()
				.indexOf(searchPhrase.toLowerCase());

			if (indexOfSearchPhrase >= 0) {
				indexOfSearchPhrases.push(indexOfSearchPhrase);
				matchingItems.push(item);
			} else {
				restItems.push(item);
			}
		}

		currIndexOfSearchPhrases = indexOfSearchPhrases;
		currItems = [...matchingItems, ...restItems];
	}

	$: if (currItems.length <= 0) {
		currItems = [getPlaceholderItem(isPending)];
	}

	$: isPending = resolvedItems.length < items.length;

	$: if (chosenItem) {
		isActive = false;
		searchPhrase = chosenItem.text;
		chosenId = chosenItem.id;
	} else {
		searchPhrase = '';
		chosenId = undefined;
	}

	// prevents svelte from complaining about currItems & isPending circular dep
	function getPlaceholderItem(isPending: boolean) {
		return isPending ? LOADING_ITEM : NO_ITEMS_ITEM;
	}

	let prevSearchPhrase = searchPhrase;
	function isNewSearchPhrase() {
		if (searchPhrase !== prevSearchPhrase) {
			prevSearchPhrase = searchPhrase;

			return true;
		}

		return false;
	}
</script>

<div type="<Dropdown>" class="component">
	<Input
		bind:isActive
		{label}
		bind:value={searchPhrase}
		{width}
		{height}
		on:focus={(e) => {
			// without this explicit `isActive = true`,
			// the bind seems to fail onfocus
			isActive = true;
			isBlurCancelled = false;

			if (isNewSearchPhrase()) {
				// @ts-expect-error no ts zone
				e.target?.setSelectionRange(0, searchPhrase.length);
			}
		}}
		on:blur={(e) => {
			if (isBlurCancelled) {
				e.stopImmediatePropagation();
				isBlurCancelled = false;
			}

			if (isNewSearchPhrase()) {
				// @ts-expect-error no ts zone
				e.target?.setSelectionRange(0, searchPhrase.length);
			}
		}}
		hasMovingLabel={false}
		{...$$restProps}
	>
		<div class="buttons" slot="button" let:focus>
			<SvgButton
				backgroundColour="--colour-background-secondary"
				hoverBackgroundColour="--colour-background-primary"
				isShaded={false}
				svg={clear}
				on:click={() => {
					chosenItem = undefined;
					isBlurCancelled = false;
					focus();
				}}
				on:mousedown={() => {
					isBlurCancelled = true;
				}}
			/>
			<SvgButton
				isShaded={false}
				svg={isActive ? keyboard_arrow_up : keyboard_arrow_down}
				on:click={() => {
					isActive = !isActive;
					isBlurCancelled = false;
				}}
				on:mousedown={() => {
					isBlurCancelled = true;
				}}
				on:touchstart={() => {
					isBlurCancelled = true;
				}}
			/>
		</div>
	</Input>
	<div
		class="items"
		style="
			--height: {CssUtility.parse(itemsHeight)};
		"
	>
		{#if isActive}
			<div
				class="content"
				style="
					--pointer-events: {isActive ? 'unset' : 'none'};
				"
			>
				{#each currItems as item, i}
					<div
						class="item"
						in:dropIn={{ delay: i * 50 }}
						out:dropOut={{
							delay: i * 50,
							duration: 100,
						}}
					>
						<SvgButton
							width="100%"
							textAlign="left"
							svg={item.svg}
							backgroundColour={item.backgroundColour}
							hoverBackgroundColour={item.hoverBackgroundColour}
							rippleColour={item.rippleColour}
							textColour={item.textColour}
							on:click={() => {
								chosenItem = item;
							}}
							isDisabled={item.label}
						>
							{#if i in currIndexOfSearchPhrases}
								{item.text.substring(
									0,
									currIndexOfSearchPhrases[i],
								)}<u
									>{item.text.substring(
										currIndexOfSearchPhrases[i],
										currIndexOfSearchPhrases[i] +
											searchPhrase.length,
									)}</u
								>{item.text.substring(
									currIndexOfSearchPhrases[i] +
										searchPhrase.length,
									item.text.length,
								)}
							{:else}
								{item.text}
							{/if}
						</SvgButton>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.component {
		background: var(--colour-background-secondary);
		border-radius: var(--roundness);
	}

	.buttons {
		display: flex;
	}

	.items {
		height: 0;
		width: 100%;

		transform: matrix(1, 0, 0, 1, 0, 0);

		& .content {
			width: 100%;
			position: absolute;
			height: var(--height);
			overflow: auto;

			display: flex;
			flex-direction: column;

			pointer-events: var(--pointer-events);

			& > * {
				margin-top: 2px;
			}
		}
	}

	.item {
		width: 100%;
	}
</style>
