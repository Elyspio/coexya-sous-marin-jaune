import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import { Orders } from "@components/orders/Orders";
import { AuthCallback } from "@components/auth/AuthCallback";

const routes = (
	<>
		<Route index element={<Orders />} />
		<Route path={"auth/callback"} element={<AuthCallback />} />
	</>
);

export const router = createBrowserRouter(createRoutesFromElements(routes));
window.router = router;
