import { Order, Sauce, SauceWithQuantity } from "../../../../core/apis/backend/generated";
import { useAppDispatch } from "../../../../store";
import React, { useCallback, useMemo } from "react";
import { Checkbox, Fade, FormControlLabel, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { updateOrder } from "../../../../store/module/orders/orders.action";
import { updateRemoteOrder } from "../../../../store/module/orders/orders.async.action";

const defaultSauces = Object.values(Sauce).reduce((acc, current) => {
	acc[current] = 0;
	return acc;
}, {} as Record<Sauce, number>);

export function OrderFries({ data }: { data: Order }) {
	const dispatch = useAppDispatch();

	const setFries = useCallback(
		(e: SelectChangeEvent<SauceWithQuantity[]>) => {
			dispatch(
				updateOrder({
					...data,
					fries: { sauces: e.target.value as SauceWithQuantity[] },
				})
			);
			dispatch(updateRemoteOrder());
		},
		[data, dispatch]
	);

	const toggleFries = useCallback(() => {
		dispatch(
			updateOrder({
				...data,
				fries: data.fries ? undefined : { sauces: [] },
			})
		);
		dispatch(updateRemoteOrder());
	}, [data, dispatch]);

	const quantityPerSauce = useMemo(() => {
		return (
			data.fries?.sauces?.reduce((acc, current) => {
				acc[current.sauce] = current.amount;
				return acc;
			}, {} as Record<Sauce, number>) ?? defaultSauces
		);
	}, [data.fries]);

	const updateSauceQuantity = useCallback(
		(sauce: Sauce) => (e: React.ChangeEvent<HTMLInputElement>) => {
			// TODO faire une action dans le reducer pour modifier l'objet puis appeler updateRemoteOrder (dans l'action)
		},
		[]
	);

	return (
		<Stack direction={"row"} spacing={2} alignItems={"center"}>
			<FormControlLabel control={<Checkbox sx={{ pl: 0 }} checked={!!data.fries} onChange={toggleFries} />} label={"Frites"} sx={{ ml: 0 }} />
			<Fade in={!!data.fries}>
				<Stack width={"100%"} spacing={1}>
					{Object.values(Sauce).map(sauce => (
						<Stack direction={"row"} key={sauce} alignItems={"center"} justifyContent={"space-between"} spacing={2} pr={2}>
							{sauce}
							<TextField onChange={updateSauceQuantity(sauce)} size={"small"} label={"quantity"} value={quantityPerSauce[sauce] ?? 0} type={"number"} />
						</Stack>
					))}
				</Stack>
			</Fade>
		</Stack>
	);
}
