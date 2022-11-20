import React from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Autocomplete, debounce, FormControl, Paper, Stack, TextField } from "@mui/material";
import { setUser } from "../../../store/module/orders/orders.action";
import { OldOrders } from "./OldOrders";

export function Orders() {

	const { orders, user } = useAppSelector(s => ({
		user: s.orders.name,
		orders: s.orders.all,
	}));

	const dispatch = useAppDispatch();

	const users = React.useMemo(() => [...new Set(...Object.values(orders).map(order => order.user))], [orders]);

	const setUserDebounced = React.useMemo(() => debounce((usr: string | null) => dispatch(setUser(usr ?? undefined)), 50), [dispatch]);

	const onChange = React.useCallback((_, str: string) => setUserDebounced(str), [setUserDebounced]);

	return (
		<Paper>
			<Stack m={2} spacing={4}>
				<Stack spacing={1}>
					<FormControl sx={{ maxWidth: 150 }}>
						<Autocomplete
							id="select-drink"
							defaultValue={user ?? null}
							freeSolo
							options={users}
							onChange={onChange as any}
							renderInput={(params) => <TextField {...params} variant={"standard"}
																placeholder={"Entrez votre nom"} required
																label="Utilisateur" />}

						/>
					</FormControl>
				</Stack>

				{user && <>
					<OldOrders />
				</>}


			</Stack>
		</Paper>

	);
}

