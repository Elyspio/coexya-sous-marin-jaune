import { Dessert, Order } from "../../../../core/apis/backend/generated";
import { useAppDispatch } from "../../../../store";
import React, { useCallback } from "react";
import { Autocomplete, Box, FormControl, TextField } from "@mui/material";
import { updateOrder } from "../../../../store/module/orders/orders.action";

export function OrderDessert({ data }: { data: Order }) {


	const dispatch = useAppDispatch();

	const setOrder = useCallback((e, val: Dessert | null) => {
		dispatch(updateOrder({
			...data,
			dessert: val ?? undefined,
		}));
	}, [data, dispatch]);


	return <Box width={"100%"}>
		<FormControl sx={{ minWidth: 120 }} fullWidth>
			<Autocomplete
				id="select-drink"
				value={data.dessert ?? null}
				options={Object.values(Dessert) as Dessert[]}
				onChange={setOrder as any}
				renderInput={(params) => <TextField {...params} variant={"standard"} label="Dessert" />}

			/>
		</FormControl>
	</Box>;

}