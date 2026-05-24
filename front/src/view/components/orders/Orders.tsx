import * as React from "react";
import { useMemo } from "react";
import { Autocomplete, Box, Stack, TextField, Typography } from "@mui/material";
import { debounce } from "@mui/material/utils";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { CreateOrder } from "./list/CreateOrder";
import { AllOrders } from "./list/AllOrders";
import { OrderTime, useClientStore } from "@/core/store/clientStore";
import { useOrders } from "@/core/data/orders/orders.queries";
import { useUsers } from "@/core/data/users/users.queries";
import { calculateOrderPrice, isToday } from "@/core/data/orders/orders.utils";
import { fmtPrice } from "@/core/utils/format";

export function Orders() {
	const orders = useOrders();
	const allUsers = useUsers();
	const user = useClientStore((s) => s.orderName);
	const setOrderName = useClientStore((s) => s.setOrderName);
	const timeRange = useClientStore((s) => s.timeRange);

	const viewToday = timeRange === OrderTime.today;

	const users = useMemo(() => [...new Set(orders.map((order) => order.user))].sort(), [orders]);

	const setUserDebounced = useMemo(
		() =>
			debounce((str: string | null) => {
				const usr = str ? str[0].toUpperCase() + str.slice(1) : undefined;
				setOrderName(usr);
			}, 50),
		[setOrderName],
	);

	const onChange = React.useCallback((_: React.SyntheticEvent, str: string) => setUserDebounced(str), [setUserDebounced]);

	const userBalance = useMemo(() => allUsers.find((u) => u.name === user)?.sold, [allUsers, user]);

	const todayOrders = useMemo(() => orders.filter(isToday), [orders]);
	const todayRevenue = useMemo(() => todayOrders.reduce((acc, o) => acc + calculateOrderPrice(o), 0), [todayOrders]);

	return (
		<Box sx={{ height: "100%", overflowY: "auto", px: { xs: 1.75, md: 3.5 }, pt: 4, pb: 10 }}>
			<Box sx={{ maxWidth: 980, mx: "auto" }}>
				<Stack direction="row" alignItems="flex-end" justifyContent="space-between" gap={3} mb={3.5}>
					<Box>
						<Typography variant="eyebrow">{dayjs().locale("fr").format("dddd D MMMM")}</Typography>
						<Typography variant="h1" sx={{ mt: 0.5 }}>
							{viewToday ? "Commandes du midi" : "Toutes les commandes"}
						</Typography>
					</Box>
					<Stack alignItems="flex-end" sx={{ color: "custom.ink3" }}>
						<Typography variant="mono" sx={{ fontSize: 12 }}>
							<Box component="span" sx={{ color: "custom.ink", fontWeight: 500 }}>
								{todayOrders.length}
							</Box>{" "}
							commandes aujourd'hui
						</Typography>
						<Typography variant="mono" sx={{ fontSize: 12 }}>
							<Box component="span" sx={{ color: "custom.ink", fontWeight: 500 }}>
								{fmtPrice(todayRevenue)}
							</Box>{" "}
							de menus
						</Typography>
					</Stack>
				</Stack>

				<Stack
					direction="row"
					alignItems="center"
					gap={1.75}
					sx={(t) => ({
						p: "14px 16px 14px 18px",
						mb: 4,
						backgroundColor: t.palette.custom.paper,
						border: `1px solid ${t.palette.custom.line}`,
						borderRadius: "12px",
						boxShadow: t.palette.custom.shadowSm,
						flexWrap: "wrap",
					})}
				>
					<Typography sx={{ fontSize: 13, color: "custom.ink3" }}>Je suis</Typography>
					<Autocomplete
						freeSolo
						value={user ?? ""}
						options={users}
						onChange={onChange as never}
						sx={{ flex: 1, minWidth: 180, maxWidth: 280 }}
						renderInput={(params) => (
							<TextField
								{...params}
								variant="standard"
								required
								placeholder="Prénom"
								onBlur={(e) => setUserDebounced(e.target.value)}
								sx={{ "& .MuiInput-input": { fontSize: 16, fontWeight: 500 } }}
							/>
						)}
					/>

					{userBalance !== undefined && (
						<Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ pl: 2, borderLeft: (t) => `1px solid ${t.palette.custom.line}` }}>
							<Typography sx={{ fontSize: 12, color: "custom.ink3" }}>Solde</Typography>
							<Typography variant="mono" sx={{ fontSize: 15, fontWeight: 500, color: userBalance > 0 ? "custom.success" : userBalance < 0 ? "custom.danger" : "custom.ink" }}>
								{userBalance > 0 ? "+" : ""}
								{fmtPrice(userBalance)}
							</Typography>
						</Stack>
					)}

					<Box sx={{ flex: 1 }} />

					<CreateOrder />
				</Stack>

				<AllOrders />
			</Box>
		</Box>
	);
}
