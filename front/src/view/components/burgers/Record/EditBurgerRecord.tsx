import React, { useRef } from "react";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Stack, Typography } from "@mui/material";
import { OrderOptions } from "./OrderOptions";
import { Burgers } from "../Burgers";
import { noneBurger, useOrderEditing } from "@/core/data/orders/orders.editing";
import { useIsSmallScreen } from "@hooks/utils/useBreakpoint";
import { useClientStore } from "@/core/store/clientStore";
import { useOrder } from "@/core/data/orders/orders.queries";
import { useBurgers } from "@/core/data/burgers/burgers.queries";
import { useDeleteOrder, useUpdateRemoteOrder } from "@/core/data/orders/orders.mutations";

/**
 * Add or edit a burger record
 */
export function EditBurgerRecord() {
	const alteringOrderId = useClientStore((s) => s.altering?.order);
	const recordIndex = useClientStore((s) => s.altering?.record);
	const mode = useClientStore((s) => s.mode);
	const setAlteringRecord = useClientStore((s) => s.setAlteringRecord);
	const order = useOrder(alteringOrderId);
	const burgers = useBurgers();
	const { updateBurgerRecord, deleteCurrentOrderRecord } = useOrderEditing();
	const { mutate: deleteOrder } = useDeleteOrder();
	const updateRemote = useUpdateRemoteOrder();

	const data = order && recordIndex !== undefined ? order.burgers[recordIndex] : undefined;
	const burger = burgers.find((b) => b.name === data?.name);
	const display = alteringOrderId !== undefined;

	const unchangedData = useRef(data);

	const close = React.useCallback(
		(modeChoice: "success" | "cancel") => () => {
			if (modeChoice === "success") {
				if (order) updateRemote.mutate(order);
			} else if (unchangedData.current) {
				updateBurgerRecord(unchangedData.current);
			}

			if (modeChoice === "cancel") {
				if (mode.order === "create" && alteringOrderId) {
					deleteOrder(alteringOrderId);
				} else if (mode.record === "create") {
					deleteCurrentOrderRecord();
				}
			} else {
				setAlteringRecord(undefined);
			}
		},
		[mode.order, mode.record, alteringOrderId, deleteOrder, deleteCurrentOrderRecord, setAlteringRecord, order, updateRemote, updateBurgerRecord]
	);

	const updateExcluded = React.useCallback(
		(ingredient: string) => () => {
			if (!data) return;
			const included = data.excluded.includes(ingredient);
			updateBurgerRecord({
				...data,
				excluded: included ? data.excluded.filter((i) => i !== ingredient) : [...data.excluded, ingredient],
			});
		},
		[updateBurgerRecord, data]
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
