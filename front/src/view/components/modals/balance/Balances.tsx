import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Badge, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Fade, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { ModalComponentProps } from "../common/ModalProps";
import { OrderPaymentType } from "@apis/backend/generated";
import { useMounted } from "@hooks/utils/useMounted";
import { payementTypeLabel } from "../../orders/detail/payment/paymentLabels";
import { useOrders } from "@/core/data/orders/orders.queries";
import { useDeleteOrderPayment, useUpdatePaymentReceived } from "@/core/data/orders/orders.mutations";
import { Clear, IosShare, PriceCheck, TaskAlt } from "@mui/icons-material";
import { createConfirmModal } from "../../utils/popup/ConfirmPopup";
import { ExportPayments } from "./ExportPayments";
import Bank from "@/view/icons/bank.png";
import Cash from "@/view/icons/cash.png";
import TicketRestaurant from "@/view/icons/ticket-restaurant.png";
import Picsou from "@/view/icons/picsou.gif";
import Paypal from "@/view/icons/paypal.svg";

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
				})),
		);
	}, [allOrders]);

	const grouped = useMemo(() => {
		const map = new Map<OrderPaymentType, PendingRow[]>();
		for (const row of allPendingRows) {
			if (!map.has(row.type)) map.set(row.type, []);
			map.get(row.type)!.push(row);
		}
		// Plus récent en premier.
		for (const list of map.values()) {
			list.sort((a, b) => (a.rawDate < b.rawDate ? 1 : -1));
		}
		return map;
	}, [allPendingRows]);

	const updateRemote = useCallback(
		(row: PendingRow, value: number) => {
			updatePaymentReceived({
				idOrder: row.idOrder,
				type: row.type,
				value: value,
			});
		},
		[updatePaymentReceived],
	);

	const fullReceived = useCallback(
		(row: PendingRow) => {
			updateRemote(row, row.amount);
		},
		[updateRemote],
	);

	const deletePayement = useCallback(
		async (row: PendingRow) => {
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
		[deleteOrderPayement],
	);

	const [mounted, ref] = useMounted();
	const [exportOpen, setExportOpen] = useState(false);

	if (!mounted && !open) return null;

	return (
		<Dialog open={open} ref={ref} onClose={setClose} fullWidth maxWidth={"xl"}>
			<DialogTitle>Payements en attentes</DialogTitle>
			<DialogContent dividers>
				<ByMethodView grouped={grouped} onCommitReceived={updateRemote} onFull={fullReceived} onDelete={deletePayement} />
			</DialogContent>
			<DialogActions>
				<Box p={1}>
					<Button variant={"outlined"} startIcon={<IosShare />} onClick={() => setExportOpen(true)}>
						Exporter
					</Button>
				</Box>
				<Box p={1}>
					<Button variant={"outlined"} color={"success"} onClick={setClose}>
						Fermer
					</Button>
				</Box>
			</DialogActions>

			<ExportPayments open={exportOpen} setClose={() => setExportOpen(false)} />
		</Dialog>
	);
}

type RowActions = {
	onCommitReceived: (row: PendingRow, value: number) => void;
	onFull: (row: PendingRow) => void;
	onDelete: (row: PendingRow) => void;
};

function ByMethodView({ grouped, ...actions }: { grouped: Map<OrderPaymentType, PendingRow[]> } & RowActions) {
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
		<Box
			sx={{
				display: "flex",
				flexWrap: "wrap",
				alignItems: "flex-start",
				gap: 2,
				p: 1,
			}}
		>
			{orderedGroups.map(([type, list], idx) => (
				<MethodCard key={type} type={type} list={list} index={idx} {...actions} />
			))}
		</Box>
	);
}

const BATCH = 12;

function MethodCard({ type, list, index, onCommitReceived, onFull, onDelete }: { type: OrderPaymentType; list: PendingRow[]; index: number } & RowActions) {
	const theme = useTheme();
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const sentinelRef = useRef<HTMLDivElement | null>(null);
	const [count, setCount] = useState(BATCH);

	// Reset the visible window back to the first batch whenever the underlying list changes.
	const [trackedList, setTrackedList] = useState(list);
	if (trackedList !== list) {
		setTrackedList(list);
		setCount(BATCH);
	}

	const hasMore = count < list.length;

	useEffect(() => {
		if (!hasMore) return;
		const root = scrollRef.current;
		const node = sentinelRef.current;
		if (!root || !node) return;
		const obs = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) setCount((c) => Math.min(c + BATCH, list.length));
			},
			{ root, rootMargin: "150px" },
		);
		obs.observe(node);
		return () => obs.disconnect();
	}, [hasMore, list.length]);

	const totalDue = list.reduce((acc, r) => acc + r.amount, 0);
	const totalReceived = list.reduce((acc, r) => acc + (r.received ?? 0), 0);
	const remaining = totalDue - totalReceived;
	const iconSrc = paymentTypeIcon[type];
	const visible = list.slice(0, count);

	return (
		<Fade in timeout={250} style={{ transitionDelay: `${index * 60}ms` }}>
			<Paper
				variant={"outlined"}
				sx={{
					borderRadius: 2,
					overflow: "hidden",
					borderColor: theme.palette.divider,
					display: "flex",
					flexDirection: "column",
					flex: "1 1 340px",
					minWidth: 300,
					maxWidth: 1,
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
					<Badge badgeContent={list.length} color={"primary"} overlap={"circular"} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
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

					<Stack flex={1} minWidth={0} spacing={0.25}>
						<Typography variant={"subtitle1"} fontWeight={600} lineHeight={1.2} noWrap>
							{payementTypeLabel[type]}
						</Typography>
						<Typography variant={"caption"} color={"text.secondary"}>
							{list.length} paiement{list.length > 1 ? "s" : ""} en attente
						</Typography>
					</Stack>

					<Chip size={"small"} color={remaining > 0 ? "warning" : "success"} label={`Reste ${remaining.toFixed(2)} €`} />
				</Stack>

				<Box
					ref={scrollRef}
					sx={{
						maxHeight: 440,
						overflowY: "auto",
					}}
				>
					{visible.map((row) => (
						<PendingItem key={`${row.idOrder}-${row.type}`} row={row} onCommitReceived={onCommitReceived} onFull={onFull} onDelete={onDelete} />
					))}
					{hasMore && <Box ref={sentinelRef} sx={{ height: 1 }} />}
				</Box>
			</Paper>
		</Fade>
	);
}

function PendingItem({ row, onCommitReceived, onFull, onDelete }: { row: PendingRow } & RowActions) {
	return (
		<Stack
			spacing={0.75}
			px={1.75}
			py={1.25}
			sx={{
				borderBottom: (t) => `1px solid ${t.palette.divider}`,
				"&:last-of-type": { borderBottom: "none" },
			}}
		>
			<Stack direction={"row"} alignItems={"baseline"} spacing={1}>
				<Typography variant={"subtitle2"} fontWeight={600} noWrap flex={1} minWidth={0}>
					{row.user}
				</Typography>
				<Typography variant={"caption"} color={"text.secondary"} sx={{ flexShrink: 0 }}>
					{row.date}
				</Typography>
			</Stack>

			<Stack direction={"row"} alignItems={"center"} spacing={1}>
				<Chip size={"small"} variant={"outlined"} label={`Dû ${row.amount.toFixed(2)} €`} sx={{ flexShrink: 0 }} />

				<ReceivedInput key={`received-${row.received ?? 0}`} row={row} onCommit={onCommitReceived} />

				<Box flex={1} />

				<Tooltip title={"La totalité du payement a été perçue"}>
					<IconButton size={"small"} color={"success"} onClick={() => onFull(row)}>
						<PriceCheck fontSize={"small"} />
					</IconButton>
				</Tooltip>

				<Tooltip title={"Annuler le payement"}>
					<IconButton size={"small"} color={"error"} onClick={() => onDelete(row)}>
						<Clear fontSize={"small"} />
					</IconButton>
				</Tooltip>
			</Stack>
		</Stack>
	);
}

function ReceivedInput({ row, onCommit }: { row: PendingRow; onCommit: (row: PendingRow, value: number) => void }) {
	const [value, setValue] = useState((row.received ?? 0).toString());

	const commit = useCallback(() => {
		const num = Number.parseFloat(value.replace(",", "."));
		if (!Number.isNaN(num) && num !== (row.received ?? 0)) onCommit(row, num);
	}, [value, row, onCommit]);

	return (
		<TextField
			value={value}
			onChange={(e) => setValue(e.target.value)}
			onBlur={commit}
			onKeyDown={(e) => {
				if (e.key === "Enter") (e.target as HTMLInputElement).blur();
			}}
			size={"small"}
			type={"number"}
			label={"Reçu"}
			sx={{ width: 116, flexShrink: 0 }}
			slotProps={{
				input: {
					endAdornment: <InputAdornment position={"end"}>€</InputAdornment>,
				},
				htmlInput: { step: "0.01", style: { textAlign: "right" } },
			}}
		/>
	);
}
