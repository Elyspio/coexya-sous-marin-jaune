import { useAppDispatch, useAppSelector } from "@store";
import React, { useEffect } from "react";
import { createOrderRecord, setAlteringOrder } from "@modules/orders/orders.action";
import { deleteOrder } from "@modules/orders/orders.async.action";
import { Box, Button, Stack, Typography } from "@mui/material";
import { BurgerItem } from "./BurgerItem";
import { OrderStudent } from "../../burgers/Record/OrderStudent";
import { OrderFries } from "../../burgers/Record/OrderFries";
import { OrderDrink } from "../../burgers/Record/OrderDrink";
import { EditBurgerRecord } from "../../burgers/Record/EditBurgerRecord";

export function EditMenuOrder() {
	const { order, recordIndex, creating } = useAppSelector((state) => {
		const orderId = state.orders.altering?.order;
		return {
			order: state.orders.all[orderId!],
			recordIndex: state.orders.altering?.record,
			creating: state.orders.mode.order === "create",
		};
	});

	const dispatch = useAppDispatch();

	const addRecord = React.useCallback(() => {
		dispatch(createOrderRecord());
	}, [dispatch]);

	const close = React.useCallback(() => dispatch(setAlteringOrder()), [dispatch]);

	React.useCallback(() => {
		if (creating) {
			dispatch(deleteOrder(order.id));
		}
		close();
	}, [creating, close, dispatch, order?.id]);

	useEffect(() => {
		if (order?.burgers.length === 0) addRecord();
	}, [order, dispatch, addRecord]);

	if (!order) return null;

	return (
		<>
			<Stack height={"100%"} px={2} minWidth={450} direction={"column"} justifyContent={"space-around"}>
				<Box>
					<Stack direction={"row"} spacing={3}>
						<Typography variant={"overline"}>Burgers </Typography>
					</Stack>
					<Box bgcolor={"background.default"} pl={2} borderRadius={4}>
						<Stack p={1} m={1} spacing={1} alignItems={"center"}>
							{order.burgers.map((burger, i) => (
								<BurgerItem data={burger} key={i} index={i} />
							))}
							<Button variant={"outlined"} sx={{ width: 100 }} color={"secondary"} size={"small"} onClick={addRecord}>
								Ajouter
							</Button>
						</Stack>
					</Box>
				</Box>

				<Stack spacing={1}>
					<Typography variant={"overline"}>Menu</Typography>

					<OrderStudent data={order} />
					<OrderFries data={order} />
					<OrderDrink data={order} />
				</Stack>
			</Stack>

			{recordIndex !== undefined && <EditBurgerRecord />}
		</>
	);
}
