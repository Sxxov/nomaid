<script lang="ts">
	import Button from '../components/composable/Button.svelte';
	import SvgButton from '../components/composable/buttons/SvgButton.svelte';
	import Dropdown from '../components/composable/Dropdown.svelte';
	import { Dropdown as D } from '../components/composable/dropdown/Dropdown';
	import { done } from '!i/twotone::done';
	import { dropIn } from '../core/transitioner/Transitioner';
	import { onMount } from 'svelte';
	import Hint from '../components/composable/Hint.svelte';
	import { Levels } from '../components/composable/common/enums/Levels';
	import Input from '../components/composable/Input.svelte';
	import { Ctx } from '../core/ctx/Ctx';
	import { Toast } from '../components/composable/toast/Toast';

	// eslint-disable-next-line prefer-const
	let i = 0;

	Ctx.toasts.push(
		Toast.from({
			text: 'yoo',
		}),
	);
</script>

<div type="/index" class="component">
	<div in:dropIn={{ delay: ++i * 100 }}>
		<Button>Button</Button>
	</div>
	<div in:dropIn={{ delay: ++i * 100 }}>
		<SvgButton>SvgButton</SvgButton>
	</div>
	<div in:dropIn={{ delay: ++i * 100 }}>
		<Dropdown
			items={[
				new Promise((resolve) => {
					setTimeout(() => {
						resolve(
							D.from({
								svg: done,
								text: 'aaa',
							}),
						);
					}, 1000);
				}),
				new Promise((resolve) => {
					setTimeout(() => {
						resolve(
							D.from({
								svg: done,
								text: 'bbb',
							}),
						);
					}, 2000);
				}),
				new Promise((resolve) => {
					setTimeout(() => {
						resolve(
							D.from({
								svg: done,
								text: 'ccc',
							}),
						);
					}, 3000);
				}),
			]}
		/>
	</div>
	<div in:dropIn={{ delay: ++i * 100 }}>
		<Hint level={Levels.WARN}>hi</Hint>
	</div>
	<!-- <div in:dropIn={{ delay: ++i * 100 }}>
		<Input />
	</div> -->
</div>

<style lang="postcss">
</style>
