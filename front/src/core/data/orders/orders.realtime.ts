import type { QueryClient } from "@tanstack/react-query";
import type { Config, Order } from "@apis/backend/generated";
import { ordersCache } from "./orders.cache";
import { usersKeys } from "../users/users.keys";
import { configKeys } from "../config/config.keys";

export const ordersRealtime = {
	onOrderUpdated(qc: QueryClient, order: Order) {
		ordersCache.upsert(qc, order);
		void qc.invalidateQueries({ queryKey: usersKeys.list() });
	},
	onOrderDeleted(qc: QueryClient, id: Order["id"]) {
		ordersCache.remove(qc, id);
		void qc.invalidateQueries({ queryKey: usersKeys.list() });
	},
	onConfigUpdated(qc: QueryClient, config: Config) {
		qc.setQueryData(configKeys.current(), config);
	},
};
