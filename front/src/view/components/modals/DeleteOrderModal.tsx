import React, { useCallback } from "react";
import { useMounted } from "@hooks/utils/useMounted";
import { ModalComponentProps } from "./common/ModalProps";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useClientStore } from "@/core/store/clientStore";
import { useOrder } from "@/core/data/orders/orders.queries";
import { useDeleteOrder } from "@/core/data/orders/orders.mutations";

export function DeleteOrderModal({ setClose, open }: ModalComponentProps) {
	const orderId = useClientStore((s) => s.modalOptions.deleteOrder?.orderId);
	const order = useOrder(orderId);
	const { mutate } = useDeleteOrder();

	const deleteOrderFn = useCallback(() => {
		if (!order) return;
		mutate(order.id);
		setClose();
	}, [order, mutate, setClose]);

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
					<Button variant={"soft"} onClick={setClose}>
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
