import { Dessert, Order } from "@apis/backend/generated";
import React, { useCallback } from "react";
import { Autocomplete, Box, FormControl, TextField } from "@mui/material";
import { useUpdateAndSaveOrder } from "@/core/data/orders/orders.editing";

const unavailableDesserts: Dessert[] = [Dessert.Brookie];

export function OrderDessert({ data }: { data: Order }) {
	const updateAndSave = useUpdateAndSaveOrder();

	const setOrder = useCallback(
		(_e: React.SyntheticEvent, val: Dessert | null) => {
			updateAndSave({ ...data, dessert: val ?? undefined });
		},
		[data, updateAndSave],
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
