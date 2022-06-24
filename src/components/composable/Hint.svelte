<script lang="ts">
	import { CssUtility } from '../../resources/utilities';
	import type { Css } from '../../resources/utilities';
	import { Levels } from './common/enums/Levels';
	import { LevelColours } from './common/enums/LevelColours';
	import {
		error_outline,
		warning,
		error,
		done,
	} from '!i/twotone::error_outline,warning,error,done';
	import SvgButton from './buttons/SvgButton.svelte';

	export let level: Levels = Levels.INFO;
	export let overrideColour: Css | undefined = undefined;

	const LevelIconSvg = [error_outline, warning, error, done, ''] as const;
</script>

<div type="<Hint>" class="component">
	<span
		class:none={level === Levels.NONE}
		class="content"
		style="
			--colour-hint: {CssUtility.parse(overrideColour ?? LevelColours[level] ?? '')}
		"
	>
		{#if LevelIconSvg[level] != null}
			<SvgButton
				svg={LevelIconSvg[level]}
				svgColour="--colour-hint"
				isClickable={false}
			/>
		{/if}
		<p class="text">
			<slot>Hint</slot>
		</p>
	</span>
</div>

<style lang="postcss">
	.content {
		display: flex;
		align-items: center;

		gap: 12px;

		overflow: hidden;

		opacity: 1;
		height: calc(1rem + 2em);

		transition: 0.2s var(--ease-slow-slow);

		&.none {
			opacity: 0;
			height: 0;
		}

		& > p {
			color: var(--colour-hint);

			font-size: 1rem;
			line-height: 1;

			transition: 0.2s var(--ease-slow-slow);
		}
	}
</style>
