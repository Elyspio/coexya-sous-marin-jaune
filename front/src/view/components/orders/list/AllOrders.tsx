import React from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "../../../../store";
import dayjs from "dayjs";
import { Order } from "../../../../core/apis/backend/generated";
import { OrderItem } from "./OrderItem";
import { groupBy } from "lodash";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/fr";
import { dateTemplate, isToday, isTodayFormatted } from "../../../../store/module/orders/orders.utils";
import { OrderTime } from "../../../../store/module/orders/orders.reducer";
import { SelectTimeRangeOrder } from "./SelectTimeRangeOrder";

dayjs.extend(customParseFormat);

export function AllOrders() {
	const { orders, timeRange } = useAppSelector(s => {
		return {
			orders: s.orders.all,
			timeRange: s.orders.timeRange,
		};
	});

	const grouped = React.useMemo(() => {
		let allOrders = Object.values(orders)
			.filter(order => {
				switch (timeRange) {
					case OrderTime.all:
						return true;
					case OrderTime.year:
						return dayjs(order.date).isAfter(dayjs().add(-1, "year"));
					case OrderTime.months6:
						return dayjs(order.date).isAfter(dayjs().add(-6, "month"));
					case OrderTime.months3:
						return dayjs(order.date).isAfter(dayjs().add(-3, "month"));
					case OrderTime.month:
						return dayjs(order.date).isAfter(dayjs().add(-1, "month"));
					case OrderTime.today:
						return isToday(order);
				}
				if (timeRange === OrderTime.today) return isToday(order);
				return null;
			})
			.filter(Boolean);
		allOrders.sort((o1, o2) => o1.user.localeCompare(o2.user));

		const smallDate = (order: Order) => dayjs(order.date).format(dateTemplate);

		return groupBy(allOrders, smallDate) as Record<string, Order[]>;
	}, [orders, timeRange]);

	const { palette } = useTheme();

	const groupedElem = React.useMemo(() => {
		const entries = Object.entries(grouped).sort(([date], [date2]) => {
			return dayjs(date2, dateTemplate, "fr").isBefore(dayjs(date, dateTemplate, "fr")) ? -1 : 1;
		});
		return (
			<Stack spacing={5} position={"absolute"} top={0} bottom={0} left={0} right={0} overflow={"auto"}>
				{entries.map(([date, orders]) => (
					<Stack key={date} spacing={1.5}>
						<Typography
							variant={"overline"}
							color={isTodayFormatted(date) ? "primary" : palette.text.disabled}
							sx={{
								position: "sticky",
								top: 0,
								left: 0,
								width: "100%",
								fontWeight: "bold",
								zIndex: 10,
								background: palette.background.paper,
							}}
						>
							{date}
						</Typography>
						{orders.map(order => (
							<OrderItem key={order.id} data={order} show={{ name: true, duplicate: true }} />
						))}
					</Stack>
				))}
			</Stack>
		);
	}, [grouped, palette.background.paper, palette.text.disabled]);

	return (
		<Stack display={"flex"} height={"100%"}>
			<Stack pb={2} direction={"row"} spacing={4} alignItems={"center"} flexGrow={0}>
				<Typography variant={"overline"} fontSize={"100%"}>
					Toutes les commandes{" "}
				</Typography>
				<SelectTimeRangeOrder />
			</Stack>
			<Box overflow={"hidden"} flexGrow={1} position={"relative"}>
				{groupedElem}
			</Box>
		</Stack>
	);
}
