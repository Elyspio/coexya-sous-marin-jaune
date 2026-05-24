import * as React from "react";
import { useMemo } from "react";
import { Button, Tooltip } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { canCreate } from "@/core/data/orders/orders.utils";
import { useClientStore } from "@/core/store/clientStore";
import { useConfig } from "@/core/data/config/config.queries";
import { useOrders } from "@/core/data/orders/orders.queries";
import { useCreateOrder } from "@/core/data/orders/orders.mutations";

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
		if (created === "no-name") return "Renseignez votre prénom";
		if (created === false) return "Vous avez déjà créé une commande aujourd'hui";
		if (created === "closed") return "Le restaurant est fermé aujourd'hui";
		return "";
	}, [created]);

	return (
		<Tooltip title={tooltip} arrow>
			<span>
				<Button variant="accent" startIcon={<Add />} disabled={!!tooltip} onClick={createOrderOnClick}>
					Nouvelle commande
				</Button>
			</span>
		</Tooltip>
	);
}
