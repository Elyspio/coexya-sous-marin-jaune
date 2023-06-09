import { Order, Sauce } from "@apis/backend/generated";
import { useAppDispatch } from "@store";
import React, { useCallback, useMemo } from "react";
import { Checkbox, Fade, FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import { updateOrder } from "@modules/orders/orders.action";
import { updateOrderSauceQuantity, updateRemoteOrder } from "@modules/orders/orders.async.action";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const defaultSauces = Object.values(Sauce).reduce((acc, current) => {
	acc[current] = 0;
	return acc;
}, {} as Record<Sauce, number>);

export function OrderFries({ data }: { data: Order }) {
	const dispatch = useAppDispatch();

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
			dispatch(
				updateOrderSauceQuantity({
					idOrder: data.id,
					quantity: Number.parseInt(e.target.value.toString()),
					sauce,
				})
			);
		},
		[data.id, dispatch]
	);

	const nbSauces = useMemo(() => data.fries?.sauces.reduce((acc, current) => acc + current.amount, 0) ?? 0, [data.fries?.sauces]);

	return (
		<Stack direction={"row"} spacing={2} alignItems={"center"}>
			<FormControlLabel control={<Checkbox sx={{ pl: 0 }} checked={!!data.fries} onChange={toggleFries} />} label={"Frites"} sx={{ ml: 0 }} />
			<Fade in={!!data.fries}>
				<List dense sx={{ width: "100%" }}>
					{Object.values(Sauce).map((sauce) => (
						<ListItem sx={{ width: "100%" }} key={sauce}>
							<Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={2} pr={2} width={"100%"}>
								<Typography color={quantityPerSauce[sauce] > 0 ? "inherit" : "gray"}>{sauce}</Typography>
								<TextField
									variant={"standard"}
									onChange={updateSauceQuantity(sauce)}
									size={"small"}
									label={"Nombre"}
									value={quantityPerSauce[sauce] ?? 0}
									type={"number"}
									inputProps={{
										min: 0,
										max: 2 - nbSauces + quantityPerSauce[sauce] ?? 0,
									}}
									sx={{
										width: 60,
										color: "red",
									}}
								/>
							</Stack>
						</ListItem>
					))}
				</List>
			</Fade>
		</Stack>
	);
}
