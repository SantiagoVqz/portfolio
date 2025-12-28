export const theme = {
	colors: {
		base: '#FDFCF8', // Sun-bleached Paper
		surface: '#F2F0E9', // Raw Ceramic/Bone
		accent: '#CC8B65', // Baked Clay
		tension: '#7D9C8B', // Dried Sage
		ink: '#36322F' // Soft Charcoal
	},
	typography: {
		fonts: {
			headline: '"Fraunces", "Times New Roman", serif',
			data: '"Input Mono", "DM Mono", "Courier New", monospace'
		},
		tokens: {
			letterSpacing: {
				tight: '-0.02em',
				wide: '0.04em'
			},
			lineHeight: {
				tight: '1.1',
				relaxed: '1.6'
			}
		}
	},
	material: {
		shadows: {
			diffused:
				'inset 0px 2px 8px -2px rgba(54, 50, 47, 0.08), 0px 8px 24px -6px rgba(54, 50, 47, 0.04)',
			deep: 'inset 0px 4px 16px -4px rgba(54, 50, 47, 0.12), 0px 12px 32px -8px rgba(54, 50, 47, 0.08)'
		},
		glass: {
			blur: 'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);',
			grain: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
		}
	}
} as const;

export type Theme = typeof theme;

// Helper to inject CSS variables
export const cssVariables = `
	:root {
		--color-base: ${theme.colors.base};
		--color-surface: ${theme.colors.surface};
		--color-accent: ${theme.colors.accent};
		--color-tension: ${theme.colors.tension};
		--color-ink: ${theme.colors.ink};

		--font-headline: ${theme.typography.fonts.headline};
		--font-data: ${theme.typography.fonts.data};

		--tracking-tight: ${theme.typography.tokens.letterSpacing.tight};
		--tracking-wide: ${theme.typography.tokens.letterSpacing.wide};

		--leading-tight: ${theme.typography.tokens.lineHeight.tight};
		--leading-relaxed: ${theme.typography.tokens.lineHeight.relaxed};

		--shadow-diffused: ${theme.material.shadows.diffused};
		--shadow-deep: ${theme.material.shadows.deep};
		
		--glass-grain: ${theme.material.glass.grain};
	}
`;
