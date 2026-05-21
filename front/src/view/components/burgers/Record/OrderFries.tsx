import { Order, Sauce } from "@apis/backend/generated";
import React, { useCallback, useMemo } from "react";
import { Checkbox, Fade, FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useUpdateAndSaveOrder } from "@/core/data/orders/orders.editing";
import { useUpdateSauceQuantity } from "@/core/data/orders/orders.mutations";

const defaultSauces = Object.values(Sauce).reduce((acc, current) => {
	acc[current] = 0;
	return acc;
}, {} as Record<Sauce, number>);

export function OrderFries({ data }: { data: Order }) {
	const updateAndSave = useUpdateAndSaveOrder();
	const { mutate: updateSauceQuantity } = useUpdateSauceQuantity();

	const toggleFries = useCallback(() => {
		updateAndSave({
			...data,
			fries: data.fries ? undefined : { sauces: [] },
		});
	}, [data, updateAndSave]);

	const quantityPerSauce = useMemo(() => {
		return (
			data.fries?.sauces?.reduce((acc, current) => {
				acc[current.sauce] = current.amount;
				return acc;
			}, {} as Record<Sauce, number>) ?? defaultSauces
		);
	}, [data.fries]);

	const onSauceQuantityChange = useCallback(
		(sauce: Sauce) => (e: React.ChangeEvent<HTMLInputElement>) => {
			updateSauceQuantity({
				idOrder: data.id,
				quantity: Number.parseInt(e.target.value.toString()),
				sauce,
			});
		},
		[data.id, updateSauceQuantity]
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
									onChange={onSauceQuantityChange(sauce)}
									size={"small"}
									label={"Nombre"}
									value={quantityPerSauce[sauce] ?? 0}
									type={"number"}
									inputProps={{
										min: 0,
										max: (2 - nbSauces + quantityPerSauce[sauce]) ?? 0,
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
