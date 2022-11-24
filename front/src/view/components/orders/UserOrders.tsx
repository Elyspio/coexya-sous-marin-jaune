import React from "react";
import { ButtonGroup, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store";
import dayjs from "dayjs";
import { Order } from "../../../core/apis/backend/generated";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { createOrder, deleteOrder, duplicateOrder, getOrders } from "../../../store/module/orders/orders.async.action";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { setAlteringOrder } from "../../../store/module/orders/orders.action";
import { OrderItem } from "./OrderItem";

export const isToday = (order: Order) => dayjs().startOf("day").isSame(dayjs(order.date).startOf("day"));

export function UserOrders() {

	const { user, orders, created } = useAppSelector(s => {
		let name = s.orders.name;
		let userOrders = Object.values(s.orders.all).filter(order => order.user === name);

		return ({
			user: name,
			orders: userOrders,
			created: userOrders.some(isToday),
		});
	});

	const dispatch = useAppDispatch();

	React.useEffect(() => {
		dispatch(getOrders());
	}, [dispatch]);


	const createOrderOnClick = React.useCallback(() => {
		dispatch(createOrder());
	}, [dispatch]);

	const ordersSorted = React.useMemo(() => [...orders].sort((o1, o2) => dayjs(o1.date).isBefore(o2.date) ? -1 : 1), [orders]);



	return (
		<Stack spacing={2}>
			<Stack direction={"row"} spacing={1} alignItems={"center"}>
				<Typography variant={"overline"} fontSize={"100%"}>Vos commandes </Typography>
				<Tooltip title={created ? "Vous avez déjà créé une commande aujourd'hui" : ""} placement={"right"}>
					<div>
						<IconButton size={"small"} sx={{ p: 0 }} disabled={created} onClick={createOrderOnClick}>
							<AddCircleOutlineIcon
								sx={{ width: 40, height: 40 }}
								color={created ? "disabled" : "primary"}
							/>
						</IconButton>
					</div>
				</Tooltip>

			</Stack>
			{ordersSorted.length === 0 && <Typography>Vous n'avez pas d'ancienne commande</Typography>}
			<Stack spacing={2} p={2}>
				{ordersSorted.map(order => <OrderItem key={order.id} data={order} show={{date: true, edit: isToday(order), del: isToday(order), duplicate: !created}} />)}
			</Stack>

		</Stack>
	);
}


