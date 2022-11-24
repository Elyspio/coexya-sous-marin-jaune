import React from "react";
import { Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store";
import dayjs from "dayjs";
import { Order } from "../../../core/apis/backend/generated";
import { createOrder, getOrders } from "../../../store/module/orders/orders.async.action";
import { OrderItem } from "./OrderItem";
import {groupBy} from "lodash"
export const isToday = (order: Order) => dayjs().startOf("day").isSame(dayjs(order.date).startOf("day"));

export function AllOrders() {

	const { orders , created} = useAppSelector(s => {
		let name = s.orders.name;
		let userOrders = Object.values(s.orders.all).filter(order => order.user === name);

		return ({
			orders: s.orders.all,
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

	const grouped = React.useMemo(() => {
		let allOrders = Object.values(orders);
		allOrders.sort((o1, o2) => dayjs(o1.date).isBefore(o2.date) ? -1 : 1);

		const smallDate = (order: Order) => dayjs(order.date).format("DD/MM/YYYY");

		return groupBy(allOrders, smallDate) as Record<string, Order[]>;

	}, [orders]);

	const groupedElem = React.useMemo(() => {
		return <Stack spacing={3}>
			{Object.entries(grouped).map(([date, orders]) =>  <Stack spacing={1}>
				<Typography variant={"overline"}>{date}</Typography>
				{orders.map(order => <OrderItem data={order} show={{name: true, duplicate: true}}/>)}
			</Stack>)}
		</Stack>
	}, [grouped])


	console.log(grouped);

	return <Stack>
		<Typography variant={"overline"} fontSize={"100%"}>Toutes les commandes </Typography>
		{groupedElem}
	</Stack>
}


