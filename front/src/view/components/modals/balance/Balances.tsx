import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../store";
import dayjs, { Dayjs } from "dayjs";
import { ModalComponentProps } from "../common/ModalProps";
import { OrderPaymentType } from "../../../../core/apis/backend/generated";
import { useMounted } from "../../../hooks/common/useMounted";
import { useOrderDates } from "../../../hooks/orders/useOrderDates";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { payementTypeLabel } from "../../orders/detail/payment/PayementOrder";
import { deleteOrderPayement, updatePaymentReceived } from "../../../../store/module/orders/orders.async.action";
import { Clear, PriceCheck } from "@mui/icons-material";
import { createConfirmModal } from "../../utils/popup/ConfirmPopup";

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

	// region edit row

	const updateRemote = useCallback(
		(row: typeof rows[number], value: number) => {
			dispatch(
				updatePaymentReceived({
					idOrder: row.idOrder,
					type: row.type,
					value: value,
				})
			);
		},
		[dispatch]
	);

	let onCellEditStop = useCallback(
		(row: GridRowModel<typeof rows[number]>) => {
			updateRemote(row, Number.parseFloat(row.received!.toString()));
			return row;
		},
		[updateRemote]
	);

	const fullReceived = useCallback(
		(row: typeof rows[number]) => () => {
			updateRemote(row, row.amount);
		},
		[updateRemote]
	);

	const deletePayement = useCallback(
		(row: typeof rows[number]) => async () => {
			const confirm = await createConfirmModal({
				title: "Supprimer le moyen de payement ?",
				content: (
					<Stack spacing={1} alignItems={"center"} m={1}>
						<Typography>Êtes-vous sur de vouloir supprimer le payement de </Typography>

						<Typography color={"secondary"}>
							{row.user} - {payementTypeLabel[row.type]}
						</Typography>

						<Typography>?</Typography>
					</Stack>
				),
			});
			if (confirm) {
				dispatch(deleteOrderPayement({ payementType: row.type, idOrder: row.idOrder }));
			}
		},
		[dispatch]
	);

	// endregion edit row

	const columns = useMemo(
		() =>
			[
				{
					field: "user",
					headerName: "User",
					width: 150,
					editable: false,
					disableColumnMenu: true,
					align: "left",
					headerAlign: "left",
				},
				{
					field: "type",
					headerName: "Type",
					sortable: false,
					disableColumnMenu: true,
					width: 150,
					renderCell: params => payementTypeLabel[params.value],
					align: "center",
					headerAlign: "center",
				},
				{
					field: "amount",
					headerName: "Amount",
					width: 130,
					disableColumnMenu: true,
					editable: false,
					align: "right",
					headerAlign: "right",
				},
				{
					field: "received",
					headerName: "Received",
					width: 130,
					editable: true,
					disableColumnMenu: true,
					align: "right",
					headerAlign: "right",
				},
				{
					field: "orderId",
					headerAlign: "center",
					disableColumnMenu: true,
					sortable: false,
					headerName: "Actions",
					editable: false,
					width: 200,
					renderCell: params => (
						<Stack spacing={2} justifyContent={"center"} width={"100%"} direction={"row"}>
							<Tooltip title={"La totalité du payement a été perçue"}>
								<IconButton color={"success"} onClick={fullReceived(params.row)}>
									<PriceCheck />
								</IconButton>
							</Tooltip>

							<Tooltip title={"Annuler le payement"}>
								<IconButton color={"error"} onClick={deletePayement(params.row)}>
									<Clear />
								</IconButton>
							</Tooltip>
						</Stack>
					),
				},
			] as GridColDef[],
		[deletePayement, fullReceived]
	);

	const [mounted, ref] = useMounted();

	const pageSize = useMemo(() => Math.floor(window.outerHeight / 100), []);

	if (!mounted && !open) return null;

	return (
		<Dialog open={open} ref={ref} onClose={setClose} fullWidth maxWidth={"md"}>
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
						getRowId={row => `${row.user}-${row.type}`}
						columns={columns}
						rows={rows}
						autoHeight
						processRowUpdate={onCellEditStop}
						pageSize={pageSize}
						rowsPerPageOptions={[pageSize]}
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
