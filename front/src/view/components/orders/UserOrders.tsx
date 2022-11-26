import React from "react";
import { Button, Stack, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store";
import dayjs from "dayjs";
import { Order } from "../../../core/apis/backend/generated";
import { createOrder } from "../../../store/module/orders/orders.async.action";
import { canCreateSelector } from "../../../store/module/orders/orders.utils";

export const isToday = (order: Order) => dayjs().startOf("day").isSame(dayjs(order.date).startOf("day"));

export function UserOrders() {

	const { created } = useAppSelector(s => {

		return ({
			created: !canCreateSelector(s),
		});
	});

	const dispatch = useAppDispatch();

	const createOrderOnClick = React.useCallback(() => {
		dispatch(createOrder());
	}, [dispatch]);

	return (
		<Stack spacing={2}>
			<Stack direction={"row"} spacing={1} alignItems={"center"}>
				<Tooltip title={created ? "Vous avez déjà créé une commande aujourd'hui" : ""} placement={"right"}>
					<div>
						<Button variant={"outlined"} color={created ? "inherit" : "success"} disabled={created}
								onClick={createOrderOnClick}>Nouvelle commande</Button>
					</div>
				</Tooltip>

			</Stack>
		</Stack>
	);
}


