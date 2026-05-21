import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30_000,
			gcTime: 5 * 60_000,
			refetchOnWindowFocus: true,
			retry: (failureCount, error) => {
				if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
					return false;
				}
				return failureCount < 2;
			},
		},
		mutations: {
			retry: 0,
		},
	},
});
