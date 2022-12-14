import React, { useEffect, useMemo } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Tooltip, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { OrderFries } from "../../burgers/Record/OrderFries";
import { OrderDrink } from "../../burgers/Record/OrderDrink";
import { OrderDessert } from "../../burgers/Record/OrderDessert";
import { createOrderRecord, setAlteringOrder } from "../../../../store/module/orders/orders.action";
import { EditBurgerRecord } from "../../burgers/Record/EditBurgerRecord";
import { deleteOrder, updateRemoteOrder } from "../../../../store/module/orders/orders.async.action";
import { isToday } from "../list/CreateOrder";
import { OrderStudent } from "../../burgers/Record/OrderStudent";
import { BurgerItem } from "./BurgerItem";

export function EditOrder() {
	const { order, recordIndex, creating } = useAppSelector(state => {
		let orderId = state.orders.altering?.order;
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

	const close = React.useCallback(() => dispatch(setAlteringOrder()), []);

	const deleteOrderFn = React.useCallback(() => {
		if (creating) {
			dispatch(deleteOrder(order.id));
		}
		close();
	}, [creating, order, close]);

	const updateOrderFn = React.useCallback(() => {
		dispatch(updateRemoteOrder());
		close();
	}, [dispatch, close]);

	const canValidate = useMemo(() => order && (order.burgers?.length === 0 || (order.student && (!order.fries || !order.drink))), [order]);

	const validateTooltip = useMemo(() => {
		if (!order) return "";

		// Burgers
		if (!order.burgers.length) return "Vous devez prendre au moins un burger";

		// Etudiant
		if (!order.student) return "";
		if (!order.fries) return "Vous devez prendre des frites";
		if (!order.drink) return "Vous devez prendre une boisson";

		return "";
	}, [order]);

	useEffect(() => {
		if (order?.burgers.length === 0) addRecord();
	}, [order, dispatch, addRecord]);

	if (!order) return null;

	return (
		<Dialog open={Boolean(order)} onClose={deleteOrderFn}>
			<DialogTitle>{isToday(order) ? "Création" : "Modification"} de votre commande</DialogTitle>
			<DialogContent dividers>
				<Stack spacing={2} px={2} minWidth={350}>
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

					<Typography variant={"overline"}>Menu</Typography>

					<OrderStudent data={order} />
					<OrderFries data={order} />
					<OrderDrink data={order} />
					<OrderDessert data={order} />
				</Stack>

				{recordIndex !== undefined && <EditBurgerRecord />}
			</DialogContent>
			<DialogActions>
				<Stack direction={"row"} spacing={2} p={1}>
					<Button color={"inherit"} variant={"outlined"} onClick={deleteOrderFn}>
						Fermer
					</Button>
					<Tooltip title={validateTooltip}>
						<span>
							<Button color={"success"} variant={"contained"} onClick={updateOrderFn} disabled={canValidate}>
								Valider {order.price}€
							</Button>
						</span>
					</Tooltip>
				</Stack>
			</DialogActions>
		</Dialog>
	);
}
