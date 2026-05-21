import { lazy, Suspense } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";

const Orders = lazy(() => import("@components/orders/Orders").then((module) => ({ default: module.Orders })));
const AuthCallback = lazy(() => import("@components/auth/AuthCallback").then((module) => ({ default: module.AuthCallback })));

const routes = (
	<>
		<Route
			index
			element={
				<Suspense fallback={null}>
					<Orders />
				</Suspense>
			}
		/>
		<Route
			path={"auth/callback"}
			element={
				<Suspense fallback={null}>
					<AuthCallback />
				</Suspense>
			}
		/>
	</>
);

export const router = createBrowserRouter(createRoutesFromElements(routes));
window.router = router;
