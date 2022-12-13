import React from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Autocomplete, debounce, FormControl, Paper, Stack, TextField } from "@mui/material";
import { setUser } from "../../../store/module/orders/orders.action";
import { UserOrders } from "./UserOrders";
import { AllOrders } from "./AllOrders";

export function Orders() {
	const { orders, user } = useAppSelector(s => ({
		user: s.orders.name,
		orders: s.orders.all,
	}));

	const dispatch = useAppDispatch();

	const users = React.useMemo(() => [...new Set(Object.values(orders).map(order => order.user))], [orders]);

	const setUserDebounced = React.useMemo(() => debounce((usr: string | null) => dispatch(setUser(usr ?? undefined)), 50), [dispatch]);

	const onChange = React.useCallback((_, str: string) => setUserDebounced(str), [setUserDebounced]);

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

					{user && <UserOrders />}
				</Stack>

				<AllOrders />
			</Stack>
		</Paper>
	);
}
