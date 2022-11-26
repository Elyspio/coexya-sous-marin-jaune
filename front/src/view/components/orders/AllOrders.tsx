import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../../store";
import dayjs from "dayjs";
import { Order } from "../../../core/apis/backend/generated";
import { OrderItem } from "./OrderItem";
import { groupBy } from "lodash";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/fr";
import { dateTemplate, isTodayFormatted } from "../../../store/module/orders/orders.utils";


dayjs.extend(customParseFormat);


export function AllOrders() {

	const { orders } = useAppSelector(s => {
		let name = s.orders.name;
		return ({
			orders: s.orders.all,
		});
	});


	const grouped = React.useMemo(() => {
		let allOrders = Object.values(orders);
		allOrders.sort((o1, o2) => o1.user.localeCompare(o2.user));

		const smallDate = (order: Order) => dayjs(order.date).format(dateTemplate);

		return groupBy(allOrders, smallDate) as Record<string, Order[]>;

	}, [orders]);

	const groupedElem = React.useMemo(() => {
		const entries = Object.entries(grouped).sort(([date], [date2]) => {
			return dayjs(date2, dateTemplate, "fr").isBefore(dayjs(date, dateTemplate, "fr")) ? -1 : 1;
		});
		return <Stack spacing={3}>
			{entries.map(([date, orders]) => <Stack key={date} spacing={1}>
				<Typography variant={"overline"}
							color={isTodayFormatted(date) ? "primary" : "inherit"}>{date}</Typography>
				{orders.map(order => <OrderItem key={order.id} data={order} show={{ name: true, duplicate: true }} />)}
			</Stack>)}
		</Stack>;
	}, [grouped]);


	return <Stack>
		<Box pb={2}>
			<Typography variant={"overline"} fontSize={"100%"}>Toutes les commandes </Typography>
		</Box>
		{groupedElem}
	</Stack>;
}

