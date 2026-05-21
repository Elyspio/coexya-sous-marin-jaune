import React, { useCallback, useMemo, useState } from "react";
import {
	Autocomplete,
	Avatar,
	Badge,
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fade,
	IconButton,
	Paper,
	Stack,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { ModalComponentProps } from "../common/ModalProps";
import { OrderPaymentType } from "@apis/backend/generated";
import { useMounted } from "@hooks/utils/useMounted";
import { useOrderDates } from "@hooks/orders/useOrderDates";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { payementTypeLabel } from "../../orders/detail/payment/PayementOrder";
import { useOrders } from "@/core/data/orders/orders.queries";
import { useDeleteOrderPayment, useUpdatePaymentReceived } from "@/core/data/orders/orders.mutations";
import { CalendarMonth, Category, Clear, PriceCheck, TaskAlt } from "@mui/icons-material";
import { createConfirmModal } from "../../utils/popup/ConfirmPopup";
import Bank from "@/view/icons/bank.png";
import Cash from "@/view/icons/cash.png";
import TicketRestaurant from "@/view/icons/ticket-restaurant.png";
import Picsou from "@/view/icons/picsou.gif";
import Paypal from "@/view/icons/paypal.svg";

type ViewMode = "date" | "method";

type PendingRow = {
	type: OrderPaymentType;
	amount: number;
	received?: number;
	date: string;
	rawDate: string;
	user: string;
	idOrder: string;
};

const paymentTypeIcon: Partial<Record<OrderPaymentType, string>> = {
	[OrderPaymentType.BankTransfer]: Bank,
	[OrderPaymentType.Cash]: Cash,
	[OrderPaymentType.LunchVoucher]: TicketRestaurant,
	[OrderPaymentType.Admin]: Picsou,
	[OrderPaymentType.Paypal]: Paypal,
	[OrderPaymentType.Wero]: "https://dkfyb2lgyu0b1.cloudfront.net/img_article/wero2.jpg",
};

const groupOrder: OrderPaymentType[] = [
	OrderPaymentType.Paypal,
	OrderPaymentType.BankTransfer,
	OrderPaymentType.Wero,
	OrderPaymentType.Cash,
	OrderPaymentType.LunchVoucher,
	OrderPaymentType.Admin,
];

export function Balances({ setClose, open }: ModalComponentProps) {
	const allOrders = useOrders();
	const { mutate: updatePaymentReceived } = useUpdatePaymentReceived();
	const { mutate: deleteOrderPayement } = useDeleteOrderPayment();

	const [viewMode, setViewMode] = useState<ViewMode>("date");

	const onViewModeChange = useCallback((_: React.MouseEvent<HTMLElement>, next: ViewMode | null) => {
		if (next) setViewMode(next);
	}, []);

	// region selectedDate

	const availableDates = useOrderDates();

	const [selectedDate, setSelectedDate] = useState(availableDates[0] ?? null);

	const onSelectedDateChanged = useCallback((_: React.SyntheticEvent, date: Dayjs | null) => {
		date && setSelectedDate(date);
	}, []);

	// endregion selectedDate

	const rows = useMemo<PendingRow[]>(() => {
		if (!selectedDate) return [];
		return allOrders
			.filter((order) => selectedDate.isSame(order.date, "day"))
			.flatMap((order) =>
				order.payments
					.filter((p) => p.type !== OrderPaymentType.Wallet)
					.map((p) => ({
						...p,
						date: dayjs(order.date).format("DD/MM/YYYY"),
						rawDate: order.date,
						user: order.user,
						idOrder: order.id,
					}))
			);
	}, [allOrders, selectedDate]);

	const allPendingRows = useMemo<PendingRow[]>(() => {
		return allOrders.flatMap((order) =>
			order.payments
				.filter((p) => p.type !== OrderPaymentType.Wallet)
				.filter((p) => (p.received ?? 0) < p.amount)
				.map((p) => ({
					...p,
					date: dayjs(order.date).format("DD/MM/YYYY"),
					rawDate: order.date,
					user: order.user,
					idOrder: order.id,
				}))
		);
	}, [allOrders]);

	const grouped = useMemo(() => {
		const map = new Map<OrderPaymentType, PendingRow[]>();
		for (const row of allPendingRows) {
			if (!map.has(row.type)) map.set(row.type, []);
			map.get(row.type)!.push(row);
		}
		for (const list of map.values()) {
			list.sort((a, b) => (a.rawDate < b.rawDate ? -1 : 1));
		}
		return map;
	}, [allPendingRows]);

	// region edit row

	const updateRemote = useCallback(
		(row: PendingRow, value: number) => {
			updatePaymentReceived({
				idOrder: row.idOrder,
				type: row.type,
				value: value,
			});
		},
		[updatePaymentReceived]
	);

	const onCellEditStop = useCallback(
		(row: GridRowModel<PendingRow>) => {
			updateRemote(row, Number.parseFloat(row.received!.toString()));
			return row;
		},
		[updateRemote]
	);

	const fullReceived = useCallback(
		(row: PendingRow) => () => {
			updateRemote(row, row.amount);
		},
		[updateRemote]
	);

	const deletePayement = useCallback(
		(row: PendingRow) => async () => {
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
				deleteOrderPayement({
					payementType: row.type,
					idOrder: row.idOrder,
				});
			}
		},
		[deleteOrderPayement]
	);

	// endregion edit row

	const actionsColumn = useCallback<(extra?: GridColDef) => GridColDef>(
		() => ({
			field: "actions",
			headerAlign: "center",
			disableColumnMenu: true,
			sortable: false,
			headerName: "Actions",
			editable: false,
			width: 140,
			renderCell: (params) => (
				<Stack spacing={1} justifyContent={"center"} width={"100%"} direction={"row"}>
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
		}),
		[deletePayement, fullReceived]
	);

	const columnsByDate = useMemo<GridColDef[]>(
		() => [
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
				renderCell: (params) => payementTypeLabel[params.value as OrderPaymentType],
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
			actionsColumn(),
		],
		[actionsColumn]
	);

	const columnsByMethod = useMemo<GridColDef[]>(
		() => [
			{
				field: "date",
				headerName: "Date",
				width: 120,
				disableColumnMenu: true,
				align: "left",
				headerAlign: "left",
			},
			{
				field: "user",
				headerName: "User",
				width: 160,
				flex: 1,
				editable: false,
				disableColumnMenu: true,
				align: "left",
				headerAlign: "left",
			},
			{
				field: "amount",
				headerName: "Dû",
				width: 110,
				disableColumnMenu: true,
				editable: false,
				align: "right",
				headerAlign: "right",
			},
			{
				field: "received",
				headerName: "Reçu",
				width: 110,
				editable: true,
				disableColumnMenu: true,
				align: "right",
				headerAlign: "right",
			},
			actionsColumn(),
		],
		[actionsColumn]
	);

	const [mounted, ref] = useMounted();

	if (!mounted && !open) return null;

	return (
		<Dialog open={open} ref={ref} onClose={setClose} fullWidth maxWidth={"md"}>
			<DialogTitle>
				<Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"} flexWrap={"wrap"}>
					<Stack direction={"row"} spacing={2} alignItems={"center"}>
						<Typography>Payements en attentes</Typography>
						<ToggleButtonGroup size={"small"} exclusive value={viewMode} onChange={onViewModeChange} color={"primary"}>
							<ToggleButton value={"date"}>
								<Stack direction={"row"} spacing={1} alignItems={"center"}>
									<CalendarMonth fontSize={"small"} />
									<Typography variant={"button"} fontSize={12}>
										Par date
									</Typography>
								</Stack>
							</ToggleButton>
							<ToggleButton value={"method"}>
								<Stack direction={"row"} spacing={1} alignItems={"center"}>
									<Category fontSize={"small"} />
									<Typography variant={"button"} fontSize={12}>
										Par moyen
									</Typography>
								</Stack>
							</ToggleButton>
						</ToggleButtonGroup>
					</Stack>
					{viewMode === "date" && (
						<Autocomplete
							getOptionLabel={(option) => option.format("DD/MM/YYYY")}
							onChange={onSelectedDateChanged}
							options={availableDates}
							value={selectedDate}
							clearIcon={null}
							renderInput={(params) => <TextField {...params} sx={{ minWidth: 180 }} label={"Date"} />}
						/>
					)}
				</Stack>
			</DialogTitle>
			<DialogContent dividers>
				{viewMode === "date" ? (
					<Stack p={2} spacing={3}>
						<DataGrid getRowId={(row) => `${row.idOrder}-${row.type}`} columns={columnsByDate} rows={rows} autoHeight processRowUpdate={onCellEditStop} />
					</Stack>
				) : (
					<ByMethodView
						grouped={grouped}
						columns={columnsByMethod}
						onCellEditStop={onCellEditStop}
					/>
				)}
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

function ByMethodView({
	grouped,
	columns,
	onCellEditStop,
}: {
	grouped: Map<OrderPaymentType, PendingRow[]>;
	columns: GridColDef[];
	onCellEditStop: (row: GridRowModel<PendingRow>) => PendingRow;
}) {
	const theme = useTheme();

	const orderedGroups = useMemo(() => {
		return groupOrder.filter((t) => grouped.has(t)).map((t) => [t, grouped.get(t)!] as const);
	}, [grouped]);

	if (orderedGroups.length === 0) {
		return (
			<Stack p={6} spacing={2} alignItems={"center"} justifyContent={"center"}>
				<TaskAlt color={"success"} sx={{ fontSize: 56 }} />
				<Typography variant={"h6"}>Aucun paiement en attente</Typography>
				<Typography variant={"body2"} color={"text.secondary"}>
					Tout est soldé. Bonne nouvelle.
				</Typography>
			</Stack>
		);
	}

	return (
		<Stack p={2} spacing={2.5}>
			{orderedGroups.map(([type, list], idx) => {
				const totalDue = list.reduce((acc, r) => acc + r.amount, 0);
				const totalReceived = list.reduce((acc, r) => acc + (r.received ?? 0), 0);
				const remaining = totalDue - totalReceived;
				const iconSrc = paymentTypeIcon[type];

				return (
					<Fade in key={type} timeout={250} style={{ transitionDelay: `${idx * 60}ms` }}>
						<Paper
							variant={"outlined"}
							sx={{
								borderRadius: 2,
								overflow: "hidden",
								borderColor: theme.palette.divider,
							}}
						>
							<Stack
								direction={"row"}
								alignItems={"center"}
								spacing={2}
								px={2}
								py={1.5}
								sx={{
									bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
									borderBottom: `1px solid ${theme.palette.divider}`,
								}}
							>
								<Badge
									badgeContent={list.length}
									color={"primary"}
									overlap={"circular"}
									anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
								>
									<Avatar
										src={iconSrc}
										variant={"rounded"}
										sx={{
											width: 44,
											height: 44,
											bgcolor: "transparent",
											border: `1px solid ${theme.palette.divider}`,
											"& img": { objectFit: "contain", p: 0.5 },
										}}
									>
										{payementTypeLabel[type][0]}
									</Avatar>
								</Badge>

								<Stack flex={1} spacing={0.25}>
									<Typography variant={"subtitle1"} fontWeight={600} lineHeight={1.2}>
										{payementTypeLabel[type]}
									</Typography>
									<Typography variant={"caption"} color={"text.secondary"}>
										{list.length} paiement{list.length > 1 ? "s" : ""} en attente
									</Typography>
								</Stack>

								<Stack direction={"row"} spacing={1} alignItems={"center"}>
									<Chip
										size={"small"}
										variant={"outlined"}
										label={`Dû ${totalDue.toFixed(2)} €`}
									/>
									<Chip
										size={"small"}
										variant={"outlined"}
										color={"success"}
										label={`Reçu ${totalReceived.toFixed(2)} €`}
									/>
									<Chip
										size={"small"}
										color={remaining > 0 ? "warning" : "success"}
										label={`Reste ${remaining.toFixed(2)} €`}
									/>
								</Stack>
							</Stack>

							<Box px={1.5} pb={1.5} pt={0.5}>
								<DataGrid
									getRowId={(row) => `${row.idOrder}-${row.type}`}
									columns={columns}
									rows={list}
									autoHeight
									processRowUpdate={onCellEditStop}
									hideFooter={list.length <= 5}
									pageSizeOptions={[5, 10, 25]}
									initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
									density={"compact"}
									disableRowSelectionOnClick
									sx={{
										border: "none",
										"& .MuiDataGrid-columnHeaders": { bgcolor: "transparent" },
									}}
								/>
							</Box>
						</Paper>
					</Fade>
				);
			})}
		</Stack>
	);
}
