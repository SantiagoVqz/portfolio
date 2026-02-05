<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Project } from '$lib/constants/profile';

	interface Props {
		project: Project | null;
		open: boolean;
		onClose: () => void;
	}

	let { project, open, onClose }: Props = $props();

	let dialogRef = $state<HTMLDialogElement>();
	let contentRef = $state<HTMLDivElement>();

	// Open/close dialog reactively
	$effect(() => {
		if (!dialogRef) return;
		if (open && project) {
			dialogRef.showModal();
			document.body.style.overflow = 'hidden';
			// Animate in with GSAP
			animateIn();
		} else {
			document.body.style.overflow = '';
			dialogRef.close();
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogRef) {
			onClose();
		}
	}

	async function animateIn() {
		if (!browser || !contentRef) return;
		const { gsap } = await import('gsap');
		gsap.fromTo(
			contentRef,
			{ y: 60, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
		);
	}
</script>

<dialog
	bind:this={dialogRef}
	class="modal-dialog"
	onkeydown={handleKeydown}
	onclick={handleBackdropClick}
	aria-modal="true"
	aria-label="{project?.title ?? 'Case Study'} case study"
>
	{#if project}
		<div class="modal-content" bind:this={contentRef} role="document">
			<!-- Close button -->
			<button
				class="close-button"
				onclick={onClose}
				aria-label="Close case study"
				data-cursor-hover
			>
				<span>✕</span>
			</button>

			<!-- Modal header -->
			<header class="modal-header">
				<span class="modal-subtitle">{project.subtitle} · {project.year}</span>
				<h2 class="modal-title">{project.title}</h2>
				<div class="modal-tags">
					{#each project.tags as tag (tag)}
						<span class="modal-tag">{tag}</span>
					{/each}
				</div>
			</header>

			<!-- Metrics summary -->
			{#if project.metrics}
				<div class="modal-metrics">
					{#each project.metrics as metric (metric.label)}
						<div class="metric-card">
							<span class="metric-value">{metric.value}</span>
							<span class="metric-label">{metric.label}</span>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Case study sections -->
			<div class="case-study-body">
				<section class="case-section">
					<div class="section-label">
						<span class="label-number">01</span>
						<span>The Problem</span>
					</div>
					<p>{project.caseStudy.problem}</p>
				</section>

				<section class="case-section">
					<div class="section-label">
						<span class="label-number">02</span>
						<span>The Approach</span>
					</div>
					<p>{project.caseStudy.approach}</p>
				</section>

				<section class="case-section">
					<div class="section-label">
						<span class="label-number">03</span>
						<span>The Solution</span>
					</div>
					<p>{project.caseStudy.solution}</p>
				</section>

				<section class="case-section">
					<div class="section-label">
						<span class="label-number">04</span>
						<span>The Outcome</span>
					</div>
					<p>{project.caseStudy.outcome}</p>
				</section>
			</div>

			<!-- Project link -->
			{#if project.href}
				<a
					href={project.href}
					target="_blank"
					rel="noopener noreferrer"
					class="modal-link"
					data-cursor-hover
				>
					<span>View Project</span>
					<span>↗</span>
				</a>
			{/if}
		</div>
	{/if}
</dialog>

<style>
	.modal-dialog {
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
		z-index: 1000;
		overflow-y: auto;
	}

	.modal-dialog::backdrop {
		background: rgba(54, 50, 47, 0.6);
		backdrop-filter: blur(8px);
	}

	.modal-content {
		min-height: 100vh;
		background: var(--color-base);
		padding: 3rem 2rem;
		max-width: 800px;
		margin: 0 auto;
		position: relative;
	}

	@media (min-width: 768px) {
		.modal-content {
			padding: 4rem 3rem;
		}
	}

	.close-button {
		position: fixed;
		top: 1.5rem;
		right: 1.5rem;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 15%, transparent);
		border-radius: var(--radius-full);
		color: var(--color-ink);
		font-size: 1rem;
		cursor: none;
		z-index: 10;
		transition: all var(--duration-normal) var(--ease-smooth);
		box-shadow: var(--shadow-diffused);
	}

	.close-button:hover {
		background: var(--color-ink);
		color: var(--color-base);
		border-color: var(--color-ink);
	}

	.modal-header {
		margin-bottom: 2.5rem;
		padding-top: 1rem;
	}

	.modal-subtitle {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-accent);
		display: block;
		margin-bottom: 0.75rem;
	}

	.modal-title {
		font-family: var(--font-headline);
		font-size: 2.5rem;
		font-weight: 500;
		color: var(--color-ink);
		letter-spacing: var(--tracking-tight);
		margin: 0 0 1rem;
	}

	@media (min-width: 768px) {
		.modal-title {
			font-size: 3.5rem;
		}
	}

	.modal-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.modal-tag {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 0.375rem 0.75rem;
		background: color-mix(in srgb, var(--color-tension) 12%, var(--color-surface));
		color: var(--color-tension);
		border-radius: var(--radius-full);
	}

	.modal-metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1rem;
		margin-bottom: 3rem;
		padding: 1.5rem;
		background: var(--color-surface);
		border-radius: var(--radius-lg);
	}

	.metric-card {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.metric-value {
		font-family: var(--font-headline);
		font-size: 1.5rem;
		font-weight: 600;
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

	.case-study-body {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		margin-bottom: 3rem;
	}

	.case-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.section-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-data);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
	}

	.label-number {
		color: var(--color-accent);
		font-weight: 600;
	}

	.case-section p {
		font-family: var(--font-data);
		font-size: 0.9375rem;
		line-height: 1.8;
		color: var(--color-ink);
		opacity: 0.8;
		margin: 0;
	}

	.modal-link {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-data);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-base);
		background: var(--color-ink);
		padding: 0.875rem 1.5rem;
		border-radius: var(--radius-full);
		text-decoration: none;
		transition: background var(--duration-normal) ease;
	}

	.modal-link:hover {
		background: var(--color-accent);
	}
</style>
