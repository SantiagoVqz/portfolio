/**
 * Profile Constants
 * Centralized data for the portfolio - edit here to update the entire site
 */

// ============================================
// PERSONAL INFORMATION
// ============================================

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
		github: 'https://github.com/SantiagoVqzV',
		linkedin: 'https://linkedin.com/in/SantivqzV'
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
	category: 'Framework' | 'Language' | 'Cloud' | 'Backend' | 'Mobile' | 'Testing' | 'Motion' | 'DevOps' | 'Database';
	size: 'large' | 'medium' | 'small';
}

export const technicalSkills: Skill[] = [
	// Large - Primary expertise
	{ name: 'SvelteKit', category: 'Framework', size: 'large' },
	{ name: 'Next.js', category: 'Framework', size: 'large' },
	// Medium - Strong proficiency
	{ name: 'AWS', category: 'Cloud', size: 'medium' },
	{ name: 'TypeScript', category: 'Language', size: 'medium' },
	// Small - Supporting skills
	{ name: 'FastAPI', category: 'Backend', size: 'small' },
	{ name: 'React Native', category: 'Mobile', size: 'small' },
	{ name: 'Playwright', category: 'Testing', size: 'small' },
	{ name: 'GSAP', category: 'Motion', size: 'small' }
];

export const skillCategories = {
	frontend: ['React.js', 'Next.js', 'SvelteKit', 'React Native', 'TypeScript', 'Tailwind CSS', 'Shadow DOM', 'GSAP'],
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
// PROJECTS
// ============================================

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
	video?: string;
	href?: string;
	metrics?: { label: string; value: string }[];
}

export const projects: Project[] = [
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
		]
	},
	{
		id: 'command-center',
		title: 'Command Center',
		subtitle: 'John Deere',
		description:
			'Modernized tractor Command Center UI with new icon sets and layout configurations. Developed onboard diagnostic alerts using C++ for memory-constrained embedded environments.',
		longDescription:
			'Contributed to the modernization of John Deere tractor displays, improving operator safety and usability through enhanced UI and critical diagnostic alert systems.',
		year: '2024',
		tags: ['C++', 'Embedded Systems', 'UI/UX', 'Diagnostics'],
		color: '#E0D8D4',
		metrics: [
			{ label: 'Release Bundles', value: '13' },
			{ label: 'Machine Types', value: 'Sprayers & Planters' }
		]
	},
	{
		id: 'pick-to-light',
		title: 'Pick-to-Light',
		subtitle: 'Coppel (Capstone)',
		description:
			'Led end-to-end development of a wireless IoT fulfillment system for distribution centers. Projected 70% cost reduction and 40% efficiency improvement over legacy wired solutions.',
		longDescription:
			'Designed and built a wireless Pick-to-Light prototype for Coppel distribution centers, replacing expensive wired 3rd-party solutions with a custom ESP32/MQTT architecture optimized for 196+ LED modules.',
		year: '2025',
		tags: ['FastAPI', 'PostgreSQL', 'ESP32', 'MQTT'],
		color: '#E8DDD4',
		metrics: [
			{ label: 'Cost Reduction', value: '70%' },
			{ label: 'Maintenance Savings', value: '90%' },
			{ label: 'Efficiency Gain', value: '40%' }
		]
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

