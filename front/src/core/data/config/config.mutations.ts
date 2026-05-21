import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { service } from "../api/services";
import { ConfigService } from "@services/config.service";
import { configKeys } from "./config.keys";
import { extractApiError } from "../api/extractError";
import type { ConfigBase } from "@apis/backend/generated";

export function useUpdateConfig() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (config: ConfigBase) => {
			const promise = service(ConfigService).update(config);
			await toast.promise(promise, {
				success: "Config mise à jour",
				error: "Erreur lors de la mise à jour de la config",
				pending: "Mise à jour de la config",
			});
			return promise;
		},
		onError: (e) => {
			toast.error(extractApiError(e, "Mise à jour de la config impossible."));
		},
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: configKeys.current() });
		},
	});
}
