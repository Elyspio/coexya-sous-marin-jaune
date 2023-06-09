import { Dessert, Order } from "@apis/backend/generated";
import { useAppDispatch } from "@store";
import React, { useCallback } from "react";
import { Autocomplete, Box, FormControl, TextField } from "@mui/material";
import { updateOrder } from "@modules/orders/orders.action";
import { updateRemoteOrder } from "@modules/orders/orders.async.action";

const unavailableDesserts: Dessert[] = [Dessert.Brookie];

export function OrderDessert({ data }: { data: Order }) {
	const dispatch = useAppDispatch();

	const setOrder = useCallback(
		(e: React.SyntheticEvent, val: Dessert | null) => {
			dispatch(
				updateOrder({
					...data,
					dessert: val ?? undefined,
				})
			);
			dispatch(updateRemoteOrder());
		},
		[data, dispatch]
	);

	return (
		<Box width={"100%"}>
			<FormControl sx={{ minWidth: 120 }} fullWidth>
				<Autocomplete
					id="select-drink"
					value={data.dessert ?? null}
					options={Object.values(Dessert) as Dessert[]}
					onChange={setOrder}
					getOptionDisabled={(option) => unavailableDesserts.includes(option)}
					renderInput={(params) => <TextField {...params} variant={"standard"} label="Dessert" />}
				/>
			</FormControl>
		</Box>
	);
}
