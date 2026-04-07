import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Navbar navigation buttons', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto(BASE_URL, { waitUntil: 'networkidle' });
		// Wait for page load animation to finish and transforms to clear
		await page.waitForTimeout(3000);
	});

	test('all nav links are visible and clickable', async ({ page }) => {
		const navLinks = ['Artifacts', 'Process', 'Archive', 'Contact'];

		for (const label of navLinks) {
			const link = page.locator('.navbar-links .nav-link', { hasText: label });
			await expect(link).toBeVisible();

			const href = await link.getAttribute('href');
			expect(href).toBe(`#${label.toLowerCase()}`);
		}
	});

	test('nav link hover shows underline animation and color change', async ({ page }) => {
		const navLinks = ['Artifacts', 'Process', 'Archive', 'Contact'];

		for (const label of navLinks) {
			const link = page.locator('.navbar-links .nav-link', { hasText: label });
			const linkLine = link.locator('.link-line');

			// Before hover: scaleX(0) = matrix(0, 0, 0, 1, 0, 0)
			const transformBefore = await linkLine.evaluate(
				(el) => getComputedStyle(el).transform
			);
			expect(transformBefore).toContain('matrix(0');

			// Real hover — no force needed now
			await link.hover();
			await page.waitForTimeout(600);

			// After hover: transform should change
			const transformAfter = await linkLine.evaluate(
				(el) => getComputedStyle(el).transform
			);
			expect(transformBefore).not.toBe(transformAfter);

			// Text color should be accent (#CC8B65 → rgb(204, 139, 101))
			const textColor = await link.locator('.link-text').evaluate(
				(el) => getComputedStyle(el).color
			);
			expect(textColor).toContain('204');
		}
	});

	test('clicking nav links scrolls to corresponding sections', async ({ page }) => {
		const sections = [
			{ label: 'Artifacts', id: 'artifacts' },
			{ label: 'Process', id: 'process' },
			{ label: 'Archive', id: 'archive' },
			{ label: 'Contact', id: 'contact' },
		];

		for (const section of sections) {
			await page.evaluate(() => window.scrollTo(0, 0));
			await page.waitForTimeout(500);

			// Real click — no force
			const link = page.locator('.navbar-links .nav-link', { hasText: section.label });
			await link.click();
			await page.waitForTimeout(2000);

			const isInView = await page.evaluate((id) => {
				const el = document.getElementById(id);
				if (!el) return false;
				const rect = el.getBoundingClientRect();
				return rect.top < window.innerHeight && rect.bottom > 0;
			}, section.id);
			expect(isInView).toBe(true);
		}
	});

	test('Contact Me button works and navigates to contact section', async ({ page }) => {
		const ctaButton = page.locator('.navbar-cta.desktop-only');
		await expect(ctaButton).toBeVisible();
		await expect(ctaButton).toHaveText('Contact Me');

		// Real click
		await ctaButton.click();
		await page.waitForTimeout(2000);

		const isInView = await page.evaluate(() => {
			const el = document.getElementById('contact');
			if (!el) return false;
			const rect = el.getBoundingClientRect();
			return rect.top < window.innerHeight && rect.bottom > 0;
		});
		expect(isInView).toBe(true);
	});

	test('Contact Me button hover changes background color', async ({ page }) => {
		const ctaButton = page.locator('.navbar-cta.desktop-only');

		const bgBefore = await ctaButton.evaluate(
			(el) => getComputedStyle(el).backgroundColor
		);
		expect(bgBefore).toBe('rgb(54, 50, 47)');

		// Real hover
		await ctaButton.hover();
		await page.waitForTimeout(500);

		const bgAfter = await ctaButton.evaluate(
			(el) => getComputedStyle(el).backgroundColor
		);
		expect(bgBefore).not.toBe(bgAfter);
	});
});
