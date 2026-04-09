<script lang="ts">
	import type { Project } from '$lib/constants/profile';
	import { magnetic } from '$lib/actions/magnetic';

	interface Props {
		project: Project;
		index: number;
		onViewCaseStudy: () => void;
	}

	let { project, index, onViewCaseStudy }: Props = $props();

	const pullQuote = $derived(
		project.description.split('.').find(s => s.trim().length > 30)?.trim() + '.' || project.description.slice(0, 80) + '...'
	);
</script>

<article class="editorial-layout" style="--accent: {project.color}">
	<div class="editorial-grid">
		<!-- Large hero image -->
		<div class="editorial-image">
			{#if project.image}
				<img
					src={project.image}
					alt="{project.title} screenshot"
					loading="lazy"
					class="image"
				/>
			{/if}
			<div class="image-overlay">
				<span class="project-year">{project.year}</span>
			</div>
		</div>

		<!-- Text content -->
		<div class="editorial-content">
			<div class="content-header">
				<span class="subtitle">{project.subtitle}</span>
				<h3 class="title">{project.title}</h3>
			</div>

			<!-- Pull quote -->
			<blockquote class="pull-quote">
				{pullQuote}
			</blockquote>

			<!-- Description in columns -->
			<div class="description-columns">
				<p>{project.description}</p>
			</div>

			<!-- Tags -->
			<div class="tags">
				{#each project.tags as tag (tag)}
					<span class="tag">{tag}</span>
				{/each}
			</div>

			<!-- Metrics -->
			{#if project.metrics}
				<div class="metrics">
					{#each project.metrics as metric (metric.label)}
						<div class="metric">
							<span class="metric-value">{metric.value}</span>
							<span class="metric-label">{metric.label}</span>
						</div>
					{/each}
				</div>
			{/if}

			<!-- CTA -->
			<button
				class="cta-button"
				onclick={onViewCaseStudy}
				use:magnetic={{ strength: 0.2, duration: 0.4 }}
				data-cursor-hover
			>
				<span>View Case Study</span>
				<span class="cta-arrow">→</span>
			</button>
		</div>
	</div>
</article>

<style>
	.editorial-layout {
		padding: 2rem 0;
	}

	.editorial-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	@media (min-width: 768px) {
		.editorial-grid {
			grid-template-columns: 1.2fr 1fr;
			gap: 3rem;
			align-items: start;
		}
	}

	.editorial-image {
		position: relative;
		border-radius: var(--radius-xl);
		overflow: hidden;
		aspect-ratio: 16 / 10;
		background: var(--color-surface);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--duration-slow) var(--ease-smooth);
	}

	.editorial-layout:hover .image {
		transform: scale(1.03);
	}

	.image-overlay {
		position: absolute;
		top: 1rem;
		left: 1rem;
	}

	.project-year {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		background: color-mix(in srgb, var(--color-base) 90%, transparent);
		backdrop-filter: blur(8px);
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius-full);
		color: var(--color-ink);
	}

	.editorial-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.subtitle {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	.title {
		font-family: var(--font-headline);
		font-size: 2.5rem;
		font-weight: 500;
		color: var(--color-ink);
		letter-spacing: var(--tracking-tight);
		margin: 0.5rem 0 0;
	}

	@media (min-width: 1024px) {
		.title {
			font-size: 3rem;
		}
	}

	.pull-quote {
		font-family: var(--font-headline);
		font-size: 1.125rem;
		font-style: italic;
		font-weight: 300;
		color: var(--color-ink);
		opacity: 0.7;
		border-left: 3px solid var(--color-accent);
		padding-left: 1rem;
		margin: 0;
		line-height: 1.6;
	}

	.description-columns {
		font-family: var(--font-data);
		font-size: 0.875rem;
		line-height: 1.7;
		color: var(--color-ink);
		opacity: 0.7;
	}

	@media (min-width: 1024px) {
		.description-columns {
			columns: 2;
			column-gap: 2rem;
		}
	}

	.description-columns p {
		margin: 0;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 0.375rem 0.75rem;
		background: color-mix(in srgb, var(--color-tension) 12%, var(--color-surface));
		color: var(--color-tension);
		border-radius: var(--radius-full);
	}

	.metrics {
		display: flex;
		gap: 2rem;
		padding: 1.25rem 0;
		border-top: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
	}

	.metric {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.metric-value {
		font-family: var(--font-headline);
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-accent);
	}

	.metric-label {
		font-family: var(--font-data);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		opacity: 0.5;
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-data);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		background: transparent;
		border: 1px solid color-mix(in srgb, var(--color-ink) 20%, transparent);
		padding: 0.875rem 1.5rem;
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: all var(--duration-normal) var(--ease-smooth);
		width: fit-content;
	}

	.cta-button:hover {
		background: var(--color-ink);
		color: var(--color-base);
		border-color: var(--color-ink);
	}

	.cta-arrow {
		transition: transform var(--duration-normal) ease;
	}

	.cta-button:hover .cta-arrow {
		transform: translateX(4px);
	}
</style>
