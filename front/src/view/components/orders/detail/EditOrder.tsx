import React, { useCallback, useEffect, useMemo } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Tab, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { deleteOrder, updateRemoteOrder } from "../../../../store/module/orders/orders.async.action";
import { isToday } from "../list/CreateOrder";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { PayementOrder } from "./payment/PayementOrder";
import { EditMenuOrder } from "./EditMenuOrder";
import { setAlteringOrder } from "../../../../store/module/orders/orders.action";

type Workflow = "menu" | "payment";

export function EditOrder() {
	const { order, recordIndex, creating, config } = useAppSelector(state => {
		let orderId = state.orders.altering?.order;
		return {
			order: state.orders.all[orderId!],
			recordIndex: state.orders.altering?.record,
			creating: state.orders.mode.order === "create",
			config: state.config,
		};
	});

	const [workflow, setWorkflow] = React.useState<Workflow>("menu");

	const dispatch = useAppDispatch();

	const close = useCallback(() => {
		dispatch(setAlteringOrder());
	}, [dispatch]);

	const deleteOrderFn = React.useCallback(() => {
		if (creating) {
			dispatch(deleteOrder(order.id));
		}
		close();
	}, [creating, order, close]);

	const handleChange = (event: React.SyntheticEvent, newValue: Workflow) => {
		setWorkflow(newValue);
	};

	const updateOrderFn = React.useCallback(() => {
		if (workflow === "menu" && order?.paymentEnabled) {
			setWorkflow("payment");
		} else {
			dispatch(updateRemoteOrder());
			close();
		}
	}, [workflow, dispatch, close, config, order]);

	const remainingToPay = useMemo(() => {
		if (!order) return -1;
		const amountPaid = order.payments.reduce((acc, current) => acc + current.amount, 0);
		return order.price - amountPaid;
	}, [order]);

	useMemo(() => {
		if (!order) return true;
		if (order.burgers.length) return true;
		if (order.student && (!order.fries || !order.drink)) return true;
		return remainingToPay > 0;
	}, [order]);

	const validateTooltip = useMemo(() => {
		if (!order) return "";

		if (workflow === "menu") {
			// Burgers
			if (!order.burgers.length) return "Vous devez prendre au moins un burger";

			// Étudiant
			if (!order.student) return "";
			if (!order.fries) return "Vous devez prendre des frites";
			if (!order.drink) return "Vous devez prendre une boisson";
		}

		if (workflow === "payment" && order.paymentEnabled) {
			if (remainingToPay > 0) return `Il reste ${remainingToPay}€ à payer`;
			return "";
		}

		return "";
	}, [order, config, remainingToPay, workflow]);

	const cantValidate = useMemo(() => validateTooltip !== "", [workflow, validateTooltip]);

	const validateBtnLabel = useMemo(() => {
		if (!order) return "";

		if (workflow === "payment") return "Valider";

		if (order.paymentEnabled) return "Payer";

		return `Valider ${order?.price}€`;
	}, [workflow, config, order]);

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
						<TabList onChange={handleChange} variant={"fullWidth"} value={workflow}>
							<Tab label="Contenu" value="menu" />
							{order.paymentEnabled && <Tab label="Payement" value="payment" />}
						</TabList>
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
