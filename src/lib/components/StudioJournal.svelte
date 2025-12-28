<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import type { TimelineItem, Education, Philosophy } from '$lib/constants/profile';
	import { revealWithExit } from '$lib/actions/reveal';

	interface Props {
		timeline: TimelineItem[];
		education: Education[];
		philosophies: Philosophy[];
		bio: string[];
	}

	let { timeline, education, philosophies, bio }: Props = $props();

	let journalRef = $state<HTMLElement>();
	let activeEntry = $state<number | null>(null);

	// Combine timeline into journal entries with more narrative feel
	const journalEntries = $derived.by(() => {
		return timeline.map((item, index) => ({
			...item,
			entryNumber: String(index + 1).padStart(3, '0'),
			mood: getMood(item.type),
			timestamp: getTimestamp()
		}));
	});

	function getMood(type: string): string {
		switch (type) {
			case 'work':
				return '◆ Professional';
			case 'education':
				return '◇ Academic';
			case 'milestone':
				return '★ Milestone';
			default:
				return '○ Note';
		}
	}

	function getTimestamp(): string {
		// Add a random time for aesthetic
		const hours = ['09:14', '14:32', '16:45', '11:08', '20:15'];
		return hours[Math.floor(Math.random() * hours.length)];
	}

	onMount(() => {
		if (!journalRef) return;
		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			// Animate entries on scroll
			const entries = journalRef!.querySelectorAll('.journal-entry');
			entries.forEach((entry, i) => {
				gsap.fromTo(
					entry,
					{
						opacity: 0,
						y: 30,
						filter: 'blur(4px)'
					},
					{
						opacity: 1,
						y: 0,
						filter: 'blur(0px)',
						duration: 0.8,
						delay: i * 0.05,
						scrollTrigger: {
							trigger: entry,
							start: 'top 85%',
							toggleActions: 'play none none reverse'
						}
					}
				);
			});
		}, journalRef);

		return () => ctx.revert();
	});
</script>

<div class="journal-container" bind:this={journalRef}>
	<!-- Journal Cover/Header -->
	<div class="journal-header" use:revealWithExit={{ blur: 15, y: 30, duration: 1, persist: true }}>
		<div class="header-decoration">
			<div class="decoration-line"></div>
			<span class="decoration-symbol">✧</span>
			<div class="decoration-line"></div>
		</div>
		<h3 class="journal-title">Studio Logs</h3>
		<p class="journal-subtitle">A record of the journey so far</p>
	</div>

	<!-- Bio Section as intro -->
	<div class="journal-intro" use:revealWithExit={{ blur: 12, y: 25, duration: 0.9, persist: true }}>
		<div class="intro-label">
			<span class="label-icon">✎</span>
			<span>Author's Note</span>
		</div>
		<div class="intro-content">
			{#each bio as paragraph, idx (idx)}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>

	<!-- Journal Entries -->
	<div class="journal-entries">
		{#each journalEntries as entry, i (entry.year + entry.company)}
			<div
				class="journal-entry"
				class:expanded={activeEntry === i}
				role="button"
				tabindex="0"
				onclick={() => (activeEntry = activeEntry === i ? null : i)}
				onkeydown={(e) => e.key === 'Enter' && (activeEntry = activeEntry === i ? null : i)}
			>
				<!-- Entry header -->
				<div class="entry-header">
					<span class="entry-number">#{entry.entryNumber}</span>
					<span class="entry-date">{entry.year}</span>
					<span class="entry-time">{entry.timestamp}</span>
				</div>

				<!-- Entry content -->
				<div class="entry-body">
					<div class="entry-mood">{entry.mood}</div>
					<h4 class="entry-title">{entry.title}</h4>
					<div class="entry-company">{entry.company}</div>
					<p class="entry-description">{entry.description}</p>
				</div>

				<!-- Entry footer -->
				<div class="entry-footer">
					<div class="footer-dots">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Philosophy section as final entries -->
	<div class="journal-philosophy">
		<div
			class="philosophy-header"
			use:revealWithExit={{ blur: 10, y: 20, duration: 0.8, persist: true }}
		>
			<div class="header-decoration">
				<div class="decoration-line"></div>
				<span class="decoration-symbol">◈</span>
				<div class="decoration-line"></div>
			</div>
			<h4 class="philosophy-title">Guiding Principles</h4>
		</div>

		<div class="philosophy-entries">
			{#each philosophies as philosophy, i (philosophy.number)}
				<div
					class="philosophy-entry"
					use:revealWithExit={{ blur: 8, y: 20, duration: 0.7, persist: true }}
					style="--delay: {i * 0.1}s"
				>
					<span class="philosophy-number">{philosophy.number}</span>
					<div class="philosophy-content">
						<h5 class="philosophy-name">{philosophy.title}</h5>
						<p class="philosophy-desc">{philosophy.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Education as appendix -->
	<div class="journal-appendix">
		<div
			class="appendix-header"
			use:revealWithExit={{ blur: 10, y: 20, duration: 0.8, persist: true }}
		>
			<span class="appendix-label">Appendix: Education</span>
		</div>

		<div class="appendix-items">
			{#each education as edu, i (edu.institution)}
				<div
					class="appendix-item"
					use:revealWithExit={{ blur: 6, y: 15, duration: 0.6, persist: true }}
					style="--delay: {i * 0.1}s"
				>
					<div class="appendix-icon">🎓</div>
					<div class="appendix-content">
						<span class="appendix-institution">{edu.institution}</span>
						<span class="appendix-degree">{edu.degree}{edu.focus ? ` · ${edu.focus}` : ''}</span>
						<span class="appendix-meta"
							>{edu.location} · {edu.period}{edu.gpa ? ` · ${edu.gpa} GPA` : ''}</span
						>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Journal end mark -->
	<div class="journal-end">
		<span class="end-symbol">⁂</span>
	</div>
</div>

<style>
	.journal-container {
		width: 100%;
		margin: 0 auto;
		padding: 2rem 0;
	}

	/* Header */
	.journal-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.header-decoration {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.decoration-line {
		width: 60px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--color-ink), transparent);
		opacity: 0.2;
	}

	.decoration-symbol {
		color: var(--color-accent);
		font-size: 1rem;
	}

	.journal-title {
		font-family: var(--font-headline);
		font-size: 2rem;
		font-weight: 400;
		font-style: italic;
		color: var(--color-ink);
		margin: 0;
		letter-spacing: -0.02em;
	}

	.journal-subtitle {
		font-family: var(--font-data);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--color-ink);
		opacity: 0.4;
		margin-top: 0.5rem;
	}

	/* Intro */
	.journal-intro {
		background: var(--color-surface);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		margin-bottom: 3rem;
		border-left: 3px solid var(--color-accent);
	}

	.intro-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-data);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-accent);
		margin-bottom: 1rem;
	}

	.label-icon {
		font-size: 1rem;
	}

	.intro-content {
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--color-ink);
		opacity: 0.8;
	}

	.intro-content p {
		margin: 0 0 0.75rem;
	}

	.intro-content p:last-child {
		margin-bottom: 0;
	}

	/* Journal Entries */
	.journal-entries {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 3rem;
	}

	.journal-entry {
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		transition: all var(--duration-normal) var(--ease-smooth);
		cursor: none;
	}

	.journal-entry:hover {
		border-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
		box-shadow: var(--shadow-diffused);
	}

	.journal-entry.expanded {
		background: var(--color-surface);
		border-color: var(--color-accent);
	}

	.entry-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
		font-family: var(--font-data);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		opacity: 0.4;
	}

	.entry-number {
		color: var(--color-accent);
		opacity: 1;
	}

	.entry-date {
		font-weight: 500;
	}

	.entry-time {
		margin-left: auto;
	}

	.entry-body {
		padding-left: 0.5rem;
	}

	.entry-mood {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.05em;
		color: var(--color-tension);
		margin-bottom: 0.5rem;
	}

	.entry-title {
		font-family: var(--font-headline);
		font-size: 1.25rem;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0 0 0.25rem;
		letter-spacing: -0.01em;
	}

	.entry-company {
		font-family: var(--font-data);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		opacity: 0.5;
		margin-bottom: 0.75rem;
	}

	.entry-description {
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-ink);
		opacity: 0.7;
		margin: 0;
	}

	.entry-footer {
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px dashed color-mix(in srgb, var(--color-ink) 10%, transparent);
	}

	.footer-dots {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	.footer-dots span {
		width: 4px;
		height: 4px;
		background: var(--color-ink);
		opacity: 0.15;
		border-radius: 50%;
	}

	/* Philosophy */
	.journal-philosophy {
		margin-bottom: 3rem;
	}

	.philosophy-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.philosophy-title {
		font-family: var(--font-headline);
		font-size: 1.25rem;
		font-weight: 400;
		font-style: italic;
		color: var(--color-ink);
		margin: 0;
	}

	.philosophy-entries {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.philosophy-entry {
		display: flex;
		gap: 1.25rem;
		padding: 1.25rem;
		background: var(--color-surface);
		border-radius: var(--radius-md);
		transition: all var(--duration-normal) var(--ease-smooth);
	}

	.philosophy-entry:hover {
		box-shadow: var(--shadow-diffused);
	}

	.philosophy-number {
		font-family: var(--font-headline);
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--color-accent);
		opacity: 0.6;
		line-height: 1;
	}

	.philosophy-content {
		flex: 1;
	}

	.philosophy-name {
		font-family: var(--font-headline);
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0 0 0.5rem;
	}

	.philosophy-desc {
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--color-ink);
		opacity: 0.7;
		margin: 0;
	}

	/* Appendix */
	.journal-appendix {
		margin-bottom: 2rem;
		padding-top: 2rem;
		border-top: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
	}

	.appendix-header {
		margin-bottom: 1.5rem;
	}

	.appendix-label {
		font-family: var(--font-data);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-ink);
		opacity: 0.5;
	}

	.appendix-items {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.appendix-item {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 6%, transparent);
		border-radius: var(--radius-sm);
		transition: all var(--duration-normal) var(--ease-smooth);
	}

	.appendix-item:hover {
		border-color: color-mix(in srgb, var(--color-ink) 15%, transparent);
	}

	.appendix-icon {
		font-size: 1.25rem;
	}

	.appendix-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.appendix-institution {
		font-family: var(--font-headline);
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-ink);
	}

	.appendix-degree {
		font-family: var(--font-data);
		font-size: 11px;
		color: var(--color-ink);
		opacity: 0.7;
	}

	.appendix-meta {
		font-family: var(--font-data);
		font-size: 10px;
		color: var(--color-ink);
		opacity: 0.5;
	}

	/* End mark */
	.journal-end {
		text-align: center;
		padding: 2rem;
	}

	.end-symbol {
		font-size: 1.25rem;
		color: var(--color-ink);
		opacity: 0.2;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.journal-container {
			padding: 1rem;
		}

		.journal-title {
			font-size: 1.75rem;
		}

		.journal-intro {
			padding: 1.25rem;
		}

		.entry-header {
			flex-wrap: wrap;
		}

		.philosophy-entry {
			flex-direction: column;
			gap: 0.75rem;
		}
	}
</style>
