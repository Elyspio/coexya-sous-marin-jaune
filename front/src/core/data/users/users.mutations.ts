import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { service } from "../api/services";
import { UserService } from "@services/user.service";
import { usersKeys } from "./users.keys";
import { extractApiError } from "../api/extractError";

type MergeUsersPayload = {
	nextName: string;
	users: string[];
};

export function useMergeUsers() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ nextName, users }: MergeUsersPayload) => {
			const promise = service(UserService).merge(nextName, users);
			await toast.promise(promise, {
				success: "Merge terminé",
			});
			return promise;
		},
		onError: (e) => {
			toast.error(extractApiError(e, "Merge impossible."));
		},
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: usersKeys.list() });
		},
	});
}
