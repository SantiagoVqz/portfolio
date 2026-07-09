<script lang="ts">
	import type { Project } from '$lib/constants/profile';
	import { magnetic } from '$lib/actions/magnetic';
	import ProjectIllustration from './ProjectIllustration.svelte';

	interface Props {
		project: Project;
		index: number;
		onViewCaseStudy: () => void;
	}

	let { project, index, onViewCaseStudy }: Props = $props();
</script>

<article class="compact-card" style="--accent: {project.color}">
	<!-- Illustration — sketch spot art; screenshots live inside the case study -->
	<div class="card-image">
		<ProjectIllustration id={project.id} title={project.title} />
		<div class="image-year">
			<span>{project.year}</span>
		</div>
	</div>

	<!-- Content -->
	<div class="card-content">
		<div class="card-header">
			<span class="card-eyebrow">{project.subtitle}</span>
			<h3 class="card-title">{project.title}</h3>
		</div>

		<p class="card-description">{project.description}</p>

		<!-- Metrics -->
		{#if project.metrics && project.metrics.length > 0}
			<div class="card-metrics">
				{#each project.metrics as metric (metric.label)}
					<div class="card-metric">
						<span class="metric-value">{metric.value}</span>
						<span class="metric-label">{metric.label}</span>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Tags -->
		<div class="card-tags">
			{#each project.tags as tag (tag)}
				<span class="card-tag">{tag}</span>
			{/each}
		</div>

		<!-- CTA -->
		<button
			class="card-cta"
			onclick={onViewCaseStudy}
			use:magnetic={{ strength: 0.2, duration: 0.4 }}
			data-cursor-hover
		>
			<span>View Case Study</span>
			<span class="cta-arrow">→</span>
		</button>
	</div>
</article>

<style>
	.compact-card {
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-xl);
		overflow: hidden;
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 6%, transparent);
		transition:
			box-shadow var(--duration-slow) var(--ease-smooth),
			transform var(--duration-slow) var(--ease-smooth);
		height: 100%;
	}

	.compact-card:hover {
		box-shadow:
			0 16px 48px -12px rgba(54, 50, 47, 0.12),
			0 0 0 1px color-mix(in srgb, var(--color-ink) 8%, transparent);
		transform: translateY(-2px);
	}

	/* ── Image ── */
	.card-image {
		position: relative;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background: var(--color-surface);
		flex-shrink: 0;
	}

	/* Illustration fills the zone; a gentle lift on card hover */
	.card-image :global(svg) {
		transition: transform var(--duration-slower) var(--ease-smooth);
	}

	.compact-card:hover .card-image :global(svg) {
		transform: translateY(-3px);
	}

	@media (prefers-reduced-motion: reduce) {
		.card-image :global(svg),
		.compact-card:hover .card-image :global(svg) {
			transition: none;
			transform: none;
		}
	}

	.image-year {
		position: absolute;
		top: 0.875rem;
		left: 0.875rem;
	}

	.image-year span {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		background: color-mix(in srgb, var(--color-base) 88%, transparent);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		padding: 0.325rem 0.7rem;
		border-radius: var(--radius-full);
		color: var(--color-ink);
	}

	/* ── Content ── */
	.card-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		flex: 1;
	}

	@media (min-width: 1024px) {
		.card-content {
			padding: 1.75rem;
			gap: 1.125rem;
		}
	}

	.card-header {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.card-eyebrow {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	.card-title {
		font-family: var(--font-headline);
		font-size: 1.75rem;
		font-weight: 480;
		color: var(--color-ink);
		letter-spacing: -0.02em;
		line-height: 1.1;
		margin: 0;
	}

	@media (min-width: 1024px) {
		.card-title {
			font-size: 2rem;
		}
	}

	.card-description {
		font-family: var(--font-data);
		font-size: 0.8125rem;
		line-height: 1.75;
		color: var(--color-ink);
		opacity: 0.65;
		margin: 0;
	}

	/* ── Metrics ── */
	.card-metrics {
		display: flex;
		gap: 1rem;
		padding: 1rem 0;
		border-top: 1px solid color-mix(in srgb, var(--color-ink) 7%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 7%, transparent);
	}

	.card-metric {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		flex: 1;
		min-width: 0;
	}

	.metric-value {
		font-family: var(--font-headline);
		font-size: 1.125rem;
		font-weight: 550;
		color: var(--color-accent);
		line-height: 1.1;
	}

	.metric-label {
		font-family: var(--font-data);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-ink);
		opacity: 0.45;
	}

	/* ── Tags ── */
	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.card-tag {
		font-family: var(--font-data);
		font-size: 9px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 0.275rem 0.625rem;
		background: color-mix(in srgb, var(--color-tension) 10%, var(--color-surface));
		color: var(--color-tension);
		border-radius: var(--radius-full);
	}

	/* ── CTA ── */
	.card-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		font-family: var(--font-data);
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		background: transparent;
		border: 1px solid color-mix(in srgb, var(--color-ink) 18%, transparent);
		padding: 0.75rem 1.25rem;
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: all var(--duration-normal) var(--ease-smooth);
		width: fit-content;
		margin-top: auto;
	}

	.card-cta:hover {
		background: var(--color-ink);
		color: var(--color-base);
		border-color: var(--color-ink);
	}

	.cta-arrow {
		transition: transform var(--duration-normal) ease;
	}

	.card-cta:hover .cta-arrow {
		transform: translateX(4px);
	}
</style>
