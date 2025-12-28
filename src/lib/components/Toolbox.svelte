<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import type { Skill } from '$lib/constants/profile';

	interface Props {
		skills: Skill[];
	}

	let { skills }: Props = $props();

	// Drawer state
	let activeDrawer = $state<number | null>(null);
	let toolboxRef = $state<HTMLElement>();
	let hasInteracted = $state(false);

	// Group skills by category
	const groupedSkills = $derived.by(() => {
		const groups: Record<string, Skill[]> = {};
		skills.forEach((skill) => {
			if (!groups[skill.category]) {
				groups[skill.category] = [];
			}
			groups[skill.category].push(skill);
		});
		return groups;
	});

	const drawerCategories = $derived(Object.keys(groupedSkills));

	// Tool icons mapping
	const categoryIcons: Record<string, string> = {
		Framework: '⚡',
		Language: '✎',
		Cloud: '☁',
		Backend: '⚙',
		Mobile: '📱',
		Testing: '✓',
		Motion: '◐',
		DevOps: '⛭',
		Database: '◉'
	};

	// Category colors for drawer accents
	const categoryColors: Record<string, string> = {
		Framework: '#cc8b65',
		Language: '#7d9c8b',
		Cloud: '#8b9cc7',
		Backend: '#c78b8b',
		Mobile: '#8bc7a8',
		Testing: '#c7b88b',
		Motion: '#b88bc7',
		DevOps: '#8bc7c7',
		Database: '#c7a88b'
	};

	function toggleDrawer(index: number) {
		hasInteracted = true;
		if (activeDrawer === index) {
			activeDrawer = null;
		} else {
			activeDrawer = index;
		}
	}

	onMount(() => {
		if (!toolboxRef) return;

		// Initial animation - drawers slide in staggered
		const drawers = toolboxRef.querySelectorAll('.drawer');
		gsap.fromTo(
			drawers,
			{
				x: -20,
				opacity: 0
			},
			{
				x: 0,
				opacity: 1,
				stagger: 0.1,
				duration: 0.6,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: toolboxRef,
					start: 'top 80%'
				}
			}
		);
	});
</script>

<div class="toolbox-container" bind:this={toolboxRef}>
	<!-- Toolbox frame -->
	<div class="toolbox">
		<!-- Top handle -->
		<div class="toolbox-handle">
			<div class="handle-bar"></div>
			<span class="handle-label">TOOLBOX</span>
			<div class="handle-bar"></div>
		</div>

		<!-- Instruction hint -->
		{#if !hasInteracted}
			<div class="hint-pulse">
				<span>Click a drawer to explore</span>
				<span class="arrow">↓</span>
			</div>
		{/if}

		<!-- Drawers -->
		<div class="drawers">
			{#each drawerCategories as category, i (category)}
				{@const categorySkills = groupedSkills[category]}
				{@const isActive = activeDrawer === i}

				<button
					class="drawer"
					class:active={isActive}
					onclick={() => toggleDrawer(i)}
					style="--drawer-color: {categoryColors[category] || '#cc8b65'}; --drawer-index: {i}"
				>
					<!-- Drawer face -->
					<div class="drawer-face">
						<span class="drawer-icon">{categoryIcons[category] || '◈'}</span>
						<span class="drawer-label">{category}</span>
						<span class="drawer-count">{categorySkills.length}</span>
					</div>

					<!-- Drawer contents (slides out) -->
					<div class="drawer-contents" class:open={isActive}>
						<div class="contents-inner">
							{#each categorySkills as skill (skill.name)}
								<div class="tool-item" class:large={skill.size === 'large'}>
									<span class="tool-name">{skill.name}</span>
									{#if skill.size === 'large'}
										<span class="tool-badge">Primary</span>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</button>
			{/each}
		</div>

		<!-- Bottom detail -->
		<div class="toolbox-base">
			<div class="base-texture"></div>
		</div>
	</div>
</div>

<style>
	.toolbox-container {
		display: flex;
		justify-content: center;
		padding: 2rem;
	}

	.toolbox {
		position: relative;
		width: 100%;
		max-width: 500px;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-surface) 100%, transparent) 0%,
			color-mix(in srgb, var(--color-surface) 95%, var(--color-ink) 5%) 100%
		);
		border-radius: 16px;
		padding: 0;
		box-shadow:
			0 20px 60px -15px rgba(54, 50, 47, 0.15),
			0 0 0 1px rgba(54, 50, 47, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		overflow: visible;
	}

	/* Handle */
	.toolbox-handle {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-ink) 8%, transparent) 0%,
			color-mix(in srgb, var(--color-ink) 4%, transparent) 100%
		);
		border-radius: 16px 16px 0 0;
		border-bottom: 1px solid rgba(54, 50, 47, 0.08);
	}

	.handle-bar {
		flex: 1;
		height: 3px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			color-mix(in srgb, var(--color-accent) 40%, transparent) 50%,
			transparent 100%
		);
		border-radius: 2px;
	}

	.handle-label {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.2em;
		color: var(--color-ink);
		opacity: 0.4;
	}

	/* Hint */
	.hint-pulse {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		font-family: var(--font-data);
		font-size: 11px;
		color: var(--color-accent);
		opacity: 0.8;
		animation: pulse 2s ease-in-out infinite;
	}

	.hint-pulse .arrow {
		animation: bounce 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(3px);
		}
	}

	/* Drawers container */
	.drawers {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 0.5rem;
	}

	/* Individual drawer */
	.drawer {
		position: relative;
		width: 100%;
		background: none;
		border: none;
		padding: 0;
		text-align: left;
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.drawer:hover {
		transform: translateX(4px);
	}

	.drawer.active {
		transform: translateX(0);
	}

	/* Drawer face */
	.drawer-face {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.25rem;
		background: var(--color-base);
		border-radius: 8px;
		border-left: 3px solid var(--drawer-color);
		box-shadow:
			0 2px 8px -2px rgba(54, 50, 47, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		transition: all 0.3s ease;
	}

	.drawer:hover .drawer-face {
		box-shadow:
			0 4px 12px -2px rgba(54, 50, 47, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.drawer.active .drawer-face {
		border-left-width: 4px;
		background: color-mix(in srgb, var(--drawer-color) 5%, var(--color-base));
	}

	.drawer-icon {
		font-size: 1.25rem;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--drawer-color) 15%, transparent);
		border-radius: 6px;
	}

	.drawer-label {
		flex: 1;
		font-family: var(--font-headline);
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-ink);
		letter-spacing: -0.01em;
	}

	.drawer-count {
		font-family: var(--font-data);
		font-size: 11px;
		color: var(--color-ink);
		opacity: 0.4;
		padding: 0.25rem 0.5rem;
		background: color-mix(in srgb, var(--color-ink) 5%, transparent);
		border-radius: 4px;
	}

	/* Drawer contents */
	.drawer-contents {
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.drawer-contents.open {
		max-height: 300px;
	}

	.contents-inner {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 1rem 1rem 0.5rem 3.5rem;
	}

	.tool-item {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.875rem;
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
		border-radius: 20px;
		font-family: var(--font-data);
		font-size: 12px;
		color: var(--color-ink);
		transition: all 0.2s ease;
	}

	.tool-item:hover {
		background: color-mix(in srgb, var(--drawer-color) 10%, var(--color-base));
		border-color: var(--drawer-color);
	}

	.tool-item.large {
		background: color-mix(in srgb, var(--drawer-color) 8%, var(--color-base));
		border-color: color-mix(in srgb, var(--drawer-color) 30%, transparent);
	}

	.tool-badge {
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.125rem 0.375rem;
		background: var(--drawer-color);
		color: var(--color-base);
		border-radius: 3px;
	}

	/* Base */
	.toolbox-base {
		height: 12px;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-ink) 4%, transparent) 0%,
			color-mix(in srgb, var(--color-ink) 8%, transparent) 100%
		);
		border-radius: 0 0 16px 16px;
		overflow: hidden;
	}

	.base-texture {
		width: 100%;
		height: 100%;
		background-image: var(--glass-grain);
		background-repeat: repeat;
		opacity: 0.5;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.toolbox-container {
			padding: 1rem;
		}

		.drawer-face {
			padding: 0.875rem 1rem;
		}

		.contents-inner {
			padding-left: 2.5rem;
		}
	}
</style>
