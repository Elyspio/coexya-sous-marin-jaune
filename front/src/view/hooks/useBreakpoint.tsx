import { Breakpoint, useMediaQuery, useTheme } from "@mui/material";

export function useBreakpoint(breakpoint: Breakpoint, mode: "up" | "down" = "up") {
	const theme = useTheme();

	return useMediaQuery(theme.breakpoints[mode](breakpoint));
}
