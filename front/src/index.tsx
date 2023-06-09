import "reflect-metadata";
import React from "react";
import "dayjs/locale/fr";
import { createRoot } from "react-dom/client";
import "./index.scss";
import { Provider } from "react-redux";
import store, { useAppSelector } from "@store";
import { CssBaseline } from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { themes } from "./config/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Provider as DiProvider } from "inversify-react";
import { container } from "@/core/di";
import { DateProvider } from "@hooks/utils/useTime";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Application from "./view/components/Application";

dayjs.locale("fr"); // use locale globally
dayjs.extend(relativeTime);

function Wrapper() {
	const { theme, current } = useAppSelector((state) => ({
		theme: state.theme.current === "dark" ? themes.dark : themes.light,
		current: state.theme.current,
	}));

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
		<DiProvider container={container}>
			<Provider store={store}>
				<Wrapper />
			</Provider>
		</DiProvider>
	);
}

createRoot(document.getElementById("root")!).render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
