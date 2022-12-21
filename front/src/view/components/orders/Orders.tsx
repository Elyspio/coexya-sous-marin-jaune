import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Autocomplete, debounce, FormControl, Paper, Stack, TextField, Typography } from "@mui/material";
import { setUser } from "../../../store/module/orders/orders.action";
import { CreateOrder } from "./list/CreateOrder";
import { AllOrders } from "./list/AllOrders";

export function Orders() {
	const { orders, user, allUsers } = useAppSelector(s => ({
		user: s.orders.name,
		orders: s.orders.all,
		allUsers: s.users.all,
	}));

	const dispatch = useAppDispatch();

	const users = React.useMemo(() => [...new Set(Object.values(orders).map(order => order.user))].sort(), [orders]);

	const setUserDebounced = React.useMemo(() => debounce((usr: string | null) => dispatch(setUser(usr ?? undefined)), 50), [dispatch]);

	const onChange = React.useCallback((_, str: string) => setUserDebounced(str), [setUserDebounced]);

	const userBalance = useMemo(() => allUsers.find(u => u.name === user)?.sold, [allUsers, user]);

	return (
		<Paper className={"maxHeightWidth"}>
			<Stack m={2} spacing={4} p={2} className={"maxHeightWidth"}>
				<Stack spacing={4} direction={"row"} alignItems={"center"}>
					<FormControl sx={{ maxWidth: 150 }} fullWidth>
						<Autocomplete
							fullWidth
							id="select-user"
							value={user ?? ""}
							freeSolo
							options={users}
							onChange={onChange as any}
							renderInput={params => <TextField {...params} variant={"standard"} required label="Prénom" onBlur={e => setUserDebounced(e.target.value)} />}
						/>
					</FormControl>

					{user && <CreateOrder />}

					{userBalance && (
						<Typography variant={"overline"} fontSize={"100%"}>
							Solde {userBalance.toFixed(2)}€
						</Typography>
					)}
				</Stack>

				<AllOrders />
			</Stack>
		</Paper>
	);
}
