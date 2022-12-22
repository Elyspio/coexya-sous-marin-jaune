import React, { useMemo } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../../../store";
import { groupBy } from "../../../../core/utils/array";
import dayjs from "dayjs";
import { BalanceItem } from "./BalanceItem";
import { Transition } from "../common/Transition";
import { ModalComponentProps } from "../common/ModalProps";

export function Balances({ setClose, open }: ModalComponentProps) {
	const allOrders = useAppSelector(s => s.orders.all);

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

		globalEntries.sort((e1, e2) => {
			return e1[0].localeCompare(e2[0]);
		});

		return globalEntries.map(([user, elements]) => (
			<Stack spacing={1} bgcolor={"background.default"} p={1} key={user}>
				<Typography pl={1} fontSize={"120%"}>
					{user}
				</Typography>
				<Stack spacing={2} bgcolor={"background.paper"} p={2}>
					{Object.entries(elements)
						.reverse()
						.map(([date, payments]) => (
							<Stack spacing={2} key={date}>
								<Typography variant={"subtitle1"} fontSize={"90%"}>
									{date}
								</Typography>
								<Stack bgcolor={"background.default"} pl={2} borderRadius={2} spacing={1}>
									{payments.map(p => (
										<BalanceItem key={p.type} {...p} />
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
