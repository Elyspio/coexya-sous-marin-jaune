import React, { ChangeEvent, useCallback, useMemo } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store";
import { TransitionProps } from "@mui/material/transitions";
import { groupBy } from "../../../core/utils/array";
import dayjs from "dayjs";
import { PriceCheck } from "@mui/icons-material";
import { payementTypeLabel } from "../orders/detail/payment/PayementOrder";
import { Order, OrderPayment, OrderPaymentType } from "../../../core/apis/backend/generated";
import { updatePaymentReceived } from "../../../store/module/orders/orders.async.action";

export type ModalComponentProps = {
	setClose: () => void;
	open: boolean;
};

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="left" ref={ref} {...props} />;
});

export function Balances({ setClose, open }: ModalComponentProps) {
	const allOrders = useAppSelector(s => s.orders.all);

	const dispatch = useAppDispatch();

	const fullReceived = useCallback(
		(idOrder: Order["id"], payment: OrderPayment) => () => {
			dispatch(updatePaymentReceived({ idOrder, type: payment.type, value: payment.amount }));
		},
		[dispatch]
	);

	const updatePayment = useCallback(
		(idOrder: Order["id"], type: OrderPaymentType) => (e: ChangeEvent<HTMLInputElement>) => {
			dispatch(updatePaymentReceived({ idOrder, type, value: Number.parseFloat(e.target.value) }));
		},
		[dispatch]
	);

	const pendingPayments = useMemo(() => {
		const orders = Object.values(allOrders)
			.map(order =>
				order.payments.map(p => ({
					...p,
					date: dayjs(order.date).format("DD/MM/YYYY"),
					user: order.user,
					idOrder: order.id,
				}))
			)
			.flat();
		const userGrouped = groupBy(orders, "user");

		return Object.entries(userGrouped).reduce((acc, [user, payments]) => {
			acc[user] = groupBy(payments, "date");
			return acc;
		}, {} as Record<string, Record<string, typeof userGrouped[string]>>);
	}, [allOrders]);

	const rows = useMemo(() => {
		if (!open) return null;

		const globalEntries = Object.entries(pendingPayments);
		globalEntries.sort((e1, e2) => e1[0].localeCompare(e2[0]));

		return globalEntries.map(([user, elements]) => (
			<Stack spacing={1} bgcolor={"background.default"} p={1} key={user}>
				<Typography fontSize={"120%"}>{user}</Typography>
				<Stack pl={2} spacing={2} bgcolor={"background.paper"} p={2}>
					{Object.entries(elements).map(([date, payments]) => (
						<Stack spacing={2} key={date}>
							<Typography variant={"subtitle1"} fontSize={"90%"}>
								{date}
							</Typography>
							<Stack bgcolor={"background.default"} pl={2} borderRadius={2} spacing={1}>
								{payments.map(p => (
									<Stack direction={"row"} spacing={4} alignItems={"center"} key={p.type}>
										<Typography width={130} variant={"body1"}>
											{payementTypeLabel[p.type]}
										</Typography>
										<Tooltip title={"Montant prévu"}>
											<Typography variant={"body1"}>{p.amount}</Typography>
										</Tooltip>
										<Tooltip title={"Montant reçu"}>
											<TextField
												variant={"outlined"}
												size={"small"}
												inputProps={{
													min: 0,
													max: p.amount,
												}}
												type={"number"}
												value={p.received ?? 0}
												onChange={updatePayment(p.idOrder, p.type)}
											/>
										</Tooltip>

										<Tooltip title={"La totalité du payement a été perçue"}>
											<IconButton onClick={fullReceived(p.idOrder, p)}>
												<PriceCheck color={"success"} />
											</IconButton>
										</Tooltip>
									</Stack>
								))}
							</Stack>
						</Stack>
					))}
				</Stack>
			</Stack>
		));
	}, [pendingPayments, open]);

	return (
		<Dialog open={open} onClose={setClose} TransitionComponent={Transition} fullWidth maxWidth={"sm"}>
			<DialogTitle>Payements en attentes</DialogTitle>
			<DialogContent dividers>
				<Stack p={2} spacing={3}>
					{rows}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Box p={1}>
					<Button variant={"outlined"} color={"success"} onClick={setClose}>
						Fermer
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
}
