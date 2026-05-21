import React, { useCallback, useEffect, useMemo } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Tab, Tabs, Tooltip } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { PayementOrder } from "./payment/PayementOrder";
import { EditMenuOrder } from "./EditMenuOrder";
import { isToday } from "@/core/data/orders/orders.utils";
import { useClientStore } from "@/core/store/clientStore";
import { useOrder } from "@/core/data/orders/orders.queries";
import { useDeleteOrder, useUpdateRemoteOrder } from "@/core/data/orders/orders.mutations";

type Workflow = "menu" | "payment";

export function EditOrder() {
	const alteringId = useClientStore((s) => s.altering?.order);
	const creating = useClientStore((s) => s.mode.order === "create");
	const setAlteringOrder = useClientStore((s) => s.setAlteringOrder);
	const order = useOrder(alteringId);

	const [workflow, setWorkflow] = React.useState<Workflow>("menu");

	const { mutate: deleteOrder } = useDeleteOrder();
	const updateRemote = useUpdateRemoteOrder();

	const close = useCallback(() => {
		setAlteringOrder(undefined);
	}, [setAlteringOrder]);

	const deleteOrderFn = React.useCallback(() => {
		if (creating && order) {
			deleteOrder(order.id);
		}
		close();
	}, [creating, close, deleteOrder, order]);

	const handleChange = (event: React.SyntheticEvent, newValue: Workflow) => {
		setWorkflow(newValue);
	};

	const updateOrderFn = React.useCallback(() => {
		if (!order) return;
		if (workflow === "menu" && order.paymentEnabled) {
			setWorkflow("payment");
		} else {
			updateRemote.mutate(order);
			close();
		}
	}, [workflow, close, order, updateRemote]);

	const remainingToPay = useMemo(() => {
		if (!order || order.price === undefined) return -1;
		const amountPaid = order.payments.reduce((acc, current) => acc + current.amount, 0);
		return order.price - amountPaid;
	}, [order]);

	const validateTooltip = useMemo(() => {
		if (!order) return "";

		if (workflow === "menu") {
			if (!order.burgers.length) return "Vous devez prendre au moins un burger";
			if (!order.student) return "";
			if (!order.fries) return "Vous devez prendre des frites";
			if (!order.drink) return "Vous devez prendre une boisson";
		}

		if (workflow === "payment" && order.paymentEnabled) {
			if (remainingToPay > 0) return `Il reste ${remainingToPay}€ à payer`;
			return "";
		}

		return "";
	}, [order, remainingToPay, workflow]);

	const cantValidate = useMemo(() => validateTooltip !== "", [validateTooltip]);

	const validateBtnLabel = useMemo(() => {
		if (!order) return "";
		if (workflow === "payment") return "Valider";
		if (order.paymentEnabled) return "Payer";
		return `Valider ${order?.price}€`;
	}, [workflow, order]);

	useEffect(() => {
		if (!order?.paymentEnabled) setWorkflow("menu");
	}, [order]);

	if (!order) return null;

	return (
		<Dialog open={Boolean(order)} onClose={deleteOrderFn}>
			<DialogTitle>{isToday(order) ? "Création" : "Modification"} de votre commande</DialogTitle>
			<DialogContent dividers>
				<TabContext value={workflow}>
					<Box sx={{ borderBottom: 1, borderColor: "divider", height: "100%" }}>
						<Tabs onChange={handleChange} variant={"fullWidth"} value={workflow}>
							<Tab label="Contenu" value="menu" />
							{order.paymentEnabled && <Tab label="Payement" value="payment" />}
						</Tabs>
					</Box>
					<Box height={530}>
						<TabPanel value="menu" sx={{ height: "100%" }}>
							<EditMenuOrder />
						</TabPanel>
						<TabPanel value="payment" sx={{ height: "100%" }}>
							<PayementOrder />
						</TabPanel>
					</Box>
				</TabContext>
			</DialogContent>
			<DialogActions>
				<Stack direction={"row"} spacing={2} p={1}>
					<Button color={"inherit"} variant={"outlined"} onClick={deleteOrderFn}>
						Fermer
					</Button>
					<Tooltip title={validateTooltip}>
						<span>
							<Button variant={"contained"} color={"success"} onClick={updateOrderFn} disabled={cantValidate} sx={{ minWidth: 100 }}>
								{validateBtnLabel}
							</Button>
						</span>
					</Tooltip>
				</Stack>
			</DialogActions>
		</Dialog>
	);
}
