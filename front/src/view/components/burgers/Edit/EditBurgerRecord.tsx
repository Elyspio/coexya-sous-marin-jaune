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
	useTheme,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { openOrderModal, updateBurgerRecord } from "../../../../store/module/orders/orders.action";
import { OrderFries } from "./OrderFries";
import { OrderDrink } from "./OrderDrink";
import { OrderOptions } from "./OrderOptions";

export function EditBurgerRecord() {

	const { data, display, burger } = useAppSelector(s => {
		let data = s.orders.wip[s.orders.altering ?? -1];
		return ({
			data,
			burger: s.burgers.all.find(b => b.name === data?.name),
			display: s.orders.altering !== undefined,
		});
	});

	const dispatch = useAppDispatch();


	const close = React.useCallback(() => dispatch(openOrderModal()), [dispatch]);


	const updateExcluded = React.useCallback((ingredient: string) => () => {
		const included = data.excluded.includes(ingredient);
		dispatch(updateBurgerRecord({
			...data,
			excluded: included ? data.excluded.filter(i => i != ingredient) : [...data.excluded, ingredient],
		}));
	}, [dispatch, data]);

	const { palette } = useTheme();

	return (
		<Dialog open={display} onClose={close}>
			{data && burger && <>

				<DialogTitle>{data.name}</DialogTitle>
				<DialogContent>
					<Stack direction={"row"} spacing={4} my={1}>
						<Stack width={"45%"}>
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
						<Divider color={palette.primary.main} sx={{ width: "1px" }}></Divider>
						<Stack spacing={2} width={"55%"}>
							<OrderDrink data={data} />
							<OrderFries data={data} />
							<OrderOptions data={data} />
						</Stack>

					</Stack>
				</DialogContent>
				<DialogActions>
					<Button color={"error"} onClick={close}>Annuler</Button>
					<Button color={"primary"} onClick={close}>Ajouter</Button>
				</DialogActions>


			</>}


		</Dialog>
	);
}

