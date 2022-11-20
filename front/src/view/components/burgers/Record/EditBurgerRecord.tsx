import React from "react";
import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	Stack,
	Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { closeOrderModal, setAlteringRecord, updateBurgerRecord } from "../../../../store/module/orders/orders.action";
import { OrderFries } from "./OrderFries";
import { OrderDrink } from "./OrderDrink";
import { OrderOptions } from "./OrderOptions";
import { OrderDessert } from "./OrderDessert";

export function EditBurgerRecord() {

	const { data, display, burger } = useAppSelector(s => {
		let data = s.orders.all[s.orders.altering!.order].burgers[s.orders.altering!.record!];
		return ({
			data,
			burger: s.burgers.all.find(b => b.name === data?.name),
			display: s.orders.altering !== undefined,
		});
	});

	const dispatch = useAppDispatch();


	const close = React.useCallback(() => dispatch(setAlteringRecord()), [dispatch]);


	const updateExcluded = React.useCallback((ingredient: string) => () => {
		const included = data.excluded.includes(ingredient);
		dispatch(updateBurgerRecord({
			...data,
			excluded: included ? data.excluded.filter(i => i != ingredient) : [...data.excluded, ingredient],
		}));
	}, [dispatch, data]);

	return (
		<Dialog open={display} onClose={close}>
			{data && burger && <>

				<DialogTitle>
					<Box justifyContent={"center"} display={"flex"}>
						<Typography fontSize={"large"} variant={"overline"}>{data.name}</Typography>
					</Box>
				</DialogTitle>
				<DialogContent dividers>
					<Stack direction={"row"} spacing={4} my={1}>
						<Stack>
							<Typography variant={"overline"}>Ingrédients</Typography>
							<Stack spacing={1}>
								{burger.ingredients.map(i => <Box key={i}>
									<FormControlLabel
										control={<Checkbox
											onClick={updateExcluded(i)}
											checked={!data.excluded.includes(i)}
										/>}
										label={i} />

								</Box>)}
							</Stack>
						</Stack>
						<Divider flexItem orientation="vertical"></Divider>
						<Stack spacing={2} minWidth={300}>
							<OrderFries data={data} />
							<OrderDrink data={data} />
							<OrderDessert data={data} />
							<OrderOptions data={data} />
						</Stack>

					</Stack>
				</DialogContent>
				<DialogActions>
					<Button color={"inherit"} onClick={close}>Annuler</Button>
					<Button color={"primary"} variant={"contained"} onClick={close}>Ajouter</Button>
				</DialogActions>


			</>}


		</Dialog>
	);
}

