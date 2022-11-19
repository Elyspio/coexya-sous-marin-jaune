import { BurgerRecord, Sauce } from "../../../../core/apis/backend/generated";
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
import { updateBurgerRecord } from "../../../../store/module/orders/orders.action";

export function OrderFries({ data }: { data: BurgerRecord }) {


	const dispatch = useAppDispatch();

	const setFries = useCallback((e: SelectChangeEvent<Sauce[]>) => {
		dispatch(updateBurgerRecord({
			...data,
			fries: { sauces: e.target.value as Sauce[] },
		}));
	}, [data, dispatch]);

	const toggleFries = useCallback(() => {
		dispatch(updateBurgerRecord({
			...data,
			fries: data.fries ? undefined : { sauces: [] },
		}));
	}, [data, dispatch]);

	return <Stack direction={"row"} alignItems={"center"}>

		<FormControlLabel control={<Checkbox checked={!!data.fries} onChange={toggleFries} />}
						  label={"Frites"} />
		<Fade in={!!data.fries}>
			<FormControl fullWidth sx={{ minWidth: 150 }}>
				<InputLabel id="select-sauces-label" sx={{mr: 1}}>Sauces</InputLabel>
				<Select
					labelId="select-sauces-label"
					id="select-sauces"
					value={data.fries?.sauces ?? []}
					label="Sauces"
					multiple
					onChange={setFries}
				>
					{Object.values(Sauce).map(sauce => <MenuItem key={sauce}
																 value={sauce}>{sauce}</MenuItem>)}
				</Select>
			</FormControl>
		</Fade>

	</Stack>;
}