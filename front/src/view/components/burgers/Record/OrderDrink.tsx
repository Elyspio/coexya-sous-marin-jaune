import { Drink, Order } from "../../../../core/apis/backend/generated";
import { useAppDispatch } from "../../../../store";
import React, { useCallback } from "react";
import { Autocomplete, Box, FormControl, TextField } from "@mui/material";
import { updateOrder } from "../../../../store/module/orders/orders.action";

export function OrderDrink({ data }: { data: Order }) {


	const dispatch = useAppDispatch();

	const setOrder = useCallback((e, val: Drink | null) => {
		dispatch(updateOrder({
			...data,
			drink: val ?? undefined,
		}));
	}, [data, dispatch]);


	return <Box width={"100%"}>
		<FormControl sx={{ minWidth: 120 }} fullWidth>
			<Autocomplete
				id="select-drink"
				value={data.drink ?? null}
				options={Object.values(Drink) as Drink[]}
				onChange={setOrder as any}
				renderInput={(params) => <TextField {...params} variant={"standard"} label="Boisson" />}

			/>
		</FormControl>
	</Box>;

}