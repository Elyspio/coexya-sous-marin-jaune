import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Autocomplete, debounce, FormControl, Paper, Stack, TextField, Typography } from "@mui/material";
import { setUser } from "../../../store/module/orders/orders.action";
import { CreateOrder } from "./list/CreateOrder";
import { AllOrders } from "./list/AllOrders";
import { useIsSmallScreen } from "../../hooks/useBreakpoint";

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

	const isSmall = useIsSmallScreen();

	return (
		<Paper className={"maxHeightWidth"}>
			<Stack m={isSmall ? 1 : 2} spacing={4} p={isSmall ? 0 : 2} className={"maxHeightWidth"}>
				<Stack spacing={4} direction={"row"} alignItems={"center"}>
					<FormControl sx={{ maxWidth: 150 }} fullWidth>
						<Autocomplete
							autoCapitalize={"on"}
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

					{userBalance !== undefined && (
						<Stack direction={"row"} spacing={2} alignItems={"center"}>
							<Typography variant={"overline"} fontSize={"100%"}>
								Solde
							</Typography>
							<Typography>
								{userBalance > 0 ? "+ " : ""}
								{userBalance.toFixed(2)}€
							</Typography>
						</Stack>
					)}
				</Stack>

				<AllOrders />
			</Stack>
		</Paper>
	);
}
