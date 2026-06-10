<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Skill } from '$lib/constants/profile';

	interface Props {
		skills: Skill[];
	}

	let { skills }: Props = $props();

	let containerRef = $state<HTMLElement>();

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
				<!-- Category label -->
				<div class="compartment-label">
					<span class="label-text">{category}</span>
					<span class="label-count">{categorySkills.length}</span>
				</div>

				<!-- Skills as uniform tiles -->
				<div class="compartment-items">
					{#each categorySkills as skill (skill.name)}
						<span class="skill-object" style="--skill-color: {skill.color}">
							<span class="skill-icon">{skill.icon}</span>
							<span class="skill-name">{skill.name}</span>
						</span>
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
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.875rem;
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
		border-radius: var(--radius-full);
		transition: border-color var(--duration-normal) var(--ease-smooth);
	}

	.cabinet-compartment:hover .skill-object {
		border-color: color-mix(in srgb, var(--skill-color) 35%, transparent);
	}

	.skill-icon {
		font-size: 0.875rem;
		line-height: 1;
	}

	.skill-name {
		font-family: var(--font-data);
		font-size: 11px;
		font-weight: 500;
		color: var(--color-ink);
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
