import * as React from "react";
import { useMemo } from "react";
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Fastfood from "@mui/icons-material/Fastfood";
import LocalDrink from "@mui/icons-material/LocalDrink";
import Cookie from "@mui/icons-material/Cookie";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { BurgerRecord, Order, OrderPaymentType } from "@apis/rest/api/generated";
import { calculateOrderPrice, isUpcoming } from "@/core/data/orders/orders.utils";
import { fmtPrice } from "@/core/utils/format";
import { drinkLabels } from "../../modals/OrderMessageModal";
import { Avatar } from "@components/ui/Avatar";
import { useClientStore } from "@/core/store/clientStore";
import { useIsAdmin } from "@hooks/permissions/useIsAdmin";
import { useCanCreateOrder } from "@hooks/orders/useCanCreateOrder";
import { useDuplicateOrder } from "@/core/data/orders/orders.mutations";

type PayStatus = { kind: "ok" } | { kind: "pending" } | { kind: "missing"; remaining: number } | null;

function usePayStatus(order: Order): PayStatus {
	return useMemo(() => {
		if (!order.paymentEnabled) return null;
		const price = calculateOrderPrice(order);
		const wallet = order.payments.find((p) => p.type === OrderPaymentType.Wallet)?.amount ?? 0;
		const paid = order.payments.reduce((acc, p) => acc + p.amount, 0);
		const received = order.payments.reduce((acc, p) => acc + (p.received ?? 0), 0);
		if (paid < price - wallet - 0.001) return { kind: "missing", remaining: price - wallet - paid };
		if (received < price - wallet - 0.001) return { kind: "pending" };
		return { kind: "ok" };
	}, [order]);
}

const toneChip = (variant: "xl" | "student") => (theme: import("@mui/material/styles").Theme) =>
	variant === "xl"
		? { color: theme.palette.custom.clay, borderColor: theme.palette.custom.clay, backgroundColor: theme.palette.custom.claySoft }
		: { color: theme.palette.custom.accent, borderColor: theme.palette.custom.accent, backgroundColor: theme.palette.custom.accentSoft };

function PaymentFlag({ status }: { status: PayStatus }) {
	if (!status) return null;
	const map = {
		pending: { icon: <ScheduleIcon sx={{ fontSize: 12 }} />, label: "Validation", fg: "custom.warn" as const, bg: "custom.warnSoft" as const },
		missing: { icon: <ErrorOutline sx={{ fontSize: 12 }} />, label: status.kind === "missing" ? fmtPrice(status.remaining) : "", fg: "custom.danger" as const, bg: "custom.dangerSoft" as const },
		ok: { icon: <CheckCircleOutline sx={{ fontSize: 12 }} />, label: "Payé", fg: "custom.accent" as const, bg: "custom.accentSoft" as const },
	}[status.kind];
	return (
		<Stack direction="row" alignItems="center" spacing={0.5} sx={{ px: 0.875, py: 0.375, borderRadius: 999, color: map.fg, backgroundColor: map.bg }}>
			{map.icon}
			<Typography variant="mono" sx={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
				{map.label}
			</Typography>
		</Stack>
	);
}

export function OrderRow({ data }: { data: Order }) {
	const orderName = useClientStore((s) => s.orderName);
	const setAlteringOrder = useClientStore((s) => s.setAlteringOrder);
	const openModalWithOptions = useClientStore((s) => s.openModalWithOptions);
	const duplicateOrder = useDuplicateOrder();
	const isAdmin = useIsAdmin();
	const canCreate = useCanCreateOrder();

	const isSelf = data.user === orderName;
	const price = useMemo(() => calculateOrderPrice(data), [data]);
	const status = usePayStatus(data);

	const edit = React.useCallback(() => setAlteringOrder(data.id), [data.id, setAlteringOrder]);
	const del = React.useCallback(() => openModalWithOptions("deleteOrder", { orderId: data.id }), [data.id, openModalWithOptions]);
	const duplicate = React.useCallback(() => void duplicateOrder(data.id), [data.id, duplicateOrder]);

	const friesSauces = useMemo(
		() =>
			data.fries?.sauces
				.filter((sq) => sq.amount)
				.map((sq) => sq.sauce + (sq.amount > 1 ? ` ×${sq.amount}` : ""))
				.join(", ") ?? "",
		[data.fries],
	);

	const canEdit = (isUpcoming(data) && isSelf) || isAdmin;

	return (
		<Box
			data-testid={`order-row-${data.user}`}
			sx={(t) => ({
				display: "grid",
				gridTemplateColumns: { xs: "36px 1fr", sm: "44px 1fr auto" },
				alignItems: "center",
				gap: 2,
				p: "14px 18px",
				borderBottom: `1px solid ${t.palette.custom.lineSoft}`,
				"&:last-of-type": { borderBottom: 0 },
				transition: "background 120ms ease",
				background: isSelf ? `linear-gradient(90deg, ${t.palette.custom.accentSoft} 0%, transparent 50%)` : "transparent",
				"&:hover": { background: t.palette.custom.paper2 },
				"&:hover .row-actions": { opacity: 1 },
				color: isSelf ? t.palette.custom.accentInk : t.palette.custom.ink,
			})}
		>
			<Avatar name={data.user} />

			<Box sx={{ minWidth: 0 }}>
				<Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 0.25, flexWrap: "wrap" }}>
					<Typography sx={{ fontWeight: 500, fontSize: 14 }}>{data.user}</Typography>
					{data.student && <Chip label="Étudiant" size="small" variant="outlined" sx={toneChip("student")} />}
					<Typography variant="mono" sx={{ fontSize: 13, color: "custom.ink3" }}>
						{fmtPrice(price)}
					</Typography>
				</Stack>

				<Stack direction="row" alignItems="center" useFlexGap flexWrap="wrap" sx={{ gap: "6px 10px", fontSize: 14, color: "custom.ink2" }}>
					{data.burgers.map((b, i) => (
						<BurgerBit key={b.name + "-" + i} data={b} last={i === data.burgers.length - 1} />
					))}
					{data.fries && (
						<>
							<Sep />
							<Stack direction="row" alignItems="center" spacing={0.5}>
								<Fastfood sx={{ fontSize: 15 }} />
								<span>Frites</span>
								{friesSauces && <Typography component="span" sx={{ fontSize: 12, color: "custom.ink3" }}>{`(${friesSauces})`}</Typography>}
							</Stack>
						</>
					)}
					{data.drink && (
						<>
							<Sep />
							<Stack direction="row" alignItems="center" spacing={0.5}>
								<LocalDrink sx={{ fontSize: 15 }} />
								<span>{drinkLabels[data.drink]}</span>
							</Stack>
						</>
					)}
					{data.dessert && (
						<>
							<Sep />
							<Stack direction="row" alignItems="center" spacing={0.5}>
								<Cookie sx={{ fontSize: 15 }} />
								<span>{data.dessert}</span>
							</Stack>
						</>
					)}
				</Stack>
			</Box>

			<Stack direction="row" alignItems="center" spacing={1} sx={{ gridColumn: { xs: "1 / -1", sm: "auto" }, pl: { xs: "52px", sm: 0 }, justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
				<PaymentFlag status={status} />
				<Stack className="row-actions" direction="row" alignItems="center" sx={{ opacity: { xs: 1, sm: isSelf ? 1 : 0 }, transition: "opacity 120ms ease" }}>
					{canEdit && (
						<Tooltip title="Modifier">
							<IconButton size="small" aria-label="Modifier" onClick={edit}>
								<EditIcon sx={{ fontSize: 17 }} color="primary" />
							</IconButton>
						</Tooltip>
					)}
					{canCreate && (
						<Tooltip title="Dupliquer">
							<IconButton size="small" aria-label="Dupliquer" onClick={duplicate}>
								<ContentCopy sx={{ fontSize: 17 }} />
							</IconButton>
						</Tooltip>
					)}
					{canEdit && (
						<Tooltip title="Supprimer">
							<IconButton size="small" aria-label="Supprimer" onClick={del}>
								<DeleteIcon sx={{ fontSize: 17 }} color="error" />
							</IconButton>
						</Tooltip>
					)}
				</Stack>
			</Stack>
		</Box>
	);
}

function Sep() {
	return <Box component="span" sx={{ color: "custom.ink4" }}>·</Box>;
}

function BurgerBit({ data, last }: { data: BurgerRecord; last: boolean }) {
	return (
		<Stack direction="row" alignItems="center" spacing={0.75}>
			<Typography component="span" sx={{ fontWeight: 500, color: "custom.ink" }}>
				{data.name}
			</Typography>
			{data.vegetarian && <Chip label="VEGE" size="small" variant="outlined" sx={toneChip("student")} />}
			{data.xl && <Chip label="XL" size="small" variant="outlined" sx={toneChip("xl")} />}
			{data.excluded.length > 0 && (
				<Typography component="span" sx={{ fontSize: 12, color: "custom.ink3" }}>
					(sans {data.excluded.join(", ").toLowerCase()})
				</Typography>
			)}
			{!last && <Sep />}
		</Stack>
	);
}
