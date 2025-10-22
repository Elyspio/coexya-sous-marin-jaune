import * as React from "react";
import { useEffect, useMemo } from "react";
import "./Application.scss";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "@store";
import { toggleTheme } from "@modules/theme/theme.action";
import { createDrawerAction, createDrawerDivider, withDrawer } from "./utils/drawer/Drawer.hoc";
import { Box, Container } from "@mui/material";
import { login, logout } from "@modules/authentication/authentication.async.action";
import { bindActionCreators } from "redux";
import { AccountBalance, DarkMode, LightMode, Merge, Message, Settings } from "@mui/icons-material";
import { toggleModal } from "@modules/workflow/workflow.action";
import { Modals } from "./modals/Modals";
import { SousMarinJauneRole } from "@apis/authentication/generated";
import { initApp } from "@modules/workflow/workflow.async.action";
import { RouterProvider } from "react-router-dom";
import { router } from "@/view/router/routes"; // selon version

function Application() {
	const dispatch = useAppDispatch();

	const theme = useAppSelector((s) => s.theme.current);
	const themeIcon = useMemo(() => (theme === "light" ? <DarkMode /> : <LightMode />), [theme]);
	const auth = useAppSelector((s) => s.authentication);

	const storeActions = React.useMemo(
		() =>
			bindActionCreators(
				{
					toggleTheme,
					logout,
					login,
					toggleModal,
				},
				dispatch
			),
		[dispatch]
	);

	const actions = [
		createDrawerAction(theme === "dark" ? "Light Mode" : "Dark Mode", {
			icon: themeIcon,
			onClick: () => storeActions.toggleTheme(),
		}),
	];

	if (auth.logged) {
		actions.push(
			createDrawerAction("Logout", {
				icon: <Logout fill={"currentColor"} />,
				onClick: () => storeActions.logout(),
			})
		);
	} else {
		actions.push(
			createDrawerAction("Login", {
				icon: <Login fill={"currentColor"} />,
				onClick: () => storeActions.login(),
			})
		);
	}

	actions.push(
		createDrawerAction("Message", {
			icon: <Message />,
			onClick: () => {
				storeActions.toggleModal("message");
			},
		})
	);

	if (auth.permissions?.role == SousMarinJauneRole.Admin) {
		actions.push(
			createDrawerDivider("Admin"),
			createDrawerAction("Merge Users", {
				icon: <Merge />,
				onClick: () => storeActions.toggleModal("mergeUsers"),
			}),
			createDrawerAction("Balances", {
				icon: <AccountBalance />,
				onClick: () => storeActions.toggleModal("balances"),
			}),
			createDrawerAction("Config", {
				icon: <Settings />,
				onClick: () => storeActions.toggleModal("updateConfig"),
			})
		);
	}

	React.useEffect(() => {
		dispatch(initApp());
	}, [dispatch]);

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
