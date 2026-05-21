import { useTime } from "@hooks/utils/useTime";
import { useIsAdmin } from "@hooks/permissions/useIsAdmin";
import { useMemo } from "react";
import { lastTime } from "@/core/data/orders/orders.utils";
import { useClientStore } from "@/core/store/clientStore";

export function useCanCreateOrder() {
	const user = useClientStore((s) => s.orderName);

	const now = useTime();

	const isAdmin = useIsAdmin();

	const tooLate = useMemo(() => now.isAfter(lastTime), [now]);

	return useMemo(() => user && (!tooLate || isAdmin), [user, tooLate, isAdmin]);
}
