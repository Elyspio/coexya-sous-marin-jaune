import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../store";
import dayjs, { Dayjs } from "dayjs";
import { Transition } from "../common/Transition";
import { ModalComponentProps } from "../common/ModalProps";
import { OrderPaymentType } from "../../../../core/apis/backend/generated";
import { useMounted } from "../../../hooks/common/useMounted";
import { useOrderDates } from "../../../hooks/orders/useOrderDates";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { payementTypeLabel } from "../../orders/detail/payment/PayementOrder";
import { updatePaymentReceived } from "../../../../store/module/orders/orders.async.action";

export function Balances({ setClose, open }: ModalComponentProps) {
	const dispatch = useAppDispatch();

	const allOrders = useAppSelector(s => s.orders.all);

	// region selectedDate

	const availableDates = useOrderDates();

	const [selectedDate, setSelectedDate] = useState(availableDates[0] ?? dayjs());

	const onSelectedDateChanged = useCallback((_, date: Dayjs | null) => {
		date && setSelectedDate(date);
	}, []);

	useEffect(() => {
		availableDates.length && setSelectedDate(availableDates[0]);
	}, [availableDates]);

	// endregion selectedDate

	const rows = useMemo(() => {
		return Object.values(allOrders)
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
	}, [allOrders, selectedDate]);

	let onCellEditStop = useCallback(
		(row: GridRowModel<typeof rows[number]>) => {
			dispatch(
				updatePaymentReceived({
					idOrder: row.idOrder,
					type: row.type,
					value: Number.parseFloat(row.received!.toString()),
				})
			);
			return row;
		},
		[dispatch]
	);

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
					<DataGrid
						experimentalFeatures={{ newEditingApi: true }}
						getRowId={row => row.idOrder}
						columns={columns}
						rows={rows}
						autoHeight
						processRowUpdate={onCellEditStop}
						rowsPerPageOptions={[20]}
					/>
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

const columns: GridColDef[] = [
	{
		field: "user",
		headerName: "User",
		width: 150,
		editable: false,
		align: "center",
		headerAlign: "center",
	},
	{
		field: "type",
		headerName: "Type",
		width: 150,
		renderCell: params => payementTypeLabel[params.value],
		align: "center",
		headerAlign: "center",
	},
	{ field: "amount", headerName: "Amount", width: 100, editable: false, align: "right", headerAlign: "right" },
	{ field: "received", headerName: "Received", width: 100, editable: true, align: "right", headerAlign: "right" },
];
