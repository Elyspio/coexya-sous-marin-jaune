import React, { useMemo } from "react";
import { Button, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { Order } from "@apis/backend/generated";
import { useIsSmallScreen } from "@hooks/utils/useBreakpoint";
import { canCreate } from "@/core/data/orders/orders.utils";
import { useClientStore } from "@/core/store/clientStore";
import { useConfig } from "@/core/data/config/config.queries";
import { useOrders } from "@/core/data/orders/orders.queries";
import { useCreateOrder } from "@/core/data/orders/orders.mutations";

export const isToday = (order: Order) => dayjs().startOf("day").isSame(dayjs(order.date).startOf("day"));

export function CreateOrder() {
	const orderName = useClientStore((s) => s.orderName);
	const config = useConfig();
	const orders = useOrders();
	const { mutate: create } = useCreateOrder();

	const created = useMemo(() => canCreate(orderName, !!config.kitchenOpened, orders), [orderName, config.kitchenOpened, orders]);

	const createOrderOnClick = React.useCallback(() => {
		if (!orderName) return;
		create(orderName);
	}, [create, orderName]);

	const tooltip = useMemo(() => {
		if (created === false) return "Vous avez déjà créé une commande aujourd'hui";
		if (created === "closed") return "Le restaurant est fermé aujourd'hui";

		return "";
	}, [created]);

	const isSmall = useIsSmallScreen();

	return (
		<Tooltip title={tooltip} arrow placement={isSmall ? "bottom" : "right"}>
			<div>
				<Button variant={"outlined"} color={tooltip === "" ? "inherit" : "success"} disabled={!!tooltip} onClick={createOrderOnClick}>
					Nouvelle commande
				</Button>
			</div>
		</Tooltip>
	);
}
