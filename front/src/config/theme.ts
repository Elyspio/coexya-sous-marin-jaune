import { createTheme, Theme } from "@mui/material";
import * as colors from "@mui/material/colors";
import { PaletteOptions } from "@mui/material/styles/createPalette";

function withPalette(palette: PaletteOptions) {
	return createTheme({
		palette,
		components: {
			MuiPaper: {
				styleOverrides: {
					root: {
						"&.MuiPaper-root": {
							backgroundImage: "unset !important",
						},
					},
				},
			},
			MuiTooltip: {
				styleOverrides: {
					tooltip: ({ theme }) => ({
						backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : "gray",
						padding: 9,
						border: `${theme.palette.divider} 1px solid`,
						fontSize: 12,
					}),
				},
			},
		},
	});
}

const darkTheme = withPalette({
	mode: "dark",
	secondary: {
		main: "#69ec6b",
	},
	primary: {
		main: colors.blue["400"],
	},
	background: {
		paper: "#1d1d1d",
		default: "#181818",
	},
	divider: "#FFFFFF1E",
});

const lightTheme = withPalette({
	mode: "light",
	secondary: {
		main: colors.amber["800"],
	},
	primary: {
		...colors.blue,
		main: colors.blue["500"],
	},
	background: {
		paper: "#ffffff",
		default: "#e6e6e6",
	},
	divider: "#FFFFFF1E",
});

export const themes = {
	dark: darkTheme,
	light: lightTheme,
};

export type Themes = "dark" | "light";
export const getUrlTheme = (): Themes => new URL(window.location.toString()).searchParams.get("theme") || ("dark" as any);

export const getCurrentTheme = (theme: Themes): Theme => themes[theme];
