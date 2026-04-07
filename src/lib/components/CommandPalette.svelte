<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { personalInfo } from '$lib/constants/profile';

	interface Action {
		id: string;
		label: string;
		category: string;
		icon: string;
		action: () => void;
	}

	let open = $state(false);
	let query = $state('');
	let selectedIndex = $state(0);
	let inputRef = $state<HTMLInputElement>();
	let dialogRef = $state<HTMLDialogElement>();
	let isTouchDevice = $state(false);

	const actions: Action[] = [
		{ id: 'hero', label: 'Go to Hero', category: 'Navigate', icon: '◎', action: () => navigate('#hero') },
		{ id: 'artifacts', label: 'Go to Work', category: 'Navigate', icon: '◈', action: () => navigate('#artifacts') },
		{ id: 'process', label: 'Go to Tech Stack', category: 'Navigate', icon: '⚙', action: () => navigate('#process') },
		{ id: 'archive', label: 'Go to Journey', category: 'Navigate', icon: '✧', action: () => navigate('#archive') },
		{ id: 'contact', label: 'Go to Contact', category: 'Navigate', icon: '◆', action: () => navigate('#contact') },
		{ id: 'email', label: 'Copy Email Address', category: 'Actions', icon: '✉', action: () => copyEmail() },
		{ id: 'resume', label: 'Download Resume', category: 'Actions', icon: '↓', action: () => downloadResume() },
		{ id: 'github', label: 'Open GitHub', category: 'External', icon: '⌘', action: () => openExternal(personalInfo.social.github) },
		{ id: 'linkedin', label: 'Open LinkedIn', category: 'External', icon: '◎', action: () => openExternal(personalInfo.social.linkedin) },
	];

	// Fuzzy filter
	const filteredActions = $derived.by(() => {
		if (!query.trim()) return actions;
		const q = query.toLowerCase();
		return actions.filter(
			a => a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
		);
	});

	// Reset selection when filter changes
	$effect(() => {
		filteredActions; // subscribe
		selectedIndex = 0;
	});

	function navigate(href: string) {
		close();
		const el = document.querySelector(href);
		el?.scrollIntoView({ behavior: 'smooth' });
	}

	function copyEmail() {
		navigator.clipboard.writeText(personalInfo.email);
		close();
	}

	function downloadResume() {
		const link = document.createElement('a');
		link.href = '/resume.pdf';
		link.download = 'Santiago_Vazquez_Resume.pdf';
		link.click();
		close();
	}

	function openExternal(url: string) {
		window.open(url, '_blank', 'noopener,noreferrer');
		close();
	}

	function toggle() {
		if (open) close();
		else openPalette();
	}

	function openPalette() {
		open = true;
		query = '';
		selectedIndex = 0;
		dialogRef?.showModal();
		setTimeout(() => inputRef?.focus(), 50);
	}

	function close() {
		open = false;
		dialogRef?.close();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!open) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, filteredActions.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			filteredActions[selectedIndex]?.action();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			close();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogRef) close();
	}

	onMount(() => {
		if (!browser) return;

		isTouchDevice =
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0 ||
			window.matchMedia('(hover: none) and (pointer: coarse)').matches;

		const handleGlobalKeydown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				toggle();
			}
		};

		window.addEventListener('keydown', handleGlobalKeydown);
		return () => window.removeEventListener('keydown', handleGlobalKeydown);
	});
</script>

{#if !isTouchDevice}
	<dialog
		bind:this={dialogRef}
		class="palette-dialog"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		aria-modal="true"
		aria-label="Command palette"
	>
		{#if open}
			<div class="palette-content" role="document">
				<!-- Search input -->
				<div class="palette-search">
					<span class="search-icon">⌘</span>
					<input
						bind:this={inputRef}
						bind:value={query}
						type="text"
						placeholder="Type a command..."
						class="search-input"
						aria-label="Search commands"
						autocomplete="off"
					/>
					<kbd class="search-kbd">ESC</kbd>
				</div>

				<!-- Results -->
				<div class="palette-results" role="listbox">
					{#each filteredActions as action, i (action.id)}
						{@const isSelected = i === selectedIndex}
						<button
							class="palette-item"
							class:selected={isSelected}
							onclick={() => action.action()}
							onmouseenter={() => selectedIndex = i}
							role="option"
							aria-selected={isSelected}
						>
							<span class="item-icon">{action.icon}</span>
							<span class="item-label">{action.label}</span>
							<span class="item-category">{action.category}</span>
						</button>
					{/each}

					{#if filteredActions.length === 0}
						<div class="no-results">
							<span>No results for "{query}"</span>
						</div>
					{/if}
				</div>

				<!-- Footer hint -->
				<div class="palette-footer">
					<span><kbd>↑↓</kbd> Navigate</span>
					<span><kbd>↵</kbd> Select</span>
					<span><kbd>Esc</kbd> Close</span>
				</div>
			</div>
		{/if}
	</dialog>
{/if}

<style>
	.palette-dialog {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		z-index: 2000;
		display: none;
		visibility: hidden;
		pointer-events: none;
		align-items: flex-start;
		justify-content: center;
		padding-top: 20vh;
	}

	.palette-dialog[open] {
		display: flex;
		visibility: visible;
		pointer-events: auto;
	}

	.palette-dialog::backdrop {
		background: rgba(54, 50, 47, 0.4);
		backdrop-filter: blur(4px);
	}

	.palette-content {
		width: min(560px, 90vw);
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 12%, transparent);
		border-radius: var(--radius-xl);
		box-shadow: 0 24px 48px -12px rgba(54, 50, 47, 0.15);
		overflow: hidden;
		animation: paletteIn 0.2s ease forwards;
	}

	@keyframes paletteIn {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.palette-search {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
	}

	.search-icon {
		font-size: 1rem;
		color: var(--color-ink);
		opacity: 0.4;
	}

	.search-input {
		flex: 1;
		font-family: var(--font-data);
		font-size: 0.9375rem;
		color: var(--color-ink);
		background: transparent;
		border: none;
		outline: none;
	}

	.search-input::placeholder {
		color: var(--color-ink);
		opacity: 0.3;
	}

	.search-kbd {
		font-family: var(--font-data);
		font-size: 10px;
		color: var(--color-ink);
		opacity: 0.3;
		padding: 0.2rem 0.5rem;
		background: var(--color-surface);
		border-radius: 4px;
		border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
	}

	.palette-results {
		max-height: 320px;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.palette-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		cursor: none;
		transition: background var(--duration-fast) ease;
		text-align: left;
		font-family: inherit;
		font-size: inherit;
		color: inherit;
	}

	.palette-item:hover,
	.palette-item.selected {
		background: var(--color-surface);
	}

	.item-icon {
		font-size: 1rem;
		width: 1.5rem;
		text-align: center;
		color: var(--color-accent);
	}

	.item-label {
		flex: 1;
		font-family: var(--font-data);
		font-size: 0.875rem;
		color: var(--color-ink);
	}

	.item-category {
		font-family: var(--font-data);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		opacity: 0.3;
	}

	.no-results {
		padding: 2rem;
		text-align: center;
		font-family: var(--font-data);
		font-size: 0.875rem;
		color: var(--color-ink);
		opacity: 0.4;
	}

	.palette-footer {
		display: flex;
		gap: 1.5rem;
		padding: 0.75rem 1.25rem;
		border-top: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
		font-family: var(--font-data);
		font-size: 10px;
		color: var(--color-ink);
		opacity: 0.3;
	}

	.palette-footer kbd {
		font-family: var(--font-data);
		font-size: 10px;
		padding: 0.125rem 0.375rem;
		background: var(--color-surface);
		border-radius: 3px;
		border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
		margin-right: 0.25rem;
	}
</style>
