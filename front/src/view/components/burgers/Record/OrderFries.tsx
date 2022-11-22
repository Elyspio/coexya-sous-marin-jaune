import { Order, Sauce } from "../../../../core/apis/backend/generated";
import { useAppDispatch } from "../../../../store";
import React, { useCallback } from "react";
import {
	Checkbox,
	Fade,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
} from "@mui/material";
import { updateOrder } from "../../../../store/module/orders/orders.action";

export function OrderFries({ data }: { data: Order }) {


	const dispatch = useAppDispatch();

	const setFries = useCallback((e: SelectChangeEvent<Sauce[]>) => {
		dispatch(updateOrder({
			...data,
			fries: { sauces: e.target.value as Sauce[] },
		}));
	}, [data, dispatch]);

	const toggleFries = useCallback(() => {
		dispatch(updateOrder({
			...data,
			fries: data.fries ? undefined : { sauces: [] },
		}));
	}, [data, dispatch]);


	return <Stack direction={"row"} spacing={2} alignItems={"center"}>

		<FormControlLabel
			control={<Checkbox sx={{ pl: 0 }} checked={!!data.fries} onChange={toggleFries} />}
			label={"Frites"}
			sx={{ ml: 0 }}
		/>
		<Fade in={!!data.fries}>
			<FormControl fullWidth>
				<InputLabel id="select-sauces-label" sx={{ mr: 1, ml: 0 }}>Sauces</InputLabel>
				<Select
					labelId="select-sauces-label"
					id="select-sauces"
					value={data.fries?.sauces ?? []}
					label="Sauces"
					multiple
					variant={"standard"}
					onChange={setFries}
				>
					{Object.values(Sauce).map(sauce => <MenuItem
						key={sauce}
						value={sauce}
					>
						{sauce}
					</MenuItem>)}
				</Select>
			</FormControl>
		</Fade>

	</Stack>;
}