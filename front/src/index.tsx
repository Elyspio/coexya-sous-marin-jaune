import "reflect-metadata";
import React from "react";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "dayjs/locale/fr";
import { createRoot } from "react-dom/client";
import "./index.scss";
import { CssBaseline } from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { themes } from "./config/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DateProvider } from "@hooks/utils/useTime";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Application from "./view/components/Application";
import { QueryProvider } from "@/core/data/QueryProvider";
import { AuthProvider } from "@/core/data/auth/AuthContext";
import { useClientStore } from "@/core/store/clientStore";

dayjs.locale("fr");
dayjs.extend(relativeTime);

function Wrapper() {
	const current = useClientStore((s) => s.theme);
	const theme = current === "dark" ? themes.dark : themes.light;

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<DateProvider>
					<Application />
				</DateProvider>
				<ToastContainer theme={current} position={"top-right"} />
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

function App() {
	return (
		<QueryProvider>
			<AuthProvider>
				<Wrapper />
			</AuthProvider>
		</QueryProvider>
	);
}

createRoot(document.getElementById("root")!).render(<App />);
