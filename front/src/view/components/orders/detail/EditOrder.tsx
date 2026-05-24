import * as React from "react";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Drawer, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import Close from "@mui/icons-material/Close";
import Check from "@mui/icons-material/Check";
import ArrowForward from "@mui/icons-material/ArrowForward";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { EditMenuOrder } from "./EditMenuOrder";
import { PayementOrder } from "./payment/PayementOrder";
import { calculateOrderPrice } from "@/core/data/orders/orders.utils";
import { fmtPrice } from "@/core/utils/format";
import { useClientStore } from "@/core/store/clientStore";
import { useOrder } from "@/core/data/orders/orders.queries";
import { useDeleteOrder, useUpdateRemoteOrder } from "@/core/data/orders/orders.mutations";

type Step = "content" | "payment";

function StepTab({ active, done, disabled, num, label, onClick }: { active: boolean; done: boolean; disabled?: boolean; num: number; label: string; onClick: () => void }) {
	return (
		<Box
			component="button"
			disabled={disabled}
			onClick={onClick}
			sx={(t) => ({
				appearance: "none",
				border: 0,
				background: "transparent",
				display: "flex",
				alignItems: "center",
				gap: 1,
				py: "14px",
				mr: 3,
				cursor: disabled ? "not-allowed" : "pointer",
				opacity: disabled ? 0.5 : 1,
				fontSize: 13,
				fontWeight: 500,
				fontFamily: t.typography.fontFamily,
				color: active ? t.palette.custom.ink : t.palette.custom.ink3,
				borderBottom: `2px solid ${active ? t.palette.custom.ink : "transparent"}`,
				transition: "color 120ms ease, border-color 120ms ease",
			})}
		>
			<Box
				sx={(t) => ({
					width: 18,
					height: 18,
					borderRadius: "50%",
					display: "grid",
					placeItems: "center",
					fontSize: 11,
					fontFamily: t.typography.fontFamily,
					backgroundColor: done ? t.palette.custom.accent : active ? t.palette.custom.ink : t.palette.custom.paper2,
					color: done || active ? t.palette.custom.paper : t.palette.custom.ink3,
				})}
			>
				{done ? <Check sx={{ fontSize: 12 }} /> : num}
			</Box>
			{label}
		</Box>
	);
}

export function EditOrder() {
	const alteringId = useClientStore((s) => s.altering?.order);
	const creating = useClientStore((s) => s.mode.order === "create");
	const setAlteringOrder = useClientStore((s) => s.setAlteringOrder);
	const order = useOrder(alteringId);

	const [step, setStep] = useState<Step>("content");

	const { mutate: deleteOrder } = useDeleteOrder();
	const updateRemote = useUpdateRemoteOrder();

	const close = useCallback(() => setAlteringOrder(undefined), [setAlteringOrder]);

	const closeAndMaybeDelete = useCallback(() => {
		if (creating && order) deleteOrder(order.id);
		close();
	}, [creating, close, deleteOrder, order]);

	const price = useMemo(() => (order ? calculateOrderPrice(order) : 0), [order]);

	const remainingToPay = useMemo(() => {
		if (!order) return -1;
		const paid = order.payments.reduce((acc, p) => acc + p.amount, 0);
		return +(price - paid).toFixed(2);
	}, [order, price]);

	const advance = useCallback(() => {
		if (!order) return;
		if (step === "content" && order.paymentEnabled) {
			setStep("payment");
		} else {
			updateRemote.mutate(order);
			close();
		}
	}, [step, order, updateRemote, close]);

	const validateTooltip = useMemo(() => {
		if (!order) return "";
		if (step === "content") {
			if (!order.burgers.length) return "Vous devez prendre au moins un burger";
			if (order.student && !order.fries) return "Les étudiants prennent des frites";
			if (order.student && !order.drink) return "Les étudiants prennent une boisson";
			return "";
		}
		if (step === "payment" && order.paymentEnabled && remainingToPay > 0.001) return `Il reste ${fmtPrice(remainingToPay)} à payer`;
		return "";
	}, [order, step, remainingToPay]);

	const cantValidate = validateTooltip !== "";

	useEffect(() => {
		if (!order?.paymentEnabled) setStep("content");
	}, [order]);

	if (!order) return null;

	const hasBurger = order.burgers.length > 0;

	return (
		<Drawer
			anchor="right"
			open={Boolean(order)}
			onClose={closeAndMaybeDelete}
			slotProps={{ paper: { sx: { width: { xs: "100vw", sm: 560 }, maxWidth: "100vw", display: "flex", flexDirection: "column" } } }}
		>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={(t) => ({ p: "20px 24px 16px", borderBottom: `1px solid ${t.palette.custom.line}` })}>
				<Box sx={{ minWidth: 0 }}>
					<Typography variant="eyebrow">Commande · {dayjs(order.date).locale("fr").format("dddd D MMMM")}</Typography>
					<Typography variant="h4" noWrap>
						{creating ? "Nouvelle commande" : "Modifier"}
						<Box component="span" sx={{ color: "custom.ink3", fontSize: 15, fontWeight: 400, ml: 0.75 }}>
							· {order.user}
						</Box>
					</Typography>
				</Box>
				<IconButton onClick={closeAndMaybeDelete}>
					<Close sx={{ fontSize: 18 }} />
				</IconButton>
			</Stack>

			<Stack direction="row" sx={(t) => ({ px: 3, borderBottom: `1px solid ${t.palette.custom.line}` })}>
				<StepTab active={step === "content"} done={step === "payment"} num={1} label="Contenu" onClick={() => setStep("content")} />
				{order.paymentEnabled && (
					<StepTab active={step === "payment"} done={false} disabled={!hasBurger} num={2} label="Paiement" onClick={() => hasBurger && setStep("payment")} />
				)}
			</Stack>

			<Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
				{step === "content" ? (
					<EditMenuOrder />
				) : (
					<Suspense fallback={null}>
						<PayementOrder />
					</Suspense>
				)}
			</Box>

			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={(t) => ({ p: "14px 24px", borderTop: `1px solid ${t.palette.custom.line}` })}>
				<Stack direction="row" alignItems="baseline" spacing={1}>
					<Typography variant="eyebrow">Total</Typography>
					<Typography variant="mono" data-testid="panel-total" sx={{ fontSize: 20, fontWeight: 500 }}>
						{fmtPrice(price)}
					</Typography>
					{step === "payment" && remainingToPay > 0.001 && (
						<Typography variant="mono" sx={{ ml: 1, fontSize: 13, color: "custom.ink3" }}>
							· reste {fmtPrice(remainingToPay)}
						</Typography>
					)}
				</Stack>
				<Stack direction="row" spacing={1.25}>
					<Button variant="soft" onClick={closeAndMaybeDelete}>
						Fermer
					</Button>
					<Tooltip title={validateTooltip}>
						<span>
							<Button variant="accent" disabled={cantValidate} onClick={advance} endIcon={step === "content" && order.paymentEnabled ? <ArrowForward /> : undefined} startIcon={step === "payment" || !order.paymentEnabled ? <Check /> : undefined}>
								{step === "payment" ? "Valider" : order.paymentEnabled ? "Payer" : `Valider ${fmtPrice(price)}`}
							</Button>
						</span>
					</Tooltip>
				</Stack>
			</Stack>
		</Drawer>
	);
}
