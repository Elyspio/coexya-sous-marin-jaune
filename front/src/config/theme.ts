import type { CSSProperties } from "react";
import type { PaletteMode } from "@mui/material";
import { alpha, createTheme, type Theme } from "@mui/material/styles";
import { type DesignTokens, darkTokens, lightTokens, radii } from "./tokens";

const fontSans = '"Geist Sans", -apple-system, BlinkMacSystemFont, "Inter", "Roboto", sans-serif';
const fontMono = '"Geist Mono", ui-monospace, "SF Mono", Menlo, Monaco, monospace';

declare module "@mui/material/styles" {
	interface Palette {
		accent: Palette["primary"];
		custom: DesignTokens;
	}
	interface PaletteOptions {
		accent?: PaletteOptions["primary"];
		custom?: DesignTokens;
	}
	interface TypographyVariants {
		mono: CSSProperties;
		eyebrow: CSSProperties;
	}
	interface TypographyVariantsOptions {
		mono?: CSSProperties;
		eyebrow?: CSSProperties;
	}
}

declare module "@mui/material/Typography" {
	interface TypographyPropsVariantOverrides {
		mono: true;
		eyebrow: true;
	}
}

declare module "@mui/material/Button" {
	interface ButtonPropsVariantOverrides {
		accent: true;
		solid: true;
		soft: true;
	}
}

function buildTheme(mode: PaletteMode, t: DesignTokens): Theme {
	const accentContrast = "#FFFFFF";

	return createTheme({
		shape: { borderRadius: radii.r2 },
		palette: {
			mode,
			primary: { main: t.ink, contrastText: t.paper },
			secondary: { main: t.accent, dark: t.accent2, contrastText: accentContrast },
			accent: { main: t.accent, dark: t.accent2, light: t.accentSoft, contrastText: accentContrast },
			success: { main: t.success },
			warning: { main: t.warn },
			error: { main: t.danger },
			background: { default: t.paper2, paper: t.paper },
			text: { primary: t.ink, secondary: t.ink3, disabled: t.ink4 },
			divider: t.line,
			custom: t,
		},
		typography: {
			fontFamily: fontSans,
			fontSize: 14.5,
			h1: { fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.15 },
			h2: { fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" },
			h3: { fontSize: 15, fontWeight: 600 },
			h4: { fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em" },
			h5: { fontSize: 17, fontWeight: 600, letterSpacing: "-0.015em" },
			h6: { fontSize: 15, fontWeight: 600 },
			body1: { fontSize: 14.5, lineHeight: 1.5 },
			body2: { fontSize: 13 },
			subtitle1: { fontSize: 14 },
			button: { fontWeight: 500, textTransform: "none", letterSpacing: 0 },
			overline: {
				fontFamily: fontMono,
				fontSize: 11,
				letterSpacing: "0.08em",
				textTransform: "uppercase",
				color: t.ink3,
				lineHeight: 1.5,
			},
			mono: { fontFamily: fontMono, fontVariantNumeric: "tabular-nums" },
			eyebrow: {
				fontFamily: fontMono,
				fontSize: 11,
				letterSpacing: "0.08em",
				textTransform: "uppercase",
				color: t.ink3,
			},
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						backgroundColor: t.paper2,
						color: t.ink,
						fontFeatureSettings: '"ss01", "cv11"',
						letterSpacing: "-0.005em",
						WebkitFontSmoothing: "antialiased",
						MozOsxFontSmoothing: "grayscale",
					},
					"::selection": { background: t.accentSoft, color: t.accentInk },
					"*": {
						scrollbarWidth: "thin",
						scrollbarColor: `${alpha(t.ink, 0.22)} transparent`,
					},
					"*::-webkit-scrollbar": { width: 10, height: 10 },
					"*::-webkit-scrollbar-track": { background: "transparent" },
					"*::-webkit-scrollbar-thumb": {
						backgroundColor: alpha(t.ink, 0.22),
						borderRadius: 8,
						border: "2px solid transparent",
						backgroundClip: "padding-box",
					},
					"*::-webkit-scrollbar-thumb:hover": { backgroundColor: alpha(t.ink, 0.36) },
					"*::-webkit-scrollbar-corner": { background: "transparent" },
				},
			},
			MuiTypography: {
				defaultProps: {
					variantMapping: { mono: "span", eyebrow: "div" },
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: { backgroundImage: "unset" },
				},
			},
			MuiButton: {
				defaultProps: { disableElevation: true },
				styleOverrides: {
					root: {
						borderRadius: radii.r2,
						fontWeight: 500,
						textTransform: "none",
						boxShadow: "none",
						gap: 8,
						transition: "background 120ms ease, border-color 120ms ease, color 120ms ease, transform 60ms ease",
						"&:active": { transform: "translateY(1px)" },
					},
				},
				variants: [
					{
						props: { variant: "solid" },
						style: {
							backgroundColor: t.ink,
							color: t.paper,
							border: `1px solid ${t.ink}`,
							"&:hover": { backgroundColor: alpha(t.ink, 0.85) },
							"&.Mui-disabled": { opacity: 0.4, color: t.paper },
						},
					},
					{
						props: { variant: "accent" },
						style: {
							backgroundColor: t.accent,
							color: "#FFFFFF",
							border: `1px solid ${t.accent2}`,
							"&:hover": { backgroundColor: t.accent2 },
							"&.Mui-disabled": { opacity: 0.4, color: "#FFFFFF" },
						},
					},
					{
						props: { variant: "soft" },
						style: {
							backgroundColor: t.paper,
							color: t.ink,
							border: `1px solid ${t.line}`,
							"&:hover": { backgroundColor: t.paper2 },
						},
					},
				],
			},
			MuiChip: {
				styleOverrides: {
					root: {
						borderRadius: 999,
						fontWeight: 500,
						fontFamily: fontMono,
						fontSize: 11,
						letterSpacing: "0.02em",
						height: 22,
						backgroundColor: t.paper2,
						border: `1px solid ${t.line}`,
						color: t.ink3,
					},
					label: { paddingLeft: 8, paddingRight: 8 },
				},
			},
			MuiDialog: {
				styleOverrides: {
					paper: {
						borderRadius: radii.r4,
						border: `1px solid ${t.line}`,
						boxShadow: t.shadowLg,
						backgroundImage: "unset",
					},
				},
			},
			MuiSwitch: {
				styleOverrides: {
					root: {
						width: 38,
						height: 22,
						padding: 0,
						display: "inline-flex",
					},
					switchBase: {
						padding: 2,
						"&.Mui-checked": {
							transform: "translateX(16px)",
							color: "#FFFFFF",
							"& + .MuiSwitch-track": { backgroundColor: t.accent, opacity: 1, borderColor: t.accent },
						},
					},
					thumb: {
						width: 16,
						height: 16,
						boxShadow: t.shadowSm,
						color: t.paper,
					},
					track: {
						borderRadius: 999,
						backgroundColor: t.paper3,
						border: `1px solid ${t.line}`,
						opacity: 1,
					},
				},
			},
			MuiTooltip: {
				styleOverrides: {
					tooltip: {
						backgroundColor: t.ink,
						color: t.paper,
						padding: "6px 10px",
						borderRadius: radii.r1,
						fontSize: 12,
						fontWeight: 500,
					},
					arrow: { color: t.ink },
				},
			},
			MuiDivider: {
				styleOverrides: { root: { borderColor: t.line } },
			},
		},
	});
}

const darkTheme = buildTheme("dark", darkTokens);
const lightTheme = buildTheme("light", lightTokens);

export const themes = {
	dark: darkTheme,
	light: lightTheme,
};

export type Themes = "dark" | "light";
export const getUrlTheme = (): Themes => (new URL(window.location.toString()).searchParams.get("theme") as Themes) || "dark";
export const getCurrentTheme = (theme: Themes): Theme => themes[theme];
