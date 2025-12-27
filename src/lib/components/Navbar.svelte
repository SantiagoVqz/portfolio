<script lang="ts">
	import { magnetic } from '$lib/actions/magnetic';
	import { scrollState } from '$lib/stores/scroll.svelte';
	import { onMount } from 'svelte';

	interface NavLink {
		label: string;
		href: string;
	}

	interface Props {
		brand?: string;
		links?: NavLink[];
	}

	let { brand = 'Santiago Vazquez', links = [] }: Props = $props();

	// Track scroll state for navbar appearance
	let isScrolled = $state(false);
	let isHidden = $state(false);
	let lastScrollY = 0;

	onMount(() => {
		scrollState.init();

		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Show/hide based on scroll direction
			if (currentScrollY > lastScrollY && currentScrollY > 100) {
				isHidden = true;
			} else {
				isHidden = false;
			}

			// Add background when scrolled
			isScrolled = currentScrollY > 50;
			lastScrollY = currentScrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
			scrollState.destroy();
		};
	});
</script>

<nav class="navbar" class:is-scrolled={isScrolled} class:is-hidden={isHidden}>
	<div class="navbar-inner">
		<!-- Brand -->
		<a href="/" class="navbar-brand" use:magnetic={{ strength: 0.2, duration: 0.5 }} data-cursor-hover>
			<span class="brand-text">{brand}</span>
		</a>

		<!-- Navigation Links -->
		{#if links.length > 0}
			<ul class="navbar-links">
				{#each links as link (link.href)}
					<li>
						<a
							href={link.href}
							class="nav-link"
							use:magnetic={{ strength: 0.3, duration: 0.4 }}
							data-cursor-hover
						>
							<span class="link-text">{link.label}</span>
							<span class="link-line"></span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		<!-- CTA / Contact -->
		<a
			href="#contact"
			class="navbar-cta"
			use:magnetic={{ strength: 0.4, duration: 0.5 }}
			data-cursor-hover
		>
			<span>Contact Me</span>
		</a>
	</div>

	<!-- Scroll progress indicator -->
	<div class="scroll-progress" style="--progress: {scrollState.progress}"></div>
</nav>

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		padding: 1.25rem 2rem;
		transition:
			transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
			background 0.3s ease,
			backdrop-filter 0.3s ease;
	}

	.navbar.is-scrolled {
		background: rgba(253, 252, 248, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		padding: 1rem 2rem;
	}

	.navbar.is-hidden {
		transform: translateY(-100%);
	}

	.navbar-inner {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	/* Brand */
	.navbar-brand {
		text-decoration: none;
		color: var(--color-ink);
	}

	.brand-text {
		font-family: var(--font-headline);
		font-size: 1.125rem;
		font-weight: 500;
		letter-spacing: var(--tracking-tight);
	}

	/* Navigation Links */
	.navbar-links {
		display: flex;
		align-items: center;
		gap: 2.5rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-link {
		position: relative;
		text-decoration: none;
		color: var(--color-ink);
		padding: 0.5rem 0;
	}

	.link-text {
		font-family: var(--font-data);
		font-size: 0.75rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		transition: color 0.3s ease;
	}

	.link-line {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1px;
		background: var(--color-accent);
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.nav-link:hover .link-line {
		transform: scaleX(1);
		transform-origin: left;
	}

	.nav-link:hover .link-text {
		color: var(--color-accent);
	}

	/* CTA Button */
	.navbar-cta {
		font-family: var(--font-data);
		font-size: 0.75rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		text-decoration: none;
		padding: 0.75rem 1.5rem;
		background: var(--color-ink);
		color: var(--color-base);
		border-radius: 2rem;
		transition:
			background 0.3s ease,
			transform 0.3s ease;
	}

	.navbar-cta:hover {
		background: var(--color-accent);
	}

	/* Scroll Progress */
	.scroll-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 2px;
		width: calc(var(--progress) * 100%);
		background: linear-gradient(90deg, var(--color-accent), var(--color-tension));
		transition: width 0.1s linear;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.navbar {
			padding: 1rem 1.25rem;
		}

		.navbar.is-scrolled {
			padding: 0.875rem 1.25rem;
		}

		.navbar-links {
			display: none;
		}

		.brand-text {
			font-size: 1rem;
		}
	}
</style>

