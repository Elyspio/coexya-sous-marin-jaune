import { useTime } from "@hooks/utils/useTime";
import { useRole } from "@hooks/permissions/useRole";
import { SousMarinJauneRole } from "@apis/authentication/generated";
import { useMemo } from "react";
import { lastTime } from "@/core/data/orders/orders.utils";
import { useClientStore } from "@/core/store/clientStore";

export function useCanCreateOrder() {
	const user = useClientStore((s) => s.orderName);

	const now = useTime();

	const isAdmin = useRole(SousMarinJauneRole.Admin);

	const tooLate = useMemo(() => now.isAfter(lastTime), [now]);

	return useMemo(() => user && (!tooLate || isAdmin), [user, tooLate, isAdmin]);
}
