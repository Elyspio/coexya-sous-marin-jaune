import React from "react";
import { ButtonGroup, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store";
import dayjs from "dayjs";
import { Order } from "../../../core/apis/backend/generated";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { createOrder, deleteOrder, getOrders } from "../../../store/module/orders/orders.async.action";
import DeleteIcon from "@mui/icons-material/Delete";
import BuildIcon from "@mui/icons-material/Build";
import { setAlteringOrder } from "../../../store/module/orders/orders.action";

const isToday = (order: Order) => dayjs().startOf("day").isSame(dayjs(order.date).startOf("day"));

export function OldOrders() {

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

	return (
		<Stack spacing={2}>
			<Stack direction={"row"} spacing={1} alignItems={"center"}>
				<Typography variant={"overline"} fontSize={"100%"}>Vos commandes </Typography>
				<Tooltip title={created ? "Vous avez déjà créé une commande pour aujourd'hui" : ""} placement={"right"}>
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
			{orders.length === 0 && <Typography>Vous n'avez pas d'ancienne commande</Typography>}
			<Stack spacing={2} p={2}>
				{orders.map(order => <OrderItem key={order.id} data={order} />)}
			</Stack>

		</Stack>
	);
}


function OrderItem({ data }: { data: Order }) {

	const dispatch = useAppDispatch();

	const edit = React.useCallback(() => {
		dispatch(setAlteringOrder(data.id));
	}, [data]);

	const del = React.useCallback(() => {
		dispatch(deleteOrder(data.id));
	}, [data]);


	const fritesElem = React.useMemo(() => {
		if (!data.fries) return null;
		let sauces = data.fries.sauces.join(", ");
		return <Typography>frites {sauces.length ? `(${sauces})` : ""}</Typography>;
	}, [data.fries]);

	return <Stack direction={"row"} alignItems={"center"} spacing={2}>
		<Typography>
			{dayjs(data.date).format("DD/MM/YYYY")}
		</Typography>
		<Typography>
			{data.burgers.map(o => o.name).join(", ")}
		</Typography>

		<Stack direction={"row"} spacing={2}>
			{fritesElem}
			{data.drink && <Typography>{data.drink}</Typography>}
			{data.dessert && <Typography>{data.dessert}</Typography>}
		</Stack>

		<ButtonGroup variant="outlined">
			{isToday(data) && <IconButton onClick={edit}>
				<BuildIcon color={"primary"} />
			</IconButton>}
			{<IconButton onClick={del}>
				<DeleteIcon color={"error"} />
			</IconButton>}
		</ButtonGroup>


	</Stack>;
}