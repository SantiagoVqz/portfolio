/**
 * Profile Constants
 * Centralized data for the portfolio - edit here to update the entire site
 */

// ============================================
// PERSONAL INFORMATION
// ============================================

import AskEchoImage from '$lib/assets/projects/askEcho/Screenshot 2026-04-06 at 21.34.06.png';
import KnotImage from '$lib/assets/projects/Knot/Knot.jpeg';
import PiggySite1 from '$lib/assets/projects/piggy/site-01.png';
import PiggySite2 from '$lib/assets/projects/piggy/site-02.png';
import PiggySite3 from '$lib/assets/projects/piggy/site-03.png';
import Tonta01 from '$lib/assets/projects/tonta/tonta-01.png';
import Tonta02 from '$lib/assets/projects/tonta/tonta-02.png';
import Tonta03 from '$lib/assets/projects/tonta/tonta-03.png';

export const personalInfo = {
	name: 'Santiago Vázquez Villarreal',
	shortName: 'Santiago Vazquez',
	title: 'Full-Stack Engineer',
	location: 'Monterrey, NL, MX',
	locationShort: 'Monterrey, MX',
	availability: 'Open to Remote',
	phone: '+52 81 1778 7532',
	email: 'santiago.vqz@gmail.com',
	social: {
		github: 'https://github.com/SantiagoVqz',
		linkedin: 'https://www.linkedin.com/in/santiagovqzv/'
	}
} as const;

// ============================================
// PROFESSIONAL PROFILE
// ============================================

export const professionalProfile = {
	tagline:
		'I build products that scale—from municipal AI systems serving cities across the U.S. to IoT fulfillment solutions for major retailers.',
	bio: [
		"I'm a Full-Stack Engineer with a proven track record of leading development on multi-tenant applications and reducing deployment times by 80%+.",
		'Currently at CityFront AI, I lead development of 4 client-facing applications—including mobile apps, web dashboards, and an enterprise chat widget serving municipal clients across the U.S.',
		'I studied Innovation Engineering at Tecnológico de Monterrey and spent a semester at IÉSEG School of Management in France, where I deepened my understanding of business strategy and international markets.'
	],
	headline:
		'Full-Stack Engineer specializing in Serverless Architectures and scalable web solutions. Proven track record of leading development on multi-tenant applications and reducing client deployment times by 80%+. Deep expertise in Next.js, SvelteKit, and Cloud Native development, combining strong architectural decision-making with hands-on product ownership.'
} as const;

// ============================================
// TECHNICAL SKILLS
// ============================================

export interface Skill {
	name: string;
	category:
	| 'Framework'
	| 'Language'
	| 'Cloud'
	| 'Backend'
	| 'Mobile'
	| 'Testing'
	| 'Motion'
	| 'DevOps'
	| 'Database';
	size: 'large' | 'medium' | 'small';
	icon: string;
	color: string;
}

export const technicalSkills: Skill[] = [
	// Large - Primary expertise
	{ name: 'SvelteKit', category: 'Framework', size: 'large', icon: '⚡', color: '#FF3E00' },
	{ name: 'Next.js', category: 'Framework', size: 'large', icon: '▲', color: '#000000' },
	// Medium - Strong proficiency
	{ name: 'AWS', category: 'Cloud', size: 'medium', icon: '☁', color: '#FF9900' },
	{ name: 'TypeScript', category: 'Language', size: 'medium', icon: 'TS', color: '#3178C6' },
	{ name: 'Node.js', category: 'Backend', size: 'medium', icon: '⬢', color: '#339933' },
	{ name: 'Tailwind CSS', category: 'Framework', size: 'medium', icon: '❋', color: '#06B6D4' },
	// Small - Supporting skills
	{ name: 'Python', category: 'Language', size: 'small', icon: '🐍', color: '#3776AB' },
	{ name: 'FastAPI', category: 'Backend', size: 'small', icon: '⚙', color: '#009688' },
	{ name: 'React Native', category: 'Mobile', size: 'small', icon: '📱', color: '#61DAFB' },
	{ name: 'PostgreSQL', category: 'Database', size: 'small', icon: '🐘', color: '#4169E1' },
	{ name: 'Supabase', category: 'Database', size: 'small', icon: '◈', color: '#3FCF8E' },
	{ name: 'Playwright', category: 'Testing', size: 'small', icon: '🎭', color: '#2EAD33' },
	{ name: 'Jest', category: 'Testing', size: 'small', icon: '✓', color: '#C21325' },
	{ name: 'Cloudflare', category: 'Cloud', size: 'small', icon: '⛅', color: '#F48120' },
	{ name: 'AWS ECS', category: 'Cloud', size: 'small', icon: '▣', color: '#FF9900' },
	{ name: 'Docker', category: 'DevOps', size: 'small', icon: '🐳', color: '#2496ED' },
	{ name: 'pnpm', category: 'DevOps', size: 'small', icon: '⚡', color: '#F69220' },
	{ name: 'npm', category: 'DevOps', size: 'small', icon: '▪', color: '#CB3837' },
	{ name: 'GSAP', category: 'Motion', size: 'small', icon: '◐', color: '#88CE02' }
];

export const skillCategories = {
	frontend: [
		'React.js',
		'Next.js',
		'SvelteKit',
		'React Native',
		'TypeScript',
		'Tailwind CSS',
		'Shadow DOM',
		'GSAP'
	],
	backend: ['Python (FastAPI)', 'Node.js', 'C++', 'AWS (Lambda, DynamoDB, AppSync, ECS)', 'PostgreSQL', 'Supabase'],
	tools: ['Vite', 'Playwright', 'Jest', 'pnpm', 'npm', 'Docker', 'Git/GitHub', 'CI/CD Pipelines', 'Cloudflare'],
	methodologies: ['Agile (SCRUM)', 'Domain-Driven Design (DDD)', 'Product Lifecycle Management']
} as const;

// ============================================
// LANGUAGES
// ============================================

export interface Language {
	name: string;
	proficiency: 'Native' | 'Fluent' | 'Professional' | 'Limited Working';
	flag: string;
}

export const languages: Language[] = [
	{ name: 'English', proficiency: 'Native', flag: '🇺🇸' },
	{ name: 'Spanish', proficiency: 'Native', flag: '🇲🇽' },
	{ name: 'French', proficiency: 'Limited Working', flag: '🇫🇷' }
];

// ============================================
// PROFESSIONAL EXPERIENCE
// ============================================

export interface Experience {
	company: string;
	role: string;
	type?: 'Full-time' | 'Internship' | 'Contract';
	location: string;
	locationType: 'Remote' | 'On-site' | 'Hybrid';
	period: string;
	highlights: string[];
	technologies: string[];
}

export const experiences: Experience[] = [
	{
		company: 'CityFront AI',
		role: 'Full Stack Developer',
		type: 'Full-time',
		location: 'Dallas, USA',
		locationType: 'Remote',
		period: 'Jan 2025 – Present',
		highlights: [
			'Lead development of 4 client-facing applications, including mobile apps, web dashboards, and an enterprise chat widget, serving municipal clients across the U.S.',
			'Architected and built "AskEcho", a multi-tenant embeddable chat solution, from scratch using SvelteKit and Shadow DOM to ensure complete style isolation and security.',
			'Defined the technical roadmap and wrote EPICs/user stories, making autonomous decisions on the tech stack (Vite, Playwright, pnpm monorepo) to optimize performance.',
			'Reduced client onboarding time from 2 weeks to <72 hours by engineering a streamlined configuration architecture and automating deployment workflows.',
			'Established engineering best practices, achieving 98%+ test coverage via automated E2E testing (Playwright) and implementing robust CI/CD pipelines.',
			'Mentored a junior developer (intern) through code reviews and pair programming, guiding their growth from frontend tasks to full-stack feature ownership.'
		],
		technologies: ['SvelteKit', 'React Native', 'AWS', 'TypeScript', 'Playwright', 'Shadow DOM']
	},
	{
		company: 'John Deere',
		role: 'Embedded Software Developer',
		type: 'Internship',
		location: 'Monterrey, MX',
		locationType: 'On-site',
		period: 'Feb 2024 – Aug 2024',
		highlights: [
			'Modernized tractor Command Center UI, implementing new icon sets and layout configurations to improve operator usability and safety.',
			'Developed and tested onboard diagnostic alerts using C++, creating critical preventative systems to detect machine failure before damage occurs.',
			'Contributed to 13 software release bundles, optimizing C++ code for memory-constrained embedded environments in sprayer and planting machines.'
		],
		technologies: ['C++', 'Embedded Systems', 'UI/UX', 'Diagnostics']
	}
];

// ============================================
// CASE STUDIES
// ============================================

export interface CaseStudy {
	problem: string;
	approach: string;
	solution: string;
	outcome: string;
	screenshots: string[];
	codeSnippets: string[];
}

// ============================================
// PROJECTS
// ============================================

export type ProjectLayoutType = 'editorial' | 'data' | 'immersive' | 'compact';

export type ProjectCategory = 'startup' | 'client' | 'personal';

export interface Project {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	longDescription?: string;
	year: string;
	tags: string[];
	color: string;
	image?: string;
	images?: string[];
	video?: string;
	href?: string;
	metrics?: { label: string; value: string }[];
	layoutType: ProjectLayoutType;
	/** Which slice of work this belongs to — drives the /work page filter. */
	category: ProjectCategory;
	/** Featured projects get the full editorial layouts on the home page. */
	featured: boolean;
	caseStudy: CaseStudy;
}

export const projects: Project[] = [
	{
		id: 'echo',
		title: 'Echo',
		subtitle: 'CityFront AI',
		description:
			'An AI assistant for cities — a retrieval-augmented, agent-driven system that answers residents from each city\'s own knowledge and guides them through creating 311 service requests, delivered as a fully isolated embeddable widget.',
		longDescription:
			'The flagship AI product I lead at CityFront AI. Echo grounds every answer in a city\'s own published information and orchestrates agents to walk residents through reporting issues and submitting service requests. It ships as a multi-tenant, embeddable widget that drops into any municipal website without conflicts.',
		year: '2025',
		tags: ['RAG', 'AI Agents', 'Multi-tenant', 'SvelteKit', 'Python'],
		color: '#D4E0D8',
		metrics: [
			{ label: 'client onboarding', value: '<72 hr' },
			{ label: 'E2E coverage', value: '98%+' },
			{ label: 'U.S. cities served', value: 'multiple' }
		],
		image: AskEchoImage,
		layoutType: 'editorial',
		category: 'client',
		featured: true,
		caseStudy: {
			problem:
				'Cities field the same questions over and over and rely on residents finding the right form to report problems. They needed an assistant that answers accurately from their own information and turns a conversation into a properly filed service request.',
			approach:
				'A retrieval-augmented, agent-driven assistant that grounds responses in each city\'s knowledge and guides residents through creating 311 requests — built multi-tenant so a new city can be onboarded quickly and embedded anywhere without breaking the host site.',
			solution:
				'I led the design and build of the assistant and its delivery layer: an isolated, embeddable widget that works on any municipal site, with a configuration-driven onboarding flow and automated deployments.',
			outcome:
				'Reduced client onboarding from two weeks to under 72 hours, sustained 98%+ automated test coverage, and now serves residents across multiple U.S. cities.',
			screenshots: [],
			codeSnippets: []
		}
	},
	{
		id: 'knot',
		title: 'KNOT',
		subtitle: 'Co-founded',
		description:
			'A bilingual wedding planning SaaS platform with guest management, RSVP tracking, WhatsApp notifications, billing tiers, and role-based access control.',
		longDescription:
			'Co-founded and built a full-stack wedding planning platform that helps couples manage their entire wedding digitally. Features include guest list management with RSVP tracking, automated WhatsApp notifications, tiered billing via Stripe, and RBAC for collaborative planning between couples and coordinators.',
		year: '2025',
		tags: ['SvelteKit', 'FastAPI', 'PostgreSQL', 'Stripe', 'WhatsApp API'],
		color: '#C9A84C',
		metrics: [
			{ label: 'less manual coordination', value: '70%' },
			{ label: 'languages', value: 'ES / EN' }
		],
		image: KnotImage,
		layoutType: 'data',
		category: 'startup',
		featured: true,
		caseStudy: {
			problem:
				'Wedding planning in Mexico is fragmented—couples juggle spreadsheets, WhatsApp groups, and manual follow-ups to manage guest lists, RSVPs, and vendor coordination.',
			approach:
				'Built a bilingual (ES/EN) SaaS platform with real-time guest management, automated WhatsApp notifications for RSVPs and updates, and tiered pricing to serve different wedding sizes.',
			solution:
				'Developed with SvelteKit and FastAPI, integrated Stripe for subscription billing, WhatsApp Business API for automated guest communication, and PostgreSQL with row-level security for multi-tenant data isolation.',
			outcome:
				'Launched MVP with active users planning weddings. Automated RSVP follow-ups reduced manual coordination by 70%. Platform supports multiple billing tiers with seamless upgrade paths.',
			screenshots: [],
			codeSnippets: []
		}
	},
	{
		id: 'piggy',
		title: 'Piggy',
		subtitle: 'Co-founded',
		description:
			'A personal finance mobile app for tracking transactions, managing budgets, setting savings goals, monitoring investments, and splitting expenses with friends.',
		longDescription:
			'Co-founded and developed a comprehensive personal finance mobile app. Piggy helps users take control of their money with transaction tracking, budget categories, savings goals with progress visualization, investment portfolio monitoring, group expense splitting, and multi-currency support.',
		year: '2025',
		tags: ['React Native', 'Expo', 'FastAPI', 'PostgreSQL', 'Zustand'],
		color: '#A8D5BA',
		metrics: [
			{ label: 'platforms', value: 'iOS + Android' },
			{ label: 'currency support', value: 'multi' }
		],
		href: 'https://piggy.tonta.mx',
		image: PiggySite1,
		images: [PiggySite1, PiggySite2, PiggySite3],
		layoutType: 'immersive',
		category: 'startup',
		featured: true,
		caseStudy: {
			problem:
				'Existing finance apps are either too complex for casual users or too simple for meaningful financial planning. Young professionals need a tool that balances simplicity with powerful budgeting and savings features.',
			approach:
				'Designed a mobile-first experience with intuitive transaction entry, visual budget breakdowns, and gamified savings goals. Built for the Latin American market with multi-currency support and group splitting for shared expenses.',
			solution:
				'Built with React Native and Expo for cross-platform deployment, FastAPI backend with PostgreSQL for reliable financial data storage, and Zustand for performant client-side state management. Features include automated categorization, recurring transaction detection, and real-time budget alerts.',
			outcome:
				'Currently in development for iOS and Android. The core experience is built — transaction tracking, budget categories, savings goals with visual progress, and group expense splitting — with launch on both platforms ahead.',
			screenshots: [],
			codeSnippets: []
		}
	},
	{
		id: 'tonta',
		title: 'Tonta',
		subtitle: 'Product Studio',
		description:
			'A bilingual product studio I co-founded with my brother — shipping web, mobile, and AI-native software for teams across Latin America and the U.S. From idea to shipped product, fast.',
		longDescription:
			'Tonta is the studio behind much of the work in this archive. We build vertical software for specific industries — govtech, fintech, manufacturing, and developer tools — pairing fast shipping with the design systems and documentation that let a product outlive its launch.',
		year: '2025',
		tags: ['Product Studio', 'Web & Mobile', 'AI-native', 'Design Systems'],
		color: '#4CA97E',
		metrics: [
			{ label: 'products shipped', value: '5' },
			{ label: 'markets', value: 'LATAM + US' }
		],
		image: Tonta01,
		images: [Tonta01, Tonta02, Tonta03],
		href: 'https://tonta.mx',
		layoutType: 'compact',
		category: 'startup',
		featured: false,
		caseStudy: {
			problem:
				'Most teams don\'t need another generic tool — they need software shaped around how their industry actually works, shipped fast enough to test against reality instead of guesses.',
			approach:
				'A small, senior studio that takes products from idea to shipped software: web platforms and APIs, native mobile apps, and AI-native systems like assistants and RAG — built bilingually for Latin America and the U.S.',
			solution:
				'We ship early and refine in the open, backing each build with design systems and documentation so it holds up as it grows. Vertical focus over generic tooling; real-world testing over speculative design.',
			outcome:
				'Five products shipped across govtech, fintech, consumer, developer tools, and manufacturing — several of which appear in this archive: Echo, Piggy, KNOT, Inkwell, and VVF.',
			screenshots: [],
			codeSnippets: []
		}
	},
	{
		id: 'cityfront-portal',
		title: 'McKinney Portal',
		subtitle: 'CityFront AI',
		description:
			'A public service-request portal for a U.S. city — residents report issues on public property, schedule specialized city services, and track the status of their requests.',
		year: '2025',
		tags: ['Next.js', 'React', 'TypeScript', 'GraphQL'],
		color: '#CC8B65',
		layoutType: 'compact',
		category: 'client',
		featured: false,
		caseStudy: {
			problem:
				'Residents needed one clear place to report city issues and schedule specialized services, instead of scattered forms and phone calls.',
			approach:
				'Designed guided, multi-step request flows that adapt to the type of issue or service being requested, with status tracking once a request is filed.',
			solution:
				'Built the resident-facing web portal and connected it to the city\'s service-management systems so submissions flow straight into existing municipal workflows.',
			outcome:
				'Gave residents a single self-serve entry point for city services and streamlined how requests reach the teams that resolve them.',
			screenshots: [],
			codeSnippets: []
		}
	},
	{
		id: 'cityfront-311',
		title: '311 Platform',
		subtitle: 'CityFront AI',
		description:
			'The multi-tenant municipal service-request platform behind CityFront — managing tenants, service categories, work orders, and notifications across cities.',
		year: '2025',
		tags: ['AWS', 'Serverless', 'TypeScript', 'GraphQL'],
		color: '#7D9C8B',
		layoutType: 'compact',
		category: 'client',
		featured: false,
		caseStudy: {
			problem:
				'Serving multiple cities meant each one needed isolated data and configuration while sharing the same underlying service-request engine.',
			approach:
				'A multi-tenant architecture where service categories, requests, and notifications are scoped per city, with room to evolve the stack as the product matured.',
			solution:
				'Built and maintained the backend that powers service requests across tenants, including the data model and the integrations that keep each city\'s workflows in sync.',
			outcome:
				'Provided the shared foundation that lets new cities come online quickly while keeping their data cleanly separated.',
			screenshots: [],
			codeSnippets: []
		}
	},
	{
		id: 'cityfront-mobile',
		title: 'CityFront Mobile',
		subtitle: 'CityFront AI',
		description:
			'A resident-facing mobile app for municipal services — submit service requests, report issues from the field, and track them on the go.',
		year: '2025',
		tags: ['React Native', 'Expo', 'TypeScript'],
		color: '#36322F',
		layoutType: 'compact',
		category: 'client',
		featured: false,
		caseStudy: {
			problem:
				'Many issues are noticed away from a desk — residents needed to report and follow up on city requests from their phones.',
			approach:
				'A cross-platform mobile experience focused on quick reporting and clear request tracking, sharing the same municipal backend as the web products.',
			solution:
				'Built the resident-facing app with React Native and Expo, reusing CityFront\'s service-request platform so mobile and web stay in sync.',
			outcome:
				'Extended CityFront\'s reach to mobile, letting residents engage with city services wherever they are.',
			screenshots: [],
			codeSnippets: []
		}
	},
	{
		id: 'inkwell',
		title: 'Inkwell',
		subtitle: 'Personal',
		description:
			'A Go command-line tool that ingests RSS/Atom feeds on a schedule and files each item as a note in an Obsidian knowledge vault — with a roadmap toward embeddings and weekly synthesis.',
		year: '2025',
		tags: ['Go', 'CLI', 'SQLite', 'Automation'],
		color: '#36322F',
		layoutType: 'compact',
		category: 'personal',
		featured: false,
		caseStudy: {
			problem:
				'Keeping up with a large set of feeds and turning them into durable, searchable personal knowledge is tedious and easy to fall behind on.',
			approach:
				'A dependable ingest pipeline that fetches feeds on a schedule and writes clean, idempotent notes into an existing knowledge vault, with a staged path toward smarter relation-finding and synthesis later.',
			solution:
				'Built a Go CLI that fetches feeds concurrently, dedupes reliably, and writes notes into the vault on a schedule — a focused tool for learning Go in depth while solving a real workflow.',
			outcome:
				'A daily-driver tool that quietly keeps a personal knowledge base current without manual effort.',
			screenshots: [],
			codeSnippets: []
		}
	},
	{
		id: 'vvf',
		title: 'VVF',
		subtitle: 'Client',
		description:
			'An internal ERP-style web app for a garment manufacturer — managing catalog, materials, production tracking, and inventory across facilities with role-based access.',
		year: '2025',
		tags: ['SvelteKit', 'Supabase', 'PostgreSQL', 'Cloudflare'],
		color: '#7D9C8B',
		layoutType: 'compact',
		category: 'client',
		featured: false,
		caseStudy: {
			problem:
				'A manufacturer was coordinating production and inventory across facilities without a single internal system tailored to how the business actually runs.',
			approach:
				'A focused, single-tenant internal tool built around the manufacturer\'s real workflows — catalog and materials, production logging, and per-facility inventory — with role-based access for different staff.',
			solution:
				'Built the web app and its data layer with strong access controls so each role sees only what it should, deployed for reliable internal use.',
			outcome:
				'Gave the team one place to run catalog, production, and inventory day to day.',
			screenshots: [],
			codeSnippets: []
		}
	}
];

// ============================================
// EDUCATION
// ============================================

export interface Education {
	institution: string;
	degree: string;
	focus?: string;
	location: string;
	period: string;
	gpa?: string;
	type: 'degree' | 'exchange' | 'certification';
}

export const education: Education[] = [
	{
		institution: 'Tecnológico de Monterrey',
		degree: 'B.S. in Innovation and Development Engineering',
		focus: 'Software Solutions',
		location: 'Monterrey, MX',
		period: 'Graduated: July 2025',
		gpa: '4.0',
		type: 'degree'
	},
	{
		institution: 'IÉSEG School of Management',
		degree: 'Exchange Program',
		focus: 'Business & Innovation',
		location: 'Lille, France',
		period: 'Aug 2024 – Dec 2024',
		gpa: '4.0',
		type: 'exchange'
	}
];

// ============================================
// PHILOSOPHY / VALUES
// ============================================

export interface Philosophy {
	number: string;
	title: string;
	description: string;
}

export const philosophies: Philosophy[] = [
	{
		number: '01',
		title: 'Product-First Engineering',
		description:
			"I don't just write code—I build products. Every technical decision starts with user impact in mind."
	},
	{
		number: '02',
		title: 'Serverless by Default',
		description:
			'AWS Lambda, DynamoDB, AppSync—I architect cloud-native solutions that scale automatically and cost-effectively.'
	},
	{
		number: '03',
		title: 'Quality at Scale',
		description:
			'98%+ test coverage with Playwright, robust CI/CD pipelines, and engineering practices that ship confidently.'
	}
];

// ============================================
// TIMELINE
// ============================================

export interface TimelineItem {
	year: string;
	endYear?: string;
	current?: boolean;
	title: string;
	company: string;
	description: string;
	type: 'work' | 'education' | 'milestone';
}

export const timelineData: TimelineItem[] = [
	{
		year: '2021',
		endYear: '2025',
		title: 'Started University',
		company: 'Tecnológico de Monterrey',
		description: 'Began B.S. in Innovation and Development Engineering.',
		type: 'education'
	},
	{
		year: 'Feb 2024',
		endYear: 'Aug 2024',
		title: 'Embedded Software Intern',
		company: 'John Deere',
		description: 'Modernized tractor UI and developed C++ diagnostic systems.',
		type: 'work'
	},
	{
		year: 'Aug 2024',
		endYear: 'Dec 2024',
		title: 'Exchange Program',
		company: 'IÉSEG School of Management',
		description: 'Studied Business & Innovation in Lille, France.',
		type: 'education'
	},
	{
		year: 'Jan 2025',
		current: true,
		title: 'Full Stack Developer',
		company: 'CityFront AI',
		description: 'Leading development of municipal apps and AskEcho chat solution.',
		type: 'work'
	},
	{
		year: 'June 2025',
		title: 'Pick-to-Light System',
		company: 'Coppel',
		description: 'Capstone project — designed and built an IoT pick-to-light fulfillment system for one of Mexico\'s largest retailers.',
		type: 'milestone'
	},
	{
		year: 'July 2025',
		title: 'Graduated',
		company: 'Tecnológico de Monterrey',
		description: 'Completed degree with 4.0 GPA.',
		type: 'milestone'
	},
	{
		year: 'Late 2025',
		endYear: 'Early 2026',
		title: 'Co-founded Piggy',
		company: 'Piggy',
		description: 'Built a personal finance mobile app with React Native — transactions, budgets, savings goals, and group splits.',
		type: 'milestone'
	},
	{
		year: '2026',
		current: true,
		title: 'Co-founded KNOT',
		company: 'KNOT',
		description: 'Building a bilingual wedding planning SaaS — guest management, RSVP tracking, WhatsApp notifications, and Stripe billing.',
		type: 'milestone'
	}
];

// ============================================
// NAVIGATION
// ============================================

// One canonical nav, identical on every route. The brand mark is "Home";
// "Work" always means the full archive at /work (selected work on the
// landing page is reachable by scrolling). CTA handles Contact.
export const navLinks = [
	{ label: 'Work', href: '/work' },
	{ label: 'Timeline', href: '/#timeline' },
	{ label: 'Writing', href: '/blog' }
] as const;

// ============================================
// META / SEO
// ============================================

// Canonical production origin — used for SEO canonical URLs, Open Graph,
// sitemap, and RSS. Keep in sync with the deployed domain.
export const siteUrl = 'https://santiagovqz.com';

export const meta = {
	title: 'Santiago Vazquez — Full-Stack Engineer',
	description:
		'Full-Stack Engineer specializing in Serverless Architectures and scalable web solutions. Building products that scale—from municipal AI systems to IoT fulfillment solutions.',
	keywords: [
		'Full-Stack Engineer',
		'SvelteKit',
		'Next.js',
		'AWS',
		'TypeScript',
		'React Native',
		'Serverless',
		'Cloud Native'
	]
} as const;
