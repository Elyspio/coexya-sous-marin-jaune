import * as React from "react";
import { useEffect } from "react";
import { Box } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "@/view/router/routes";
import { useClientStore } from "@/core/store/clientStore";
import { useInitApp } from "@/core/data/init/useInitApp";
import { Topbar } from "./utils/topbar/Topbar";
import { Modals } from "./modals/Modals";

function Application() {
	const theme = useClientStore((s) => s.theme);

	useInitApp();

	useEffect(() => {
		document.body.parentElement!.className = theme;
	}, [theme]);

	return (
		<Box
			sx={{
				height: "100vh",
				display: "grid",
				gridTemplateRows: "64px 1fr",
				overflow: "hidden",
				bgcolor: "background.default",
			}}
		>
			<Topbar />
			<Box component="main" sx={{ overflow: "hidden", position: "relative" }}>
				<RouterProvider router={router} />
				<Modals />
			</Box>
		</Box>
	);
}

export default Application;
