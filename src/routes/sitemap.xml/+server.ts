import { getPublishedPosts } from '$lib/blog';
import { siteUrl } from '$lib/constants';

export const prerender = true;

interface UrlEntry {
	loc: string;
	lastmod?: string;
	changefreq: string;
	priority: string;
}

export function GET() {
	const posts = getPublishedPosts();

	const staticPages: UrlEntry[] = [
		{ loc: `${siteUrl}/`, changefreq: 'monthly', priority: '1.0' },
		{ loc: `${siteUrl}/blog`, changefreq: 'weekly', priority: '0.8' }
	];

	const postPages: UrlEntry[] = posts.map((post) => ({
		loc: `${siteUrl}/blog/${post.slug}`,
		lastmod: (post.updated ?? post.date).slice(0, 10),
		changefreq: 'monthly',
		priority: '0.7'
	}));

	const urls = [...staticPages, ...postPages]
		.map(
			(u) => `	<url>
		<loc>${u.loc}</loc>${u.lastmod ? `\n\t\t<lastmod>${u.lastmod}</lastmod>` : ''}
		<changefreq>${u.changefreq}</changefreq>
		<priority>${u.priority}</priority>
	</url>`
		)
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
