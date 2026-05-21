import { useQuery } from "@tanstack/react-query";
import { service } from "../api/services";
import { ConfigService } from "@services/config.service";
import { configKeys } from "./config.keys";
import type { Config, ConfigBase } from "@apis/backend/generated";

const DEFAULT: ConfigBase = {
	kitchenOpened: false,
	paymentEnabled: false,
};

export function useConfig(): ConfigBase {
	const query = useQuery<Config>({
		queryKey: configKeys.current(),
		queryFn: () => service(ConfigService).get(),
	});
	return query.data ?? DEFAULT;
}
