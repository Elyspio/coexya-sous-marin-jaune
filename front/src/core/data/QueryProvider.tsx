import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, ReactNode, Suspense } from "react";
import { queryClient } from "./queryClient";

const ReactQueryDevtools =
	process.env.NODE_ENV !== "production" ? lazy(() => import("@tanstack/react-query-devtools").then((module) => ({ default: module.ReactQueryDevtools }))) : undefined;

export function QueryProvider({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{ReactQueryDevtools && (
				<Suspense fallback={null}>
					<ReactQueryDevtools initialIsOpen={false} buttonPosition={"bottom-left"} />
				</Suspense>
			)}
		</QueryClientProvider>
	);
}
