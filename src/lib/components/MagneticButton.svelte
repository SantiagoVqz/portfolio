<script lang="ts">
	import { magnetic } from '$lib/actions/magnetic';
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		strength?: number;
		class?: string;
		children: Snippet;
		onclick?: () => void;
	}

	let {
		href,
		variant = 'primary',
		size = 'md',
		strength = 0.4,
		class: className = '',
		children,
		onclick
	}: Props = $props();

	const baseClasses = `
		inline-flex items-center justify-center gap-3
		font-mono uppercase tracking-widest
		rounded-full transition-all duration-300
		will-change-transform
	`;

	const variantClasses = {
		primary: `
			bg-[--color-ink] text-[--color-base]
			hover:bg-[--color-accent]
		`,
		secondary: `
			border border-[--color-ink] text-[--color-ink]
			hover:bg-[--color-ink] hover:text-[--color-base]
		`,
		ghost: `
			text-[--color-ink] hover:text-[--color-accent]
		`
	};

	const sizeClasses = {
		sm: 'px-4 py-2 text-[10px]',
		md: 'px-6 py-3 text-xs',
		lg: 'px-8 py-4 text-xs'
	};

	const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
</script>

{#if href}
	<a
		{href}
		class={classes}
		use:magnetic={{ strength, duration: 0.5 }}
		data-cursor-hover
	>
		{@render children()}
	</a>
{:else}
	<button
		type="button"
		class={classes}
		use:magnetic={{ strength, duration: 0.5 }}
		data-cursor-hover
		{onclick}
	>
		{@render children()}
	</button>
{/if}

