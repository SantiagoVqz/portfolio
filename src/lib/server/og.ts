/**
 * Server-only Open Graph image generation.
 *
 * Renders a 1200×630 social share card per blog post with Satori (HTML/CSS →
 * SVG) and rasterises it to PNG with resvg. Fonts are bundled in
 * `src/lib/server/fonts` and loaded through SvelteKit's `read()` so they're
 * included in the build and resolved correctly during prerendering.
 */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { read } from '$app/server';
import frauncesUrl from './fonts/Fraunces-600.ttf?url';
import dmMonoUrl from './fonts/DMMono-400.ttf?url';

// Design tokens, mirrored from layout.css so the card matches the site.
const PAPER = '#FDFCF8';
const INK = '#36322F';
const CLAY = '#CC8B65';

const WIDTH = 1200;
const HEIGHT = 630;

type SatoriNode = {
	type: string;
	props: { style?: Record<string, unknown>; children?: SatoriNode | SatoriNode[] | string };
};

const el = (
	type: string,
	style: Record<string, unknown>,
	children?: SatoriNode | SatoriNode[] | string
): SatoriNode => ({ type, props: { style, children } });

let fontsPromise: ReturnType<typeof loadFonts> | null = null;

async function loadFonts() {
	const [fraunces, dmMono] = await Promise.all([
		read(frauncesUrl).arrayBuffer(),
		read(dmMonoUrl).arrayBuffer()
	]);
	return [
		{ name: 'Fraunces', data: fraunces, weight: 600 as const, style: 'normal' as const },
		{ name: 'DM Mono', data: dmMono, weight: 400 as const, style: 'normal' as const }
	];
}

export interface OgOptions {
	title: string;
	date: string;
	readingTime: number;
	tags?: string[];
}

export async function renderOgImage({
	title,
	date,
	readingTime,
	tags = []
}: OgOptions): Promise<Buffer> {
	fontsPromise ??= loadFonts();
	const fonts = await fontsPromise;

	const dateLabel = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	}).format(new Date(date));

	const tree = el(
		'div',
		{
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			background: PAPER,
			padding: '72px 80px',
			fontFamily: 'DM Mono',
			borderLeft: `16px solid ${CLAY}`
		},
		[
			// Kicker
			el(
				'div',
				{
					display: 'flex',
					fontSize: '24px',
					letterSpacing: '4px',
					textTransform: 'uppercase',
					color: CLAY
				},
				'Santiago Vazquez · Blog'
			),
			// Title
			el(
				'div',
				{
					display: 'flex',
					fontFamily: 'Fraunces',
					fontSize: title.length > 60 ? '64px' : '78px',
					lineHeight: 1.05,
					color: INK,
					maxWidth: '960px'
				},
				title
			),
			// Footer: meta + tags
			el(
				'div',
				{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					fontSize: '24px',
					color: INK,
					opacity: 0.65
				},
				[
					el('div', { display: 'flex' }, `${dateLabel}  ·  ${readingTime} min read`),
					el(
						'div',
						{ display: 'flex', gap: '12px' },
						tags.slice(0, 3).map((tag) =>
							el(
								'div',
								{
									display: 'flex',
									border: `1px solid ${INK}`,
									borderRadius: '999px',
									padding: '6px 18px',
									fontSize: '20px'
								},
								tag
							)
						)
					)
				]
			)
		]
	);

	const svg = await satori(tree as Parameters<typeof satori>[0], {
		width: WIDTH,
		height: HEIGHT,
		fonts
	});

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
	return resvg.render().asPng();
}
