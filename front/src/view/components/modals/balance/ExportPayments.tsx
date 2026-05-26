import React, { useCallback, useMemo, useState } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { ContentCopy, TaskAlt } from "@mui/icons-material";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Transition } from "../common/Transition";
import { ModalComponentProps } from "../common/ModalProps";
import { useMounted } from "@hooks/utils/useMounted";
import { useOrders } from "@/core/data/orders/orders.queries";
import { OrderPaymentType } from "@apis/rest/api/generated";
import { payementTypeLabel } from "../../orders/detail/payment/paymentLabels";
import { fmtPrice } from "@/core/utils/format";
import { useClientStore } from "@/core/store/clientStore";

type ExportRow = {
	rawDate: string;
	date: string;
	type: OrderPaymentType;
	remaining: number;
};

export function ExportPayments({ open, setClose }: ModalComponentProps) {
	const orders = useOrders();
	const orderName = useClientStore((s) => s.orderName);

	const users = useMemo(() => {
		const withPending = new Set(
			orders.filter((order) => order.payments.some((p) => p.type !== OrderPaymentType.Wallet && (p.received ?? 0) < p.amount)).map((order) => order.user),
		);
		return [...withPending].sort((a, b) => a.localeCompare(b));
	}, [orders]);

	const [selectedUser, setSelectedUser] = useState<string | null>(() => (orderName && users.includes(orderName) ? orderName : (users[0] ?? null)));

	const rows = useMemo<ExportRow[]>(() => {
		if (!selectedUser) return [];
		return orders
			.filter((order) => order.user === selectedUser)
			.flatMap((order) =>
				order.payments
					.filter((p) => p.type !== OrderPaymentType.Wallet)
					.filter((p) => (p.received ?? 0) < p.amount)
					.map((p) => ({
						rawDate: order.date,
						date: dayjs(order.date).format("DD/MM"),
						type: p.type,
						remaining: p.amount - (p.received ?? 0),
					})),
			)
			.sort((a, b) => (a.rawDate < b.rawDate ? 1 : -1));
	}, [orders, selectedUser]);

	const total = useMemo(() => rows.reduce((acc, r) => acc + r.remaining, 0), [rows]);

	const text = useMemo(() => {
		if (!selectedUser || rows.length === 0) return "";
		const lines = rows.map((r) => `* ${r.date} - ${payementTypeLabel[r.type]} - ${fmtPrice(r.remaining)}`);
		return `${selectedUser} :\n${lines.join("\n")}\nTotal : ${fmtPrice(total)}`;
	}, [selectedUser, rows, total]);

	const onUserChange = useCallback((_: React.SyntheticEvent, name: string | null) => {
		setSelectedUser(name);
	}, []);

	const copy = useCallback(async () => {
		if (!text) return;
		await navigator.clipboard.writeText(text);
		toast.success("Texte copié dans le presse papier");
		setClose();
	}, [text, setClose]);

	const [mounted, ref] = useMounted();

	if (!mounted && !open) return null;

	return (
		<Dialog open={open} ref={ref} onClose={setClose} TransitionComponent={Transition} fullWidth maxWidth={"sm"}>
			<DialogTitle>Exporter les paiements en attente</DialogTitle>
			<DialogContent dividers>
				<Stack p={1} spacing={2.5} minWidth={360}>
					<Autocomplete
						value={selectedUser}
						onChange={onUserChange}
						options={users}
						renderInput={(params) => <TextField {...params} label={"Utilisateur"} helperText={"La personne dont on exporte les paiements"} />}
					/>

					{rows.length === 0 ? (
						<Stack py={4} spacing={1.5} alignItems={"center"} justifyContent={"center"}>
							<TaskAlt color={"success"} sx={{ fontSize: 44 }} />
							<Typography variant={"body2"} color={"text.secondary"}>
								{selectedUser ? `Aucun paiement en attente pour ${selectedUser}` : "Sélectionnez un utilisateur"}
							</Typography>
						</Stack>
					) : (
						<Box
							sx={(t) => ({
								p: 2,
								borderRadius: 2,
								border: `1px solid ${t.palette.divider}`,
								bgcolor: t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
								fontFamily: "monospace",
								fontSize: 13,
								lineHeight: 1.7,
								whiteSpace: "pre-wrap",
								maxHeight: 360,
								overflowY: "auto",
							})}
						>
							{text}
						</Box>
					)}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Box p={1}>
					<Button variant={"outlined"} onClick={setClose}>
						Fermer
					</Button>
				</Box>
				<Box p={1}>
					<Button variant={"accent"} startIcon={<ContentCopy />} onClick={copy} disabled={!text}>
						Copier
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
}
