<script lang="ts">
	import type { Snippet } from 'svelte';
	import { magnetic } from '$lib/actions/magnetic';

	interface Props {
		href?: string;
		onclick?: () => void;
		/** 'solid' = ink pill; 'outline' = hairline pill; 'inverse' = paper pill on ink surfaces. */
		variant?: 'solid' | 'outline' | 'inverse';
		download?: string;
		external?: boolean;
		ariaLabel?: string;
		children: Snippet;
	}

	let {
		href,
		onclick,
		variant = 'solid',
		download,
		external = false,
		ariaLabel,
		children
	}: Props = $props();
</script>

<!--
	TraceButton — the site's CTA primitive.
	On hover/focus, a trace draws itself around the pill (same line-draw
	grammar as the schematics), finishing at a via-dot.
-->
{#snippet inner()}
	<svg class="tb-trace" aria-hidden="true">
		<rect x="1.5" y="1.5" pathLength="100" />
	</svg>
	<span class="tb-label">{@render children()}</span>
{/snippet}

{#if href}
	<a
		{href}
		{download}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		class="tb tb--{variant}"
		aria-label={ariaLabel}
		use:magnetic={{ strength: 0.25, duration: 0.5 }}
		data-cursor-hover
	>
		{@render inner()}
	</a>
{:else}
	<button
		type="button"
		{onclick}
		class="tb tb--{variant}"
		aria-label={ariaLabel}
		use:magnetic={{ strength: 0.25, duration: 0.5 }}
		data-cursor-hover
	>
		{@render inner()}
	</button>
{/if}

<style>
	.tb {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.8rem 1.6rem;
		border-radius: var(--radius-full);
		border: none;
		font-family: var(--font-data);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		cursor: pointer;
		transition:
			background var(--duration-normal) var(--ease-smooth),
			color var(--duration-normal) var(--ease-smooth),
			transform var(--duration-normal) var(--ease-smooth);
	}

	.tb--solid {
		background: var(--color-ink);
		color: var(--color-base);
	}

	.tb--outline {
		background: transparent;
		color: var(--color-ink);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-ink) 30%, transparent);
	}

	.tb--inverse {
		background: var(--color-base);
		color: var(--color-ink);
	}

	.tb-label {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
	}

	/* The trace: a pill outline that draws itself on hover/focus */
	.tb-trace {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.tb-trace rect {
		width: calc(100% - 3px);
		height: calc(100% - 3px);
		rx: 999px;
		fill: none;
		stroke: var(--color-accent);
		stroke-width: 1.5;
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		transition: stroke-dashoffset 0.55s var(--ease-smooth);
	}

	.tb--inverse .tb-trace rect {
		stroke: var(--color-accent);
	}

	.tb:hover .tb-trace rect,
	.tb:focus-visible .tb-trace rect {
		stroke-dashoffset: 0;
	}

	.tb--solid:hover,
	.tb--solid:focus-visible {
		background: color-mix(in srgb, var(--color-ink) 88%, var(--color-accent));
	}

	.tb--outline:hover,
	.tb--outline:focus-visible {
		color: var(--color-accent);
	}

	.tb--inverse:hover,
	.tb--inverse:focus-visible {
		transform: translateY(-1px);
	}

	@media (prefers-reduced-motion: reduce) {
		.tb-trace rect {
			transition: none;
		}
		.tb:hover .tb-trace rect {
			stroke-dashoffset: 0;
		}
	}
</style>
