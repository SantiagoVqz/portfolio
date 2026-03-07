<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Skill } from '$lib/constants/profile';

	interface Props {
		skills: Skill[];
	}

	let { skills }: Props = $props();

	let containerRef = $state<HTMLElement>();
	let hoveredSkill = $state<string | null>(null);

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

	const categories = $derived(Object.keys(groupedSkills));

	onMount(() => {
		if (!containerRef || !browser) return;

		let ctx: gsap.Context | null = null;

		const initGSAP = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			ctx = gsap.context(() => {
				gsap.fromTo(
					'.cabinet-compartment',
					{ opacity: 0, y: 30, scale: 0.95 },
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.6,
						stagger: 0.1,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: containerRef,
							start: 'top 80%'
						}
					}
				);
			}, containerRef);
		};

		initGSAP();

		return () => ctx?.revert();
	});
</script>

<div class="cabinet-container" bind:this={containerRef}>
	<div class="cabinet-grid">
		{#each categories as category (category)}
			{@const categorySkills = groupedSkills[category]}
			<div class="cabinet-compartment">
				<!-- Glass effect top bar -->
				<div class="compartment-glass"></div>

				<!-- Category label -->
				<div class="compartment-label">
					<span class="label-text">{category}</span>
					<span class="label-count">{categorySkills.length}</span>
				</div>

				<!-- Skills as objects in compartment -->
				<div class="compartment-items">
					{#each categorySkills as skill (skill.name)}
						<button
							class="skill-object"
							class:large={skill.size === 'large'}
							class:medium={skill.size === 'medium'}
							class:hovered={hoveredSkill === skill.name}
							style="--skill-color: {skill.color}"
							onmouseenter={() => hoveredSkill = skill.name}
							onmouseleave={() => hoveredSkill = null}
							onfocus={() => hoveredSkill = skill.name}
							onblur={() => hoveredSkill = null}
							data-cursor-hover
							aria-label="{skill.name} — {skill.size === 'large' ? 'Expert' : skill.size === 'medium' ? 'Proficient' : 'Familiar'}"
						>
							<span class="skill-icon">{skill.icon}</span>
							<span class="skill-name">{skill.name}</span>
							{#if hoveredSkill === skill.name}
								<span class="skill-tooltip">
									{skill.size === 'large' ? 'Expert' : skill.size === 'medium' ? 'Proficient' : 'Familiar'}
								</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.cabinet-container {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		padding: 1rem;
	}

	.cabinet-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1rem;
	}

	.cabinet-compartment {
		position: relative;
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
		border-radius: var(--radius-lg);
		padding: 1.25rem;
		overflow: hidden;
		transition: all var(--duration-normal) var(--ease-smooth);
	}

	.cabinet-compartment:hover {
		border-color: color-mix(in srgb, var(--color-ink) 15%, transparent);
		box-shadow: var(--shadow-diffused);
	}

	/* Glass effect overlay */
	.compartment-glass {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(253, 252, 248, 0.4) 0%,
			transparent 50%,
			rgba(253, 252, 248, 0.1) 100%
		);
		pointer-events: none;
		border-radius: inherit;
	}

	.compartment-label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
		position: relative;
		z-index: 1;
	}

	.label-text {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-ink);
		opacity: 0.5;
	}

	.label-count {
		font-family: var(--font-data);
		font-size: 9px;
		color: var(--color-ink);
		opacity: 0.3;
		padding: 0.125rem 0.5rem;
		background: color-mix(in srgb, var(--color-ink) 5%, transparent);
		border-radius: var(--radius-full);
	}

	.compartment-items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.625rem;
		position: relative;
		z-index: 1;
	}

	.skill-object {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.875rem;
		background: var(--color-surface);
		border: 1px solid color-mix(in srgb, var(--skill-color) 20%, transparent);
		border-radius: var(--radius-full);
		cursor: none;
		transition: all var(--duration-normal) var(--ease-smooth);
		font-family: inherit;
		font-size: inherit;
		color: inherit;
	}

	.skill-object:hover,
	.skill-object.hovered {
		transform: translateY(-2px) scale(1.05);
		background: color-mix(in srgb, var(--skill-color) 10%, var(--color-base));
		border-color: color-mix(in srgb, var(--skill-color) 50%, transparent);
		box-shadow: 0 4px 16px -4px color-mix(in srgb, var(--skill-color) 30%, transparent);
	}

	.skill-object.large {
		padding: 0.625rem 1rem;
		border-width: 2px;
		border-color: color-mix(in srgb, var(--skill-color) 35%, transparent);
		background: color-mix(in srgb, var(--skill-color) 8%, var(--color-base));
	}

	.skill-object.medium {
		border-color: color-mix(in srgb, var(--skill-color) 25%, transparent);
		background: color-mix(in srgb, var(--skill-color) 5%, var(--color-surface));
	}

	.skill-icon {
		font-size: 0.875rem;
		line-height: 1;
	}

	.skill-object.large .skill-icon {
		font-size: 1rem;
	}

	.skill-name {
		font-family: var(--font-data);
		font-size: 11px;
		font-weight: 500;
		color: var(--color-ink);
	}

	.skill-object.large .skill-name {
		font-size: 12px;
		font-weight: 600;
	}

	.skill-tooltip {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		font-family: var(--font-data);
		font-size: 9px;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-base);
		background: var(--color-ink);
		padding: 0.25rem 0.625rem;
		border-radius: var(--radius-sm);
		white-space: nowrap;
		pointer-events: none;
		animation: tooltipIn 0.2s ease forwards;
	}

	.skill-tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 4px solid transparent;
		border-top-color: var(--color-ink);
	}

	@keyframes tooltipIn {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	@media (max-width: 640px) {
		.cabinet-grid {
			grid-template-columns: 1fr;
		}

		.cabinet-container {
			padding: 0.5rem;
		}
	}
</style>
