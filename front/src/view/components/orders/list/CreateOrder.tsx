import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import Add from "@mui/icons-material/Add";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { canCreate } from "@/core/data/orders/orders.utils";
import { useClientStore } from "@/core/store/clientStore";
import { useConfig } from "@/core/data/config/config.queries";
import { useOrders, useOrderCreationInfo } from "@/core/data/orders/orders.queries";
import { useCreateOrder } from "@/core/data/orders/orders.mutations";
import { DeferOrderDialog } from "@/view/components/modals/DeferOrderDialog";

export function CreateOrder() {
	const orderName = useClientStore((s) => s.orderName);
	const config = useConfig();
	const orders = useOrders();
	const creationInfo = useOrderCreationInfo();
	const { mutate: create, isPending } = useCreateOrder();

	const [deferOpen, setDeferOpen] = useState(false);

	const created = useMemo(
		() => canCreate(orderName, !!config.kitchenOpened, orders, creationInfo?.plannedDate),
		[orderName, config.kitchenOpened, orders, creationInfo?.plannedDate],
	);

	const closeDefer = useCallback(() => setDeferOpen(false), []);

	const confirmDefer = useCallback(() => {
		if (!orderName) return;
		create(
			{ user: orderName, acceptDefer: true },
			{
				onSuccess: () => setDeferOpen(false),
			},
		);
	}, [create, orderName]);

	const createOrderOnClick = useCallback(() => {
		if (!orderName) return;
		if (creationInfo?.deferred) {
			setDeferOpen(true);
			return;
		}
		create({ user: orderName });
	}, [create, orderName, creationInfo?.deferred]);

	const tooltip = useMemo(() => {
		if (created === "no-name") return "Renseignez votre prénom";
		if (created === false) return "Vous avez déjà créé une commande aujourd'hui";
		if (created === "already-planned" && creationInfo?.plannedDate)
			return `Vous avez déjà une commande pour ${dayjs(creationInfo.plannedDate).locale("fr").format("dddd D MMMM")}`;
		if (created === "closed") return "Le restaurant est fermé aujourd'hui";
		return "";
	}, [created, creationInfo?.plannedDate]);

	return (
		<>
			<Tooltip title={tooltip} arrow>
				<span>
					<Button variant="accent" startIcon={<Add />} disabled={!!tooltip} onClick={createOrderOnClick}>
						Nouvelle commande
					</Button>
				</span>
			</Tooltip>
			<DeferOrderDialog open={deferOpen} plannedDate={creationInfo?.plannedDate} onCancel={closeDefer} onConfirm={confirmDefer} pending={isPending} />
		</>
	);
}
