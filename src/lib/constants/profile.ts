/**
 * Profile Constants
 * Centralized data for the portfolio - edit here to update the entire site
 */

// ============================================
// PERSONAL INFORMATION
// ============================================

import AskEchoImage from '$lib/assets/projects/askEcho/Screenshot 2026-04-06 at 21.34.06.png';
import KnotImage from '$lib/assets/projects/Knot/Knot.jpeg';
import PiggySlice1 from '$lib/assets/projects/piggy/slice-1.png';
import PiggySlice2 from '$lib/assets/projects/piggy/slice-2.png';
import PiggySlice3 from '$lib/assets/projects/piggy/slice-3.png';
import PiggySlice4 from '$lib/assets/projects/piggy/slice-4.png';
import PiggySlice5 from '$lib/assets/projects/piggy/slice-5.png';
import PiggySlice6 from '$lib/assets/projects/piggy/slice-6.png';

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
	// Small - Supporting skills
	{ name: 'FastAPI', category: 'Backend', size: 'small', icon: '⚙', color: '#009688' },
	{ name: 'React Native', category: 'Mobile', size: 'small', icon: '📱', color: '#61DAFB' },
	{ name: 'Playwright', category: 'Testing', size: 'small', icon: '🎭', color: '#2EAD33' },
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
	backend: ['Python (FastAPI)', 'Node.js', 'C++', 'AWS (Lambda, DynamoDB, AppSync)', 'PostgreSQL'],
	tools: ['Vite', 'Playwright', 'pnpm', 'Docker', 'Git/GitHub', 'CI/CD Pipelines'],
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

export type ProjectLayoutType = 'editorial' | 'data' | 'immersive';

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
	caseStudy: CaseStudy;
}

export const projects: Project[] = [
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
		image: KnotImage,
		layoutType: 'data',
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
		image: PiggySlice1,
		images: [PiggySlice1, PiggySlice2, PiggySlice3, PiggySlice4, PiggySlice5, PiggySlice6],
		layoutType: 'immersive',
		caseStudy: {
			problem:
				'Existing finance apps are either too complex for casual users or too simple for meaningful financial planning. Young professionals need a tool that balances simplicity with powerful budgeting and savings features.',
			approach:
				'Designed a mobile-first experience with intuitive transaction entry, visual budget breakdowns, and gamified savings goals. Built for the Latin American market with multi-currency support and group splitting for shared expenses.',
			solution:
				'Built with React Native and Expo for cross-platform deployment, FastAPI backend with PostgreSQL for reliable financial data storage, and Zustand for performant client-side state management. Features include automated categorization, recurring transaction detection, and real-time budget alerts.',
			outcome:
				'Launched on both iOS and Android. Users report improved spending awareness and consistent savings habit formation through goal tracking and visual progress indicators.',
			screenshots: [],
			codeSnippets: []
		}
	},
	{
		id: 'askecho',
		title: 'AskEcho',
		subtitle: 'CityFront AI',
		description:
			'A multi-tenant embeddable chat solution built from scratch using SvelteKit and Shadow DOM. Reduced client onboarding time from 2 weeks to under 72 hours through streamlined configuration architecture.',
		longDescription:
			'Architected and built a complete multi-tenant chat solution that serves municipal clients across the U.S. The widget uses Shadow DOM for complete style isolation, ensuring it works seamlessly when embedded in any website without CSS conflicts.',
		year: '2025',
		tags: ['SvelteKit', 'Shadow DOM', 'Multi-tenant', 'TypeScript'],
		color: '#D4E0D8',
		metrics: [
			{ label: 'Onboarding Time', value: '<72hrs' },
			{ label: 'Test Coverage', value: '98%+' },
			{ label: 'Clients Served', value: 'Multiple U.S. Cities' }
		],
		image: AskEchoImage,
		layoutType: 'editorial',
		caseStudy: {
			problem: 'Municipal clients needed a branded AI chat widget that could be embedded on any website without CSS conflicts, with rapid deployment for each new city.',
			approach: 'Designed a multi-tenant architecture using Shadow DOM for complete style isolation, with a configuration-driven onboarding system that eliminates manual setup.',
			solution: 'Built AskEcho from scratch with SvelteKit, Shadow DOM encapsulation, and automated deployment pipelines. Each client gets a unique configuration that controls branding, behavior, and AI model settings.',
			outcome: 'Reduced client onboarding from 2 weeks to under 72 hours. Achieved 98%+ test coverage with Playwright E2E tests. Now serving multiple U.S. cities with zero CSS conflicts.',
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
	title: string;
	company: string;
	description: string;
	type: 'work' | 'education' | 'milestone';
}

export const timelineData: TimelineItem[] = [
	{
		year: '2021',
		title: 'Started University',
		company: 'Tecnológico de Monterrey',
		description: 'Began B.S. in Innovation and Development Engineering.',
		type: 'education'
	},
	{
		year: 'Feb 2024',
		title: 'Embedded Software Intern',
		company: 'John Deere',
		description: 'Modernized tractor UI and developed C++ diagnostic systems.',
		type: 'work'
	},
	{
		year: 'Aug 2024',
		title: 'Exchange Program',
		company: 'IÉSEG School of Management',
		description: 'Studied Business & Innovation in Lille, France.',
		type: 'education'
	},
	{
		year: 'Jan 2025',
		title: 'Full Stack Developer',
		company: 'CityFront AI',
		description: 'Leading development of municipal apps and AskEcho chat solution.',
		type: 'work'
	},
	{
		year: 'July 2025',
		title: 'Graduated',
		company: 'Tecnológico de Monterrey',
		description: 'Completed degree with 4.0 GPA.',
		type: 'milestone'
	}
];

// ============================================
// NAVIGATION
// ============================================

export const navLinks = [
	{ label: 'Work', href: '#work' },
	{ label: 'Journey', href: '#timeline' },
	{ label: 'About', href: '#about' },
	{ label: 'Stack', href: '#stack' },
	{ label: 'Contact', href: '#contact' }
] as const;

// ============================================
// META / SEO
// ============================================

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
