import { getPublishedPosts } from '$lib/blog';
import { siteUrl, personalInfo } from '$lib/constants';

export const prerender = true;

const FEED_TITLE = 'Santiago Vazquez — Blog';
const FEED_DESCRIPTION =
	'Notes and news on full-stack engineering, SvelteKit, serverless architecture, AI, and building products that scale.';

// Escape characters that are illegal in XML text/CDATA-free contexts.
function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export function GET() {
	const posts = getPublishedPosts();
	const lastBuild = new Date().toUTCString();

	const items = posts
		.map((post) => {
			const link = `${siteUrl}/blog/${post.slug}`;
			const categories = post.keywords
				.map((k) => `\n\t\t\t<category>${escapeXml(k)}</category>`)
				.join('');
			return `		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${link}</link>
			<guid isPermaLink="true">${link}</guid>
			<description>${escapeXml(post.description)}</description>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			<author>${escapeXml(personalInfo.email)} (${escapeXml(post.author ?? personalInfo.name)})</author>${categories}
		</item>`;
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escapeXml(FEED_TITLE)}</title>
		<link>${siteUrl}/blog</link>
		<description>${escapeXml(FEED_DESCRIPTION)}</description>
		<language>en-us</language>
		<lastBuildDate>${lastBuild}</lastBuildDate>
		<atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
	</channel>
</rss>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/rss+xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
