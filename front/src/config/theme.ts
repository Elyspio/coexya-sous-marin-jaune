import { createTheme, Theme } from "@mui/material";
import * as colors from "@mui/material/colors";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
		secondary: {
			...colors.grey,
			main: colors.amber["500"],
		},
		primary: {
			main: colors.blue["800"],
		},
		background: {
			paper: "#1d1d1d",
			default: "#181818",
		},
		divider: "#FFFFFF1E",
	},
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
	},
});

const lightTheme = createTheme({
	palette: {
		mode: "light",
		secondary: {
			...colors.grey,
			main: colors.grey["900"],
		},
		primary: {
			...colors.blue,
			main: colors.blue["100"],
		},
		background: {
			paper: "#ffffff",
			default: "#e6e6e6",
		},
		divider: "#FFFFFF1E",
	},
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
	},
});

export const themes = {
	dark: darkTheme,
	light: lightTheme,
};

export type Themes = "dark" | "light";
export const getUrlTheme = (): Themes => new URL(window.location.toString()).searchParams.get("theme") || ("dark" as any);

export const getCurrentTheme = (theme: Themes): Theme => themes[theme];
