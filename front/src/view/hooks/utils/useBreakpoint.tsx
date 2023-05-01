import useMediaQuery from "@mui/material/useMediaQuery";
import { Breakpoint, useTheme } from "@mui/material/styles";

export function useBreakpoint(breakpoint: Breakpoint, mode: "up" | "down" = "up") {
	const theme = useTheme();

	return useMediaQuery(theme.breakpoints[mode](breakpoint));
}

export function useIsSmallScreen() {
	return useBreakpoint("sm", "down");
}
