import React, { useMemo } from "react";
import { Button, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../store";
import dayjs from "dayjs";
import { Order } from "../../../../core/apis/backend/generated";
import { createOrder } from "../../../../store/module/orders/orders.async.action";
import { canCreateSelector } from "../../../../store/module/orders/orders.utils";
import { useIsSmallScreen } from "../../../hooks/useBreakpoint";

export const isToday = (order: Order) => dayjs().startOf("day").isSame(dayjs(order.date).startOf("day"));

export function CreateOrder() {
	const { created } = useAppSelector(s => {
		return {
			created: canCreateSelector(s),
		};
	});

	const dispatch = useAppDispatch();

	const createOrderOnClick = React.useCallback(() => {
		dispatch(createOrder());
	}, [dispatch]);

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
