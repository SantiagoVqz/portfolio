/**
 * Schematics — the site's shared diagram grammar.
 *
 * Every project is represented by one small "patent figure": ink line-work
 * on paper, DM Mono labels, clay/sage accents. All diagrams share a single
 * 640×400 viewBox and one visual grammar so the whole page reads as one
 * annotated engineering sheet.
 *
 * Pure data + geometry helpers; rendering lives in Schematic.svelte.
 */

export type NodeKind = 'box' | 'pill' | 'db' | 'stack' | 'device' | 'browser' | 'users';
export type Accent = 'ink' | 'clay' | 'sage' | 'gold';
export type Side = 'top' | 'bottom' | 'left' | 'right';

export interface SchematicNode {
	id: string;
	kind: NodeKind;
	x: number;
	y: number;
	w: number;
	h: number;
	label: string;
	sub?: string;
	accent?: Accent;
}

export interface SchematicEdge {
	from: string;
	to: string;
	fromSide: Side;
	toSide: Side;
	/** Shift the anchor along its side (viewBox units). */
	fromShift?: number;
	toShift?: number;
	label?: string;
	dashed?: boolean;
	/** Leader lines (annotations) render without an arrowhead. */
	arrow?: boolean;
	/** Override the elbow coordinate (x for H-V-H, y for V-H-V) to avoid overlaps. */
	bend?: number;
}

export interface SchematicDef {
	id: string;
	/** Figure caption, patent-drawing style. */
	title: string;
	nodes: SchematicNode[];
	edges: SchematicEdge[];
}

export const VIEW_W = 640;
export const VIEW_H = 400;

/* ── Geometry helpers ──────────────────────────────────────────── */

export function anchor(node: SchematicNode, side: Side, shift = 0): { x: number; y: number } {
	switch (side) {
		case 'left':
			return { x: node.x, y: node.y + node.h / 2 + shift };
		case 'right':
			return { x: node.x + node.w, y: node.y + node.h / 2 + shift };
		case 'top':
			return { x: node.x + node.w / 2 + shift, y: node.y };
		case 'bottom':
			return { x: node.x + node.w / 2 + shift, y: node.y + node.h };
	}
}

const isHorizontal = (side: Side) => side === 'left' || side === 'right';

export interface EdgeGeometry {
	d: string;
	labelX: number;
	labelY: number;
	labelAnchor: 'middle' | 'start';
	arrow: string;
}

/** Chevron arrowhead pointing INTO the target node. */
function arrowHead(tx: number, ty: number, toSide: Side): string {
	const s = 7;
	switch (toSide) {
		case 'left': // pointing right
			return `M ${tx - s} ${ty - 4.5} L ${tx} ${ty} L ${tx - s} ${ty + 4.5}`;
		case 'right': // pointing left
			return `M ${tx + s} ${ty - 4.5} L ${tx} ${ty} L ${tx + s} ${ty + 4.5}`;
		case 'top': // pointing down
			return `M ${tx - 4.5} ${ty - s} L ${tx} ${ty} L ${tx + 4.5} ${ty - s}`;
		case 'bottom': // pointing up
			return `M ${tx - 4.5} ${ty + s} L ${tx} ${ty} L ${tx + 4.5} ${ty + s}`;
	}
}

export function edgeGeometry(nodes: SchematicNode[], edge: SchematicEdge): EdgeGeometry {
	const from = nodes.find((n) => n.id === edge.from);
	const to = nodes.find((n) => n.id === edge.to);
	if (!from || !to) throw new Error(`schematic edge references missing node: ${edge.from} → ${edge.to}`);

	const f = anchor(from, edge.fromSide, edge.fromShift);
	const t = anchor(to, edge.toSide, edge.toShift);
	const fH = isHorizontal(edge.fromSide);
	const tH = isHorizontal(edge.toSide);
	const SNAP = 4;

	let d: string;
	let labelX: number;
	let labelY: number;
	let labelAnchor: 'middle' | 'start' = 'middle';

	if (fH && tH) {
		if (Math.abs(f.y - t.y) <= SNAP) {
			// Straight horizontal
			d = `M ${f.x} ${f.y} L ${t.x} ${f.y}`;
			t.y = f.y;
			labelX = (f.x + t.x) / 2;
			labelY = f.y - 7;
		} else {
			// H-V-H elbow
			const midX = edge.bend ?? (f.x + t.x) / 2;
			d = `M ${f.x} ${f.y} L ${midX} ${f.y} L ${midX} ${t.y} L ${t.x} ${t.y}`;
			labelX = midX + 8;
			labelY = (f.y + t.y) / 2;
			labelAnchor = 'start';
		}
	} else if (!fH && !tH) {
		if (Math.abs(f.x - t.x) <= SNAP) {
			// Straight vertical
			d = `M ${f.x} ${f.y} L ${f.x} ${t.y}`;
			t.x = f.x;
			labelX = f.x + 8;
			labelY = (f.y + t.y) / 2 + 3;
			labelAnchor = 'start';
		} else {
			// V-H-V elbow
			const midY = edge.bend ?? (f.y + t.y) / 2;
			d = `M ${f.x} ${f.y} L ${f.x} ${midY} L ${t.x} ${midY} L ${t.x} ${t.y}`;
			labelX = (f.x + t.x) / 2;
			labelY = midY - 7;
		}
	} else if (fH && !tH) {
		// L: horizontal then vertical
		d = `M ${f.x} ${f.y} L ${t.x} ${f.y} L ${t.x} ${t.y}`;
		labelX = (f.x + t.x) / 2;
		labelY = f.y - 7;
	} else {
		// L: vertical then horizontal
		d = `M ${f.x} ${f.y} L ${f.x} ${t.y} L ${t.x} ${t.y}`;
		labelX = (f.x + t.x) / 2;
		labelY = t.y - 7;
	}

	return { d, labelX, labelY, labelAnchor, arrow: arrowHead(t.x, t.y, edge.toSide) };
}

/* ── The eight figures ─────────────────────────────────────────── */

export const schematics: Record<string, SchematicDef> = {
	echo: {
		id: 'echo',
		title: 'Echo — retrieval-grounded city assistant',
		nodes: [
			{ id: 'residents', kind: 'users', x: 46, y: 168, w: 80, h: 48, label: 'Residents' },
			{ id: 'widget', kind: 'browser', x: 172, y: 134, w: 168, h: 118, label: 'Echo widget', sub: 'embeds in any city site', accent: 'clay' },
			{ id: 'agents', kind: 'box', x: 428, y: 88, w: 172, h: 60, label: 'Agent layer', sub: 'RAG + tools' },
			{ id: 'knowledge', kind: 'db', x: 444, y: 236, w: 140, h: 86, label: 'City knowledge', accent: 'sage' },
			{ id: 'requests', kind: 'pill', x: 188, y: 322, w: 168, h: 42, label: '311 requests', accent: 'sage' }
		],
		edges: [
			{ from: 'residents', to: 'widget', fromSide: 'right', toSide: 'left' },
			{ from: 'widget', to: 'agents', fromSide: 'right', toSide: 'left' },
			{ from: 'agents', to: 'knowledge', fromSide: 'bottom', toSide: 'top', dashed: true, label: 'grounded in' },
			{ from: 'widget', to: 'requests', fromSide: 'bottom', toSide: 'top', dashed: true, label: 'files requests' }
		]
	},

	knot: {
		id: 'knot',
		title: 'KNOT — wedding planning SaaS',
		nodes: [
			{ id: 'couples', kind: 'users', x: 46, y: 58, w: 90, h: 48, label: 'Couples & guests' },
			{ id: 'app', kind: 'browser', x: 196, y: 44, w: 168, h: 118, label: 'KNOT', sub: 'bilingual SaaS', accent: 'clay' },
			{ id: 'engine', kind: 'box', x: 430, y: 44, w: 170, h: 56, label: 'RSVP engine' },
			{ id: 'whatsapp', kind: 'pill', x: 430, y: 146, w: 170, h: 44, label: 'WhatsApp API', accent: 'sage' },
			{ id: 'stripe', kind: 'pill', x: 430, y: 218, w: 170, h: 44, label: 'Stripe billing', accent: 'sage' },
			{ id: 'db', kind: 'db', x: 196, y: 232, w: 168, h: 88, label: 'Postgres · RLS', sub: 'multi-tenant' }
		],
		edges: [
			{ from: 'couples', to: 'app', fromSide: 'right', toSide: 'left' },
			{ from: 'app', to: 'engine', fromSide: 'right', toSide: 'left', fromShift: -31 },
			{ from: 'engine', to: 'whatsapp', fromSide: 'bottom', toSide: 'top', label: 'auto-notify' },
			{ from: 'app', to: 'stripe', fromSide: 'right', toSide: 'left', fromShift: 34, dashed: true },
			{ from: 'app', to: 'db', fromSide: 'bottom', toSide: 'top', label: 'tenant data' }
		]
	},

	piggy: {
		id: 'piggy',
		title: 'Piggy — personal finance app',
		nodes: [
			{ id: 'budgets', kind: 'pill', x: 40, y: 66, w: 140, h: 42, label: 'Budgets' },
			{ id: 'goals', kind: 'pill', x: 40, y: 148, w: 140, h: 42, label: 'Goals' },
			{ id: 'splits', kind: 'pill', x: 40, y: 230, w: 140, h: 42, label: 'Group splits' },
			{ id: 'app', kind: 'device', x: 252, y: 44, w: 128, h: 240, label: 'Piggy', sub: 'iOS · Android', accent: 'clay' },
			{ id: 'api', kind: 'box', x: 466, y: 72, w: 140, h: 58, label: 'FastAPI' },
			{ id: 'db', kind: 'db', x: 466, y: 204, w: 140, h: 86, label: 'Postgres' }
		],
		edges: [
			{ from: 'budgets', to: 'app', fromSide: 'right', toSide: 'left', toShift: -77, dashed: true, arrow: false },
			{ from: 'goals', to: 'app', fromSide: 'right', toSide: 'left', toShift: 5, dashed: true, arrow: false },
			{ from: 'splits', to: 'app', fromSide: 'right', toSide: 'left', toShift: 87, dashed: true, arrow: false },
			{ from: 'app', to: 'api', fromSide: 'right', toSide: 'left', fromShift: -63, label: 'sync' },
			{ from: 'api', to: 'db', fromSide: 'bottom', toSide: 'top' }
		]
	},

	'cityfront-portal': {
		id: 'cityfront-portal',
		title: 'McKinney Portal — resident self-service',
		nodes: [
			{ id: 'residents', kind: 'users', x: 46, y: 148, w: 84, h: 48, label: 'Residents' },
			{ id: 'portal', kind: 'browser', x: 176, y: 108, w: 180, h: 128, label: 'Service portal', sub: 'report · schedule', accent: 'clay' },
			{ id: 'flows', kind: 'box', x: 446, y: 86, w: 160, h: 60, label: 'Guided flows', sub: 'adaptive steps' },
			{ id: 'city', kind: 'pill', x: 446, y: 208, w: 160, h: 44, label: 'City workflows', accent: 'sage' },
			{ id: 'status', kind: 'pill', x: 176, y: 300, w: 180, h: 42, label: 'Status tracking' }
		],
		edges: [
			{ from: 'residents', to: 'portal', fromSide: 'right', toSide: 'left' },
			{ from: 'portal', to: 'flows', fromSide: 'right', toSide: 'left', fromShift: -22 },
			{ from: 'flows', to: 'city', fromSide: 'bottom', toSide: 'top', dashed: true, label: 'to city teams' },
			{ from: 'portal', to: 'status', fromSide: 'bottom', toSide: 'top', dashed: true }
		]
	},

	'cityfront-311': {
		id: 'cityfront-311',
		title: '311 Platform — multi-tenant engine',
		nodes: [
			{ id: 'tenants', kind: 'stack', x: 52, y: 96, w: 168, h: 72, label: 'City tenants', sub: 'isolated config' },
			{ id: 'engine', kind: 'box', x: 296, y: 84, w: 168, h: 96, label: '311 engine', sub: 'multi-tenant core', accent: 'clay' },
			{ id: 'data', kind: 'db', x: 492, y: 44, w: 132, h: 78, label: 'Per-city data' },
			{ id: 'notify', kind: 'pill', x: 492, y: 172, w: 132, h: 42, label: 'Notifications' },
			{ id: 'orders', kind: 'pill', x: 492, y: 244, w: 132, h: 42, label: 'Work orders' }
		],
		edges: [
			{ from: 'tenants', to: 'engine', fromSide: 'right', toSide: 'left', label: 'onboards <72h' },
			{ from: 'engine', to: 'data', fromSide: 'right', toSide: 'left', fromShift: -30, bend: 472 },
			{ from: 'engine', to: 'notify', fromSide: 'right', toSide: 'left', bend: 478 },
			{ from: 'engine', to: 'orders', fromSide: 'right', toSide: 'left', fromShift: 30, bend: 484 }
		]
	},

	'cityfront-mobile': {
		id: 'cityfront-mobile',
		title: 'CityFront Mobile — field reporting',
		nodes: [
			{ id: 'residents', kind: 'users', x: 46, y: 150, w: 84, h: 48, label: 'Residents' },
			{ id: 'app', kind: 'device', x: 196, y: 50, w: 132, h: 240, label: 'CityFront app', sub: 'React Native', accent: 'clay' },
			{ id: 'platform', kind: 'box', x: 452, y: 92, w: 156, h: 64, label: '311 platform', sub: 'shared backend' }
		],
		edges: [
			{ from: 'residents', to: 'app', fromSide: 'right', toSide: 'left', toShift: 4 },
			{ from: 'app', to: 'platform', fromSide: 'right', toSide: 'left', fromShift: -46, toShift: -22, label: 'submit' },
			{ from: 'platform', to: 'app', fromSide: 'left', toSide: 'right', fromShift: 22, toShift: -24, label: 'status', dashed: true }
		]
	},

	inkwell: {
		id: 'inkwell',
		title: 'Inkwell — feed-to-vault pipeline',
		nodes: [
			{ id: 'feeds', kind: 'pill', x: 36, y: 64, w: 136, h: 44, label: 'RSS · Atom' },
			{ id: 'cli', kind: 'box', x: 236, y: 48, w: 160, h: 76, label: 'Go CLI', sub: 'concurrent fetch', accent: 'clay' },
			{ id: 'store', kind: 'db', x: 460, y: 52, w: 136, h: 70, label: 'SQLite', sub: 'dedupe' },
			{ id: 'vault', kind: 'box', x: 236, y: 224, w: 160, h: 64, label: 'Obsidian vault', accent: 'sage' }
		],
		edges: [
			{ from: 'feeds', to: 'cli', fromSide: 'right', toSide: 'left' },
			{ from: 'cli', to: 'store', fromSide: 'right', toSide: 'left', label: 'on schedule' },
			{ from: 'store', to: 'vault', fromSide: 'bottom', toSide: 'right', label: 'clean notes' }
		]
	},

	tonta: {
		id: 'tonta',
		title: 'Tonta — idea to shipped product',
		nodes: [
			{ id: 'brief', kind: 'users', x: 46, y: 58, w: 90, h: 48, label: 'Idea / brief' },
			{ id: 'studio', kind: 'browser', x: 196, y: 44, w: 168, h: 116, label: 'Tonta', sub: 'product studio', accent: 'clay' },
			{ id: 'web', kind: 'box', x: 444, y: 36, w: 160, h: 48, label: 'Web & API' },
			{ id: 'mobile', kind: 'box', x: 444, y: 112, w: 160, h: 48, label: 'Mobile apps' },
			{ id: 'ai', kind: 'box', x: 444, y: 188, w: 160, h: 48, label: 'AI-native' },
			{ id: 'shipped', kind: 'pill', x: 196, y: 248, w: 168, h: 44, label: 'Shipped product', accent: 'sage' }
		],
		edges: [
			{ from: 'brief', to: 'studio', fromSide: 'right', toSide: 'left' },
			{ from: 'studio', to: 'web', fromSide: 'right', toSide: 'left', fromShift: -42 },
			{ from: 'studio', to: 'mobile', fromSide: 'right', toSide: 'left', fromShift: 34 },
			{ from: 'studio', to: 'ai', fromSide: 'right', toSide: 'left', fromShift: 48, bend: 404 },
			{ from: 'studio', to: 'shipped', fromSide: 'bottom', toSide: 'top', dashed: true, label: 'ships, fast' }
		]
	},

	vvf: {
		id: 'vvf',
		title: 'VVF — manufacturing ERP',
		nodes: [
			{ id: 'staff', kind: 'users', x: 46, y: 58, w: 90, h: 48, label: 'Staff roles' },
			{ id: 'erp', kind: 'browser', x: 196, y: 44, w: 168, h: 116, label: 'VVF ERP', sub: 'single-tenant', accent: 'clay' },
			{ id: 'catalog', kind: 'box', x: 444, y: 36, w: 160, h: 48, label: 'Catalog' },
			{ id: 'production', kind: 'box', x: 444, y: 112, w: 160, h: 48, label: 'Production' },
			{ id: 'inventory', kind: 'box', x: 444, y: 188, w: 160, h: 48, label: 'Inventory' },
			{ id: 'db', kind: 'db', x: 196, y: 236, w: 168, h: 84, label: 'Supabase RLS', sub: 'role-scoped' }
		],
		edges: [
			{ from: 'staff', to: 'erp', fromSide: 'right', toSide: 'left' },
			{ from: 'erp', to: 'catalog', fromSide: 'right', toSide: 'left', fromShift: -42 },
			{ from: 'erp', to: 'production', fromSide: 'right', toSide: 'left', fromShift: 34 },
			{ from: 'erp', to: 'inventory', fromSide: 'right', toSide: 'left', fromShift: 48, bend: 404 },
			{ from: 'erp', to: 'db', fromSide: 'bottom', toSide: 'top' }
		]
	}
};

export function schematicFor(projectId: string): SchematicDef | null {
	return schematics[projectId] ?? null;
}
