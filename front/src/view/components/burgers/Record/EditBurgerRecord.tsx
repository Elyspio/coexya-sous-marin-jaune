import React, { useRef } from "react";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@store";
import { setAlteringRecord, updateBurgerRecord } from "@modules/orders/orders.action";
import { OrderOptions } from "./OrderOptions";
import { Burgers } from "../Burgers";
import { noneBurger } from "@modules/orders/orders.reducer";
import { deleteCurrentOrderRecord, deleteOrder, updateRemoteOrder } from "@modules/orders/orders.async.action";
import { useIsSmallScreen } from "@hooks/utils/useBreakpoint";

/**
 * Add or edit a burger record
 * @constructor
 */
export function EditBurgerRecord() {
	const { data, display, burger, creating, orderId } = useAppSelector((s) => {
		const data = s.orders.all[s.orders.altering!.order].burgers[s.orders.altering!.record!];
		return {
			data,
			burger: s.burgers.all.find((b) => b.name === data?.name),
			display: s.orders.altering !== undefined,
			creating: s.orders.mode,
			orderId: s.orders.altering!.order,
		};
	});

	const unchangedData = useRef(data);

	const dispatch = useAppDispatch();

	const close = React.useCallback(
		(mode: "success" | "cancel") => () => {
			// Update or reset record
			if (mode === "success") {
				dispatch(updateRemoteOrder());
			} else {
				dispatch(updateBurgerRecord(unchangedData.current));
			}
			// Delete remote order or unset altering order
			if (mode === "cancel") {
				if (creating.order === "create") {
					dispatch(deleteOrder(orderId));
				} else if (creating.record === "create") {
					dispatch(deleteCurrentOrderRecord());
				}
			} else {
				dispatch(setAlteringRecord());
			}
		},
		[creating.order, creating.record, dispatch, orderId]
	);

	const updateExcluded = React.useCallback(
		(ingredient: string) => () => {
			const included = data.excluded.includes(ingredient);
			dispatch(
				updateBurgerRecord({
					...data,
					excluded: included ? data.excluded.filter((i) => i !== ingredient) : [...data.excluded, ingredient],
				})
			);
		},
		[dispatch, data]
	);

	const isSmall = useIsSmallScreen();

	if (!data) return null;

	return (
		<Dialog open={display} onClose={close("cancel")} maxWidth={false}>
			<DialogTitle>
				<Box justifyContent={"center"} display={"flex"}>
					<Typography fontSize={"large"} variant={"overline"}>
						{data.name === noneBurger ? "Choisissez un burger" : data.name}
					</Typography>
				</Box>
			</DialogTitle>
			<DialogContent dividers>
				{burger ? (
					<Stack direction={"row"} spacing={4} my={1}>
						<Stack>
							<Typography variant={"overline"}>Ingrédients</Typography>
							<Stack spacing={1}>
								{burger.ingredients.map((i) => (
									<Box key={i}>
										<FormControlLabel
											control={<Checkbox onClick={updateExcluded(i)} checked={!data.excluded.includes(i)} />}
											label={i}
											sx={{ whiteSpace: isSmall ? "inherit" : "nowrap" }}
										/>
									</Box>
								))}
							</Stack>
						</Stack>
						<Divider flexItem orientation="vertical"></Divider>
						<Stack spacing={2} width={"100%"}>
							<OrderOptions data={data} />
						</Stack>
					</Stack>
				) : (
					<Burgers />
				)}
			</DialogContent>
			<DialogActions>
				<Stack direction={"row"} spacing={2} p={1}>
					<Button color={"inherit"} variant={"outlined"} onClick={close("cancel")}>
						Fermer
					</Button>
					<Button color={"success"} variant={"contained"} onClick={close("success")}>
						Sauvegarder
					</Button>
				</Stack>
			</DialogActions>
		</Dialog>
	);
}
