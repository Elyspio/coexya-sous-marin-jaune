import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useAppSelector } from "../../../../store";
import { groupBy } from "../../../../core/utils/array";
import dayjs, { Dayjs } from "dayjs";
import { BalanceItem } from "./BalanceItem";
import { Transition } from "../common/Transition";
import { ModalComponentProps } from "../common/ModalProps";
import { OrderPaymentType } from "../../../../core/apis/backend/generated";
import { useMounted } from "../../../hooks/common/useMounted";
import { useOrderDates } from "../../../hooks/orders/useOrderDates";

export function Balances({ setClose, open }: ModalComponentProps) {
	const allOrders = useAppSelector(s => s.orders.all);

	const availableDates = useOrderDates();

	const [selectedDate, setSelectedDate] = useState(availableDates[0]);

	const onSelectedDateChanged = useCallback((_, date: Dayjs | null) => {
		date && setSelectedDate(date);
	}, []);

	useEffect(() => {
		setSelectedDate(availableDates[0]);
	}, [availableDates]);

	const pendingPayments = useMemo(() => {
		const orders = Object.values(allOrders)
			.filter(order => selectedDate.isSame(order.date, "day"))
			.map(order =>
				order.payments
					.filter(p => p.type !== OrderPaymentType.Wallet)
					.map(p => ({
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
	}, [allOrders, selectedDate]);

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

	const [mounted, ref] = useMounted();

	if (!mounted && !open) return null;

	return (
		<Dialog open={open} ref={ref} onClose={setClose} TransitionComponent={Transition} fullWidth maxWidth={"sm"}>
			<DialogTitle>
				<Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
					<Typography>Payements en attentes</Typography>
					<Autocomplete
						getOptionLabel={option => option.format("DD/MM/YYYY")}
						onChange={onSelectedDateChanged}
						options={availableDates}
						value={selectedDate}
						clearIcon={null}
						renderInput={params => <TextField {...params} sx={{ minWidth: 180 }} label={"Date"} />}
					/>
				</Stack>
			</DialogTitle>
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
