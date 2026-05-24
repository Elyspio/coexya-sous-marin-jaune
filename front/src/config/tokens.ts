/**
 * Design tokens de la refonte « warm paper » → MUI.
 * Le jeu light reprend styles.css ; le jeu dark en dérive (charte émeraude/clay conservée).
 */

export type DesignTokens = {
	paper: string;
	paper2: string;
	paper3: string;
	ink: string;
	ink2: string;
	ink3: string;
	ink4: string;
	line: string;
	lineSoft: string;
	accent: string;
	accent2: string;
	accentSoft: string;
	accentInk: string;
	clay: string;
	claySoft: string;
	success: string;
	warn: string;
	warnSoft: string;
	danger: string;
	dangerSoft: string;
	shadowSm: string;
	shadowMd: string;
	shadowLg: string;
};

export const radii = {
	r1: 6,
	r2: 8,
	r3: 12,
	r4: 16,
} as const;

/** Palette de 8 couleurs d'avatar (hash par prénom). */
export const avatarColors = ["#2E5D4A", "#B4543A", "#54678C", "#8C5454", "#486A4A", "#A0712E", "#5B5B6E", "#38493E"] as const;

export const lightTokens: DesignTokens = {
	paper: "#FFFFFF",
	paper2: "#F4F4F5",
	paper3: "#E9E9EC",
	ink: "#09090B",
	ink2: "#3F3F46",
	ink3: "#71717A",
	ink4: "#A1A1AA",
	line: "#E4E4E7",
	lineSoft: "#EFEFF2",
	accent: "#0A7A55",
	accent2: "#086544",
	accentSoft: "#E6F4EE",
	accentInk: "#064C33",
	clay: "#C2410C",
	claySoft: "#FEEAD9",
	success: "#16A571",
	warn: "#B45309",
	warnSoft: "#FEF1C8",
	danger: "#DC2626",
	dangerSoft: "#FEE2E2",
	shadowSm: "0 1px 2px rgba(9, 9, 11, 0.04), 0 1px 3px rgba(9, 9, 11, 0.04)",
	shadowMd: "0 4px 6px -2px rgba(9, 9, 11, 0.05), 0 12px 24px -8px rgba(9, 9, 11, 0.08)",
	shadowLg: "0 8px 16px -4px rgba(9, 9, 11, 0.08), 0 24px 48px -12px rgba(9, 9, 11, 0.12)",
};

export const darkTokens: DesignTokens = {
	paper: "#18181B",
	paper2: "#0A0A0B",
	paper3: "#27272A",
	ink: "#FAFAFA",
	ink2: "#D4D4D8",
	ink3: "#A1A1AA",
	ink4: "#71717A",
	line: "#27272A",
	lineSoft: "#1F1F23",
	accent: "#10B981",
	accent2: "#059669",
	accentSoft: "rgba(16, 185, 129, 0.15)",
	accentInk: "#6EE7B7",
	clay: "#EA7C4B",
	claySoft: "rgba(234, 124, 75, 0.16)",
	success: "#34D399",
	warn: "#FBBF24",
	warnSoft: "rgba(251, 191, 36, 0.16)",
	danger: "#F87171",
	dangerSoft: "rgba(248, 113, 113, 0.16)",
	shadowSm: "0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.3)",
	shadowMd: "0 4px 6px -2px rgba(0, 0, 0, 0.3), 0 12px 24px -8px rgba(0, 0, 0, 0.45)",
	shadowLg: "0 8px 16px -4px rgba(0, 0, 0, 0.4), 0 24px 48px -12px rgba(0, 0, 0, 0.6)",
};
