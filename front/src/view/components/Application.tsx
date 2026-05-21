import * as React from "react";
import { useEffect, useMemo } from "react";
import "./Application.scss";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import { createDrawerAction, createDrawerDivider, withDrawer } from "./utils/drawer/Drawer.hoc";
import { Box, Container } from "@mui/material";
import { AccountBalance, DarkMode, LightMode, Merge, Message, Settings } from "@mui/icons-material";
import { Modals } from "./modals/Modals";
import { RouterProvider } from "react-router-dom";
import { router } from "@/view/router/routes";
import { useClientStore } from "@/core/store/clientStore";
import { useAuth } from "@/core/data/auth/AuthContext";
import { useIsAdmin } from "@hooks/permissions/useIsAdmin";
import { useInitApp } from "@/core/data/init/useInitApp";

function Application() {
	const theme = useClientStore((s) => s.theme);
	const toggleTheme = useClientStore((s) => s.toggleTheme);
	const toggleModal = useClientStore((s) => s.toggleModal);
	const themeIcon = useMemo(() => (theme === "light" ? <DarkMode /> : <LightMode />), [theme]);

	const { logged, login, logout } = useAuth();
	const isAdmin = useIsAdmin();

	useInitApp();

	const actions = [
		createDrawerAction(theme === "dark" ? "Light Mode" : "Dark Mode", {
			icon: themeIcon,
			onClick: toggleTheme,
		}),
	];

	if (logged) {
		actions.push(
			createDrawerAction("Logout", {
				icon: <Logout fill={"currentColor"} />,
				onClick: () => void logout(),
			}),
		);
	} else {
		actions.push(
			createDrawerAction("Login", {
				icon: <Login fill={"currentColor"} />,
				onClick: () => void login(),
			}),
		);
	}

	actions.push(
		createDrawerAction("Message", {
			icon: <Message />,
			onClick: () => toggleModal("message"),
		}),
	);

	if (isAdmin) {
		actions.push(
			createDrawerDivider("Admin"),
			createDrawerAction("Merge Users", {
				icon: <Merge />,
				onClick: () => toggleModal("mergeUsers"),
			}),
			createDrawerAction("Balances", {
				icon: <AccountBalance />,
				onClick: () => toggleModal("balances"),
			}),
			createDrawerAction("Config", {
				icon: <Settings />,
				onClick: () => toggleModal("updateConfig"),
			}),
		);
	}

	const drawer = withDrawer({
		component: (
			<Container maxWidth={"xl"} className={"Container"}>
				<RouterProvider router={router}></RouterProvider>
				<Modals />
			</Container>
		),
		actions,
		title: "Sous-marin Jaune V2",
	});

	useEffect(() => {
		document.body.parentElement!.className = theme;
	}, [theme]);

	return (
		<Box className={`Application`} bgcolor={"background.default"}>
			{drawer}
		</Box>
	);
}

export default Application;
