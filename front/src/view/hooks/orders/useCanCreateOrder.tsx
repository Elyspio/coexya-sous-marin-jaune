import { useAppSelector } from "@store";
import { useTime } from "@hooks/utils/useTime";
import { useRole } from "@hooks/permissions/useRole";
import { SousMarinJauneRole } from "@apis/authentication/generated";
import { useMemo } from "react";
import { lastTime } from "@modules/orders/orders.utils";

export function useCanCreateOrder() {
	const user = useAppSelector((s) => s.orders.name);

	const now = useTime();

	const isAdmin = useRole(SousMarinJauneRole.Admin);

	const tooLate = useMemo(() => now.isAfter(lastTime), [now]);

	return useMemo(() => user && (!tooLate || isAdmin), [user, tooLate, isAdmin]);
}
