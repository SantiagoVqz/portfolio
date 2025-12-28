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
	let isMobileMenuOpen = $state(false);
	let lastScrollY = 0;

	// Close mobile menu when clicking a link
	function handleLinkClick() {
		isMobileMenuOpen = false;
	}

	// Toggle mobile menu
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	// Close menu on escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isMobileMenuOpen) {
			isMobileMenuOpen = false;
		}
	}

	onMount(() => {
		scrollState.init();

		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Show/hide based on scroll direction (but not when menu is open)
			if (!isMobileMenuOpen) {
				if (currentScrollY > lastScrollY && currentScrollY > 100) {
					isHidden = true;
				} else {
					isHidden = false;
				}
			}

			// Add background when scrolled
			isScrolled = currentScrollY > 50;
			lastScrollY = currentScrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('keydown', handleKeydown);
			scrollState.destroy();
		};
	});
</script>

<nav 
	class="navbar" 
	class:is-scrolled={isScrolled} 
	class:is-hidden={isHidden}
	class:menu-open={isMobileMenuOpen}
	aria-label="Main navigation"
>
	<div class="navbar-inner">
		<!-- Brand -->
		<a
			href="/"
			class="navbar-brand"
			use:magnetic={{ strength: 0.2, duration: 0.5 }}
			data-cursor-hover
			aria-label="Go to homepage"
		>
			<span class="brand-text">{brand}</span>
		</a>

		<!-- Navigation Links (Desktop) -->
		{#if links.length > 0}
			<ul class="navbar-links" role="menubar">
				{#each links as link (link.href)}
					<li role="none">
						<a
							href={link.href}
							class="nav-link"
							use:magnetic={{ strength: 0.3, duration: 0.4 }}
							data-cursor-hover
							role="menuitem"
						>
							<span class="link-text">{link.label}</span>
							<span class="link-line"></span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		<!-- CTA / Contact (Desktop) -->
		<a
			href="#contact"
			class="navbar-cta desktop-only"
			use:magnetic={{ strength: 0.4, duration: 0.5 }}
			data-cursor-hover
		>
			<span>Contact Me</span>
		</a>

		<!-- Mobile Menu Button -->
		<button
			class="mobile-menu-btn"
			onclick={toggleMobileMenu}
			aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
			aria-expanded={isMobileMenuOpen}
			aria-controls="mobile-menu"
			data-cursor-hover
		>
			<span class="hamburger" class:open={isMobileMenuOpen}>
				<span class="line line-1"></span>
				<span class="line line-2"></span>
				<span class="line line-3"></span>
			</span>
		</button>
	</div>

	<!-- Scroll progress indicator -->
	<div class="scroll-progress" style="--progress: {scrollState.progress}"></div>

	<!-- Mobile Menu Overlay -->
	{#if isMobileMenuOpen}
		<div 
			class="mobile-menu-overlay"
			onclick={handleLinkClick}
			role="presentation"
		></div>
	{/if}

	<!-- Mobile Menu -->
	<div 
		id="mobile-menu"
		class="mobile-menu"
		class:open={isMobileMenuOpen}
		role="menu"
		aria-hidden={!isMobileMenuOpen}
	>
		<ul class="mobile-menu-links">
			{#each links as link, i (link.href)}
				<li style="--delay: {i * 0.05}s">
					<a
						href={link.href}
						class="mobile-link"
						onclick={handleLinkClick}
						role="menuitem"
						tabindex={isMobileMenuOpen ? 0 : -1}
					>
						<span class="mobile-link-number">0{i + 1}</span>
						<span class="mobile-link-text">{link.label}</span>
					</a>
				</li>
			{/each}
		</ul>
		<a
			href="#contact"
			class="mobile-cta"
			onclick={handleLinkClick}
			tabindex={isMobileMenuOpen ? 0 : -1}
		>
			<span>Contact Me</span>
			<span class="arrow">→</span>
		</a>
	</div>
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
			transform var(--duration-slow) var(--ease-smooth),
			background var(--duration-normal) ease,
			backdrop-filter var(--duration-normal) ease;
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

	.navbar.menu-open {
		transform: translateY(0);
		background: rgba(253, 252, 248, 0.95);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
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
		z-index: 1001;
	}

	.brand-text {
		font-family: var(--font-headline);
		font-size: 1.125rem;
		font-weight: 500;
		letter-spacing: var(--tracking-tight);
	}

	/* Navigation Links (Desktop) */
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
		transition: color var(--duration-normal) ease;
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
		transition: transform var(--duration-slow) var(--ease-smooth);
	}

	.nav-link:hover .link-line {
		transform: scaleX(1);
		transform-origin: left;
	}

	.nav-link:hover .link-text {
		color: var(--color-accent);
	}

	/* CTA Button (Desktop) */
	.navbar-cta {
		font-family: var(--font-data);
		font-size: 0.75rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		text-decoration: none;
		padding: 0.75rem 1.5rem;
		background: var(--color-ink);
		color: var(--color-base);
		border-radius: var(--radius-full);
		transition:
			background var(--duration-normal) ease,
			transform var(--duration-normal) ease;
	}

	.navbar-cta:hover {
		background: var(--color-accent);
	}

	/* Mobile Menu Button */
	.mobile-menu-btn {
		display: none;
		width: 44px;
		height: 44px;
		background: transparent;
		border: none;
		padding: 0;
		cursor: none;
		z-index: 1001;
		align-items: center;
		justify-content: center;
	}

	.hamburger {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 24px;
	}

	.line {
		height: 2px;
		width: 100%;
		background: var(--color-ink);
		border-radius: 1px;
		transition: all var(--duration-normal) var(--ease-smooth);
		transform-origin: center;
	}

	.hamburger.open .line-1 {
		transform: translateY(7px) rotate(45deg);
	}

	.hamburger.open .line-2 {
		opacity: 0;
		transform: scaleX(0);
	}

	.hamburger.open .line-3 {
		transform: translateY(-7px) rotate(-45deg);
	}

	/* Mobile Menu Overlay */
	.mobile-menu-overlay {
		position: fixed;
		inset: 0;
		background: rgba(54, 50, 47, 0.3);
		z-index: 999;
		animation: fadeIn var(--duration-normal) ease forwards;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* Mobile Menu */
	.mobile-menu {
		position: fixed;
		top: 0;
		right: 0;
		width: min(320px, 85vw);
		height: 100vh;
		background: var(--color-base);
		z-index: 1000;
		padding: 6rem 2rem 2rem;
		transform: translateX(100%);
		transition: transform var(--duration-slow) var(--ease-smooth);
		display: flex;
		flex-direction: column;
		box-shadow: -8px 0 32px rgba(54, 50, 47, 0.1);
	}

	.mobile-menu.open {
		transform: translateX(0);
	}

	.mobile-menu-links {
		list-style: none;
		padding: 0;
		margin: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.mobile-menu-links li {
		opacity: 0;
		transform: translateX(20px);
	}

	.mobile-menu.open .mobile-menu-links li {
		animation: slideIn var(--duration-slow) var(--ease-smooth) forwards;
		animation-delay: calc(var(--delay) + 0.1s);
	}

	@keyframes slideIn {
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.mobile-link {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 0;
		text-decoration: none;
		color: var(--color-ink);
		border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
		transition: all var(--duration-normal) ease;
	}

	.mobile-link:hover {
		padding-left: 0.5rem;
		border-color: var(--color-accent);
	}

	.mobile-link-number {
		font-family: var(--font-data);
		font-size: 0.625rem;
		color: var(--color-accent);
		letter-spacing: 0.05em;
	}

	.mobile-link-text {
		font-family: var(--font-headline);
		font-size: 1.25rem;
		font-weight: 500;
	}

	.mobile-cta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		background: var(--color-ink);
		color: var(--color-base);
		text-decoration: none;
		border-radius: var(--radius-full);
		font-family: var(--font-data);
		font-size: 0.75rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		margin-top: 2rem;
		transition: background var(--duration-normal) ease;
	}

	.mobile-cta:hover {
		background: var(--color-accent);
	}

	.mobile-cta .arrow {
		transition: transform var(--duration-normal) ease;
	}

	.mobile-cta:hover .arrow {
		transform: translateX(4px);
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

	/* Desktop only */
	.desktop-only {
		display: block;
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

		.desktop-only {
			display: none;
		}

		.mobile-menu-btn {
			display: flex;
		}

		.brand-text {
			font-size: 1rem;
		}
	}
</style>
