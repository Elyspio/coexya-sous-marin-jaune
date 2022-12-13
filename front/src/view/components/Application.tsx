import * as React from "react";
import "./Application.scss";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleTheme } from "../../store/module/theme/theme.action";
import { createDrawerAction, createDrawerDivider, withDrawer } from "./utils/drawer/Drawer.hoc";
import { Box, Container } from "@mui/material";
import { login, logout } from "../../store/module/authentication/authentication.action";
import { bindActionCreators } from "redux";
import { Orders } from "./orders/Orders";
import { getOrders, startOrderUpdateSynchro } from "../../store/module/orders/orders.async.action";
import { getBurgers } from "../../store/module/burgers/burgers.async.action";
import { DarkMode, LightMode, Merge, Message } from "@mui/icons-material";
import { toggleModal } from "../../store/module/workflow/workflow.action";
import { Modals } from "./modals/Modals";

function Application() {
	const dispatch = useAppDispatch();

	const { theme, themeIcon, logged, modals } = useAppSelector(s => ({
		theme: s.theme.current,
		themeIcon: s.theme.current === "light" ? <DarkMode /> : <LightMode />,
		logged: s.authentication.logged,
		modals: s.workflow.modals,
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
			onClick: storeActions.toggleTheme,
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

	if (logged) {
		actions.push(createDrawerDivider("Admin"));

		actions.push(
			createDrawerAction("Merge Users", {
				icon: <Merge />,
				onClick: () => storeActions.toggleModal("mergeUsers"),
			})
		);
	}

	React.useEffect(() => {
		dispatch(startOrderUpdateSynchro());
		dispatch(getBurgers());
		dispatch(getOrders());
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

	return (
		<Box className={"Application"} bgcolor={"background.default"}>
			{drawer}
		</Box>
	);
}

export default Application;
