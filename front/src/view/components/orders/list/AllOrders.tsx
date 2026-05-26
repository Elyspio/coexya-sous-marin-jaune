import * as React from "react";
import { useMemo } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { groupBy } from "lodash";
import { Order } from "@apis/rest/api/generated";
import { OrderRow } from "./OrderItem";
import { SelectTimeRangeOrder } from "./SelectTimeRangeOrder";
import { isToday } from "@/core/data/orders/orders.utils";
import { fmtDay } from "@/core/utils/format";
import { OrderTime, useClientStore } from "@/core/store/clientStore";
import { useOrders } from "@/core/data/orders/orders.queries";

const dayKey = (o: Order) => dayjs(o.date).format("YYYY-MM-DD");

function matchRange(order: Order, range: OrderTime): boolean {
	const d = dayjs(order.date);
	switch (range) {
		case OrderTime.all:
			return true;
		case OrderTime.year:
			return d.isAfter(dayjs().add(-1, "year"));
		case OrderTime.months6:
			return d.isAfter(dayjs().add(-6, "month"));
		case OrderTime.months3:
			return d.isAfter(dayjs().add(-3, "month"));
		case OrderTime.month:
			return d.isAfter(dayjs().add(-1, "month"));
		case OrderTime.today:
			return isToday(order);
	}
}

export function AllOrders() {
	const orders = useOrders();
	const timeRange = useClientStore((s) => s.timeRange);
	const viewToday = timeRange === OrderTime.today;

	const grouped = useMemo(() => {
		const filtered = orders.filter((o) => matchRange(o, timeRange));
		filtered.sort((a, b) => a.user.localeCompare(b.user));
		return groupBy(filtered, dayKey) as Record<string, Order[]>;
	}, [orders, timeRange]);

	const dayKeys = useMemo(() => Object.keys(grouped).sort((a, b) => b.localeCompare(a)), [grouped]);

	return (
		<Stack spacing={4.5}>
			{!viewToday && (
				<Stack direction="row" alignItems="center" justifyContent="flex-end">
					<SelectTimeRangeOrder />
				</Stack>
			)}

			{dayKeys.length === 0 && (
				<Paper variant="outlined" sx={(t) => ({ border: `1px solid ${t.palette.custom.line}`, borderRadius: "12px", p: 5, textAlign: "center", color: "custom.ink3" })}>
					<Typography sx={{ fontWeight: 500, color: "custom.ink2" }}>Aucune commande</Typography>
					<Typography sx={{ fontSize: 13 }}>Pas encore de commande sur cette période.</Typography>
				</Paper>
			)}

			{dayKeys.map((key) => {
				const dayOrders = grouped[key];
				const today = isToday(dayOrders[0]);
				return (
					<Box key={key}>
						<Stack direction="row" alignItems="baseline" spacing={1.75} sx={{ mb: 1.75, px: 0.5 }}>
							<Typography sx={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.015em", textTransform: "capitalize" }}>{fmtDay(dayOrders[0].date)}</Typography>
							{today && <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "custom.accent" }} />}
							<Typography variant="eyebrow">
								{dayOrders.length} {dayOrders.length > 1 ? "commandes" : "commande"}
							</Typography>
						</Stack>
						<Paper
							variant="outlined"
							sx={(t) => ({
								border: `1px solid ${t.palette.custom.line}`,
								borderRadius: "12px",
								overflow: "hidden",
								boxShadow: t.palette.custom.shadowSm,
							})}
						>
							{dayOrders.map((order) => (
								<OrderRow key={order.id} data={order} today={today} />
							))}
						</Paper>
					</Box>
				);
			})}
		</Stack>
	);
}
