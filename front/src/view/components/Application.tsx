import * as React from "react";
import "./Application.scss";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleTheme } from "../../store/module/theme/theme.action";
import { createDrawerAction, withDrawer } from "./utils/drawer/Drawer.hoc";
import { Box, Stack } from "@mui/material";
import { login, logout } from "../../store/module/authentication/authentication.action";
import { bindActionCreators } from "redux";
import { Orders } from "./orders/Orders";
import { EditOrder } from "./orders/EditOrder";
import { getBurgers } from "../../store/module/burgers/burgers.async.action";

function Application() {
	const dispatch = useAppDispatch();

	const { theme, themeIcon, logged, user } = useAppSelector((s) => ({
		theme: s.theme.current,
		themeIcon: s.theme.current === "dark" ? <Brightness5Icon /> : <Brightness3Icon />,
		logged: s.authentication.logged,
		user: s.orders.name,
	}));

	const storeActions = React.useMemo(() => bindActionCreators({ toggleTheme, logout, login }, dispatch), [dispatch]);

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
			}),
		);
	} else {
		actions.push(
			createDrawerAction("Login", {
				icon: <Login fill={"currentColor"} />,
				onClick: storeActions.login,
			}),
		);
	}


	React.useEffect(() => {
		dispatch(getBurgers());
	}, [dispatch]);


	const drawer = withDrawer({
		component: <Stack spacing={3} width={"100%"}>
			<Orders />
			<EditOrder />
		</Stack>,
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
