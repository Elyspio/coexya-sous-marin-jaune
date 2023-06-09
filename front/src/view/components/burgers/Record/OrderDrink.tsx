import { Drink, Order } from "@apis/backend/generated";
import { useAppDispatch } from "@store";
import React, { useCallback } from "react";
import { Autocomplete, Box, FormControl, TextField } from "@mui/material";
import { updateOrder } from "@modules/orders/orders.action";
import { drinkLabels } from "../../modals/OrderMessageModal";
import { updateRemoteOrder } from "@modules/orders/orders.async.action";

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
	const dispatch = useAppDispatch();

	const setOrder = useCallback(
		(e: React.SyntheticEvent, val: DrinkPair | null) => {
			dispatch(
				updateOrder({
					...data,
					drink: val?.key ?? undefined,
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
