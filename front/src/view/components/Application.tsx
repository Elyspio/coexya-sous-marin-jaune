import * as React from "react";
import { useEffect } from "react";
import "./Application.scss";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleTheme } from "../../store/module/theme/theme.action";
import { createDrawerAction, createDrawerDivider, withDrawer } from "./utils/drawer/Drawer.hoc";
import { Box, Container } from "@mui/material";
import { login, logout } from "../../store/module/authentication/authentication.async.action";
import { bindActionCreators } from "redux";
import { Orders } from "./orders/Orders";
import { AccountBalance, DarkMode, LightMode, Merge, Message, Settings } from "@mui/icons-material";
import { toggleModal } from "../../store/module/workflow/workflow.action";
import { Modals } from "./modals/Modals";
import { initApp } from "../../store/common/common.actions";
import { SousMarinJauneRole } from "../../core/apis/authentication/generated";

function Application() {
	const dispatch = useAppDispatch();

	const { theme, themeIcon, logged, loggedUser } = useAppSelector(s => ({
		theme: s.theme.current,
		themeIcon: s.theme.current === "light" ? <DarkMode /> : <LightMode />,
		logged: s.authentication.logged,
		loggedUser: s.authentication.user,
	}));

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

	if (logged) {
		actions.push(
			createDrawerAction("Logout", {
				icon: <Logout fill={"currentColor"} />,
				onClick: storeActions.logout,
			})
		);
	} else {
		actions.push(
			createDrawerAction("Login", {
				icon: <Login fill={"currentColor"} />,
				onClick: storeActions.login,
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

	if (loggedUser?.authorizations?.sousMarinJaune?.roles.includes(SousMarinJauneRole.Admin)) {
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
				<Orders />
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
