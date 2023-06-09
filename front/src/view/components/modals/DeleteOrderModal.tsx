import React, { useCallback } from "react";
import { useMounted } from "@hooks/utils/useMounted";
import { ModalComponentProps } from "./common/ModalProps";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@store";
import dayjs from "dayjs";
import { deleteOrder } from "@modules/orders/orders.async.action";

export function DeleteOrderModal({ setClose, open }: ModalComponentProps) {
	const order = useAppSelector((s) => {
		const options = s.workflow.options.deleteOrder!;
		return options ? s.orders.all[options.orderId] : undefined;
	});

	const dispatch = useAppDispatch();

	const deleteOrderFn = useCallback(() => {
		if (!order) return;

		dispatch(deleteOrder(order.id));
	}, [dispatch, order]);

	const [mounted, ref] = useMounted();

	if ((!mounted && !open) || !order) return null;

	return (
		<Dialog open={open} ref={ref} onClose={setClose}>
			<DialogTitle>Annulation d'une commande</DialogTitle>
			<DialogContent dividers>
				<Stack spacing={1} alignItems={"center"}>
					<Typography>Êtes-vous sur de vouloir annuler la commande de</Typography>
					<Stack spacing={1} direction={"row"} flexWrap={"wrap"}>
						<Typography color={"secondary"}>{order.user}</Typography>
						<Typography>faite le</Typography>
						<Typography color={"secondary"}>{dayjs(order.date).format("DD/MM/YYYY")}</Typography>
						<Typography>?</Typography>
					</Stack>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Stack spacing={2} p={1} direction={"row"}>
					<Button variant={"outlined"} onClick={setClose}>
						Non
					</Button>

					<Button variant={"contained"} color={"error"} onClick={deleteOrderFn}>
						Oui
					</Button>
				</Stack>
			</DialogActions>
		</Dialog>
	);
}
