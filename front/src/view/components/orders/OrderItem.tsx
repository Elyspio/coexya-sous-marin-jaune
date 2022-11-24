import { Order } from "../../../core/apis/backend/generated";
import { useAppDispatch, useAppSelector } from "../../../store";
import React from "react";
import { setAlteringOrder } from "../../../store/module/orders/orders.action";
import { deleteOrder, duplicateOrder } from "../../../store/module/orders/orders.async.action";
import { ButtonGroup, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { isToday } from "./AllOrders";



export function OrderItem({ data, show}: { data: Order, show: { name?: boolean, date?: boolean, edit?: boolean, del?: boolean, duplicate?: boolean } }) {

	const { created } = useAppSelector(s => {
		let name = s.orders.name;
		let userOrders = Object.values(s.orders.all).filter(order => order.user === name);
		return ({
			created: userOrders.some(isToday),
		});
	});


	const dispatch = useAppDispatch();

	const edit = React.useCallback(() => {
		dispatch(setAlteringOrder(data.id));
	}, [data]);

	const del = React.useCallback(() => {
		dispatch(deleteOrder(data.id));
	}, [data]);

	const duplicate = React.useCallback(() => {
		dispatch(duplicateOrder(data.id));
	}, [data]);


	const fritesElem = React.useMemo(() => {
		if (!data.fries) return null;
		let sauces = data.fries.sauces.join(", ");
		return <Typography>Frites {sauces.length ? `(${sauces})` : ""}</Typography>;
	}, [data.fries]);

	return <Stack direction={"row"} alignItems={"center"} spacing={2}>
		{show.date && <Typography>
			{dayjs(data.date).format("DD/MM/YYYY")}
		</Typography>}

		{show.name && <Typography>
			{data.user}
		</Typography>}

		{data.burgers.length > 0 && <Typography>
			{data.burgers.map(o => o.name).join(", ")}
		</Typography>}


		{(fritesElem || data.drink || data.dessert) && <Stack direction={"row"} spacing={2}>
			{fritesElem}
			{data.drink && <Typography>{data.drink}</Typography>}
			{data.dessert && <Typography>{data.dessert}</Typography>}
		</Stack>}

		<ButtonGroup variant="outlined">

			{isToday(data) ? <>
				<IconButton onClick={edit}>
					<EditIcon color={"primary"} />
				</IconButton>
				<IconButton onClick={del}>
					<DeleteIcon color={"error"} />
				</IconButton>
			</> : !created &&
				<Tooltip title={"Dupliquer la commande"}>
					<IconButton onClick={duplicate}>
						<ContentCopy color={"inherit"} />
					</IconButton>
				</Tooltip>

			}
		</ButtonGroup>


	</Stack>;
}