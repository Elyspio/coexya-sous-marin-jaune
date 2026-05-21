import { Drink, Order } from "@apis/backend/generated";
import React, { useCallback } from "react";
import { Autocomplete, Box, FormControl, TextField } from "@mui/material";
import { drinkLabels } from "../../modals/OrderMessageModal";
import { useUpdateAndSaveOrder } from "@/core/data/orders/orders.editing";

type DrinkPair = {
	key: Drink;
	label: string;
};
const drinks = (Object.values(Drink) as Drink[]).reduce((acc, current) => {
	acc.push({
		key: current,
		label: drinkLabels[current],
	});
	return acc;
}, [] as DrinkPair[]);

const unavailableDrinks: Drink[] = [Drink.Limonade];

export function OrderDrink({ data }: { data: Order }) {
	const updateAndSave = useUpdateAndSaveOrder();

	const setOrder = useCallback(
		(_e: React.SyntheticEvent, val: DrinkPair | null) => {
			updateAndSave({ ...data, drink: val?.key ?? undefined });
		},
		[data, updateAndSave]
	);

	return (
		<Box width={"100%"}>
			<FormControl sx={{ minWidth: 120 }} fullWidth>
				<Autocomplete
					id="select-drink"
					value={drinks.find((d) => d.key === data.drink)}
					options={drinks}
					onChange={setOrder}
					getOptionDisabled={(option) => unavailableDrinks.includes(option.key)}
					getOptionLabel={(option) => option.label}
					renderInput={(params) => <TextField {...params} variant={"standard"} label="Boisson" />}
				/>
			</FormControl>
		</Box>
	);
}
