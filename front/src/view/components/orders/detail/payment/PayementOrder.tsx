import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import CreditCard from "@mui/icons-material/CreditCard";
import PhoneAndroid from "@mui/icons-material/PhoneAndroid";
import AccountBalance from "@mui/icons-material/AccountBalance";
import Payments from "@mui/icons-material/Payments";
import LocalAtm from "@mui/icons-material/LocalAtm";
import Check from "@mui/icons-material/Check";
import { QRCodeSVG } from "qrcode.react";
import { OrderPaymentType } from "@apis/rest/api/generated";
import { PicsouMark } from "@components/ui/marks";
import { fmtPrice } from "@/core/utils/format";
import { payementTypeLabel } from "./paymentLabels";
import { useClientStore } from "@/core/store/clientStore";
import { useOrder } from "@/core/data/orders/orders.queries";
import { useUsers } from "@/core/data/users/users.queries";
import { useAuth } from "@/core/data/auth/AuthContext";
import { useOrderEditing, useUpdateAndSaveOrder } from "@/core/data/orders/orders.editing";
import { useUpdateRemoteOrder } from "@/core/data/orders/orders.mutations";
import { calculateOrderPrice } from "@/core/data/orders/orders.utils";

const PAYPAL_URL = "https://paypal.me/elyspio?country.x=FR";
const IBAN = "FR76 3000 4003 7800 0014 7491 905";
const WERO_NUMBER = "06 95 13 50 64";

const payColors: Record<OrderPaymentType, string> = {
	[OrderPaymentType.Wallet]: "#1F8A6E",
	[OrderPaymentType.Cash]: "#7BB341",
	[OrderPaymentType.LunchVoucher]: "#E07A1F",
	[OrderPaymentType.Wero]: "#3B82F6",
	[OrderPaymentType.BankTransfer]: "#8B5CF6",
	[OrderPaymentType.Paypal]: "#1E3A8A",
	[OrderPaymentType.Admin]: "#B45309",
};

function PayGlyph({ type }: { type: OrderPaymentType }) {
	switch (type) {
		case OrderPaymentType.Wallet:
			return <AccountBalanceWallet sx={{ fontSize: 18 }} />;
		case OrderPaymentType.LunchVoucher:
			return <CreditCard sx={{ fontSize: 18 }} />;
		case OrderPaymentType.Wero:
			return <PhoneAndroid sx={{ fontSize: 18 }} />;
		case OrderPaymentType.BankTransfer:
			return <AccountBalance sx={{ fontSize: 18 }} />;
		case OrderPaymentType.Paypal:
			return <Payments sx={{ fontSize: 18 }} />;
		case OrderPaymentType.Cash:
			return <LocalAtm sx={{ fontSize: 18 }} />;
		case OrderPaymentType.Admin:
			return <PicsouMark size={20} />;
	}
}

export function PayementOrder() {
	const { logged } = useAuth();
	const alteringId = useClientStore((s) => s.altering?.order);
	const order = useOrder(alteringId);
	const users = useUsers();
	const { updateOrderPayment } = useOrderEditing();
	const updateAndSave = useUpdateAndSaveOrder();
	const updateRemote = useUpdateRemoteOrder();

	const accountWallet = useMemo(() => users.find((u) => u.name === order?.user)?.sold ?? 0, [users, order?.user]);
	const price = useMemo(() => (order ? calculateOrderPrice(order) : 0), [order]);

	const amounts = useMemo(() => {
		const data = {} as Record<OrderPaymentType, number>;
		for (const type of Object.values(OrderPaymentType)) data[type] = order?.payments.find((p) => p.type === type)?.amount ?? 0;
		return data;
	}, [order]);

	const paid = useMemo(() => Object.values(amounts).reduce((acc, n) => acc + n, 0), [amounts]);
	const remaining = useMemo(() => Math.max(0, +(price - paid).toFixed(2)), [price, paid]);

	const maxWalletValue = useMemo(() => Math.min(accountWallet, remaining + amounts.Wallet), [accountWallet, remaining, amounts.Wallet]);

	const types = useMemo(() => {
		return Object.values(OrderPaymentType).filter((t) => {
			if (t === OrderPaymentType.Admin && !logged) return false;
			if (t === OrderPaymentType.Wallet && accountWallet <= 0) return false;
			return true;
		});
	}, [logged, accountWallet]);

	// Sélection = union des moyens avec un montant > 0 (dérivé de order.payments)
	// et des ajouts locaux (utilisateur a cliqué une tuile sans saisir de montant).
	const [extras, setExtras] = useState<Set<OrderPaymentType>>(() => new Set());
	const selected = useMemo(() => {
		const s = new Set<OrderPaymentType>(extras);
		for (const p of order?.payments ?? []) if (p.amount > 0) s.add(p.type);
		return s;
	}, [extras, order?.payments]);

	// Nettoyage : si l'utilisateur n'a plus de solde mais que la commande contient encore un paiement Wallet, on l'efface.
	const cleanedWalletRef = useRef(false);
	useEffect(() => {
		if (cleanedWalletRef.current) return;
		if (!order) return;
		if (accountWallet <= 0 && order.payments.some((p) => p.type === OrderPaymentType.Wallet)) {
			cleanedWalletRef.current = true;
			const payments = order.payments.filter((p) => p.type !== OrderPaymentType.Wallet);
			updateAndSave({ ...order, payments });
		}
	}, [order, accountWallet, updateAndSave]);

	const setAmount = useCallback(
		(type: OrderPaymentType, value: number) => {
			let v = Number.isNaN(value) ? 0 : Math.max(0, value);
			if (type === OrderPaymentType.Wallet) v = Math.min(v, maxWalletValue);
			updateOrderPayment(type, v);
		},
		[updateOrderPayment, maxWalletValue],
	);

	const commitPayment = useCallback(
		(type: OrderPaymentType, value: number) => {
			if (!order) return;
			let v = Number.isNaN(value) ? 0 : Math.max(0, value);
			if (type === OrderPaymentType.Wallet) v = Math.min(v, maxWalletValue);
			v = +v.toFixed(2);
			const existing = order.payments.find((p) => p.type === type);
			const payments = v <= 0 ? order.payments.filter((p) => p.type !== type) : existing ? order.payments.map((p) => (p.type === type ? { ...p, amount: v } : p)) : [...order.payments, { type, amount: v }];
			updateAndSave({ ...order, payments });
		},
		[order, maxWalletValue, updateAndSave],
	);

	const persist = useCallback(() => {
		if (order) updateRemote.mutate(order);
	}, [order, updateRemote]);

	const fillRemaining = useCallback(
		(type: OrderPaymentType) => {
			const target = type === OrderPaymentType.Wallet ? Math.min(remaining + amounts[type], maxWalletValue) : remaining + amounts[type];
			commitPayment(type, target);
		},
		[remaining, maxWalletValue, amounts, commitPayment],
	);

	const toggleSelected = useCallback(
		(type: OrderPaymentType) => {
			const isSelected = extras.has(type) || amounts[type] > 0;
			if (isSelected) {
				if (amounts[type] > 0) commitPayment(type, 0);
				setExtras((prev) => {
					if (!prev.has(type)) return prev;
					const next = new Set(prev);
					next.delete(type);
					return next;
				});
			} else {
				const target = type === OrderPaymentType.Wallet ? Math.min(remaining, maxWalletValue) : remaining;
				if (target > 0) commitPayment(type, target);
				else
					setExtras((prev) => {
						const next = new Set(prev);
						next.add(type);
						return next;
					});
			}
		},
		[extras, amounts, commitPayment, remaining, maxWalletValue],
	);

	const segments = useMemo(() => types.filter((t) => amounts[t] > 0).map((t) => ({ type: t, amount: amounts[t], pct: price > 0 ? (amounts[t] / price) * 100 : 0 })), [types, amounts, price]);

	if (!order) return null;

	const selectedTypes = types.filter((t) => selected.has(t));

	return (
		<Stack spacing={2.5}>
			<Stack direction="row" alignItems="baseline" justifyContent="space-between">
				<Box>
					<Typography variant="eyebrow" sx={{ fontSize: 10 }}>
						{remaining > 0.001 ? "Reste à payer" : "Couvert"}
					</Typography>
					<Typography variant="mono" sx={{ fontSize: 28, fontWeight: 500, lineHeight: 1.1, color: remaining > 0.001 ? "custom.warn" : "custom.accent" }}>
						{fmtPrice(remaining)}
					</Typography>
				</Box>
				<Box sx={{ textAlign: "right" }}>
					<Typography variant="eyebrow" sx={{ fontSize: 10 }}>
						Versé
					</Typography>
					<Typography variant="mono" sx={{ fontSize: 22, fontWeight: 500, lineHeight: 1.1 }}>
						{fmtPrice(paid)}
						<Box component="span" sx={{ color: "custom.ink3" }}> / {fmtPrice(price)}</Box>
					</Typography>
				</Box>
			</Stack>

			<Box>
				<Box sx={(t) => ({ display: "flex", height: 8, borderRadius: 999, backgroundColor: t.palette.custom.paper3, overflow: "hidden" })}>
					{segments.map((seg) => (
						<Box key={seg.type} sx={{ width: `${seg.pct}%`, backgroundColor: payColors[seg.type], transition: "width 240ms ease" }} />
					))}
				</Box>
				{segments.length > 0 && (
					<Stack direction="row" spacing={1.5} sx={{ mt: 1, flexWrap: "wrap", rowGap: 0.5 }}>
						{segments.map((seg) => (
							<Stack key={seg.type} direction="row" alignItems="center" spacing={0.625}>
								<Box sx={{ width: 9, height: 9, borderRadius: "2px", backgroundColor: payColors[seg.type] }} />
								<Typography variant="mono" sx={{ fontSize: 12, color: "custom.ink2" }}>
									{payementTypeLabel[seg.type]} {fmtPrice(seg.amount)}
								</Typography>
							</Stack>
						))}
					</Stack>
				)}
			</Box>

			<Box>
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.25 }}>
					<Typography variant="eyebrow">1. Choisir les moyens</Typography>
					<Typography variant="mono" sx={{ fontSize: 12, color: "custom.ink3" }}>
						{selected.size} sélectionné{selected.size > 1 ? "s" : ""}
					</Typography>
				</Stack>
				<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr" }, gap: 1.25 }}>
					{types.map((type) => {
						const isSelected = selected.has(type);
						const color = payColors[type];
						return (
							<Box
								key={type}
								component="button"
								data-testid={`pay-card-${type}`}
								onClick={() => toggleSelected(type)}
								sx={(t) => ({
									appearance: "none",
									textAlign: "left",
									cursor: "pointer",
									fontFamily: t.typography.fontFamily,
									position: "relative",
									p: 1.5,
									borderRadius: "12px",
									border: `1px solid ${isSelected ? color : t.palette.custom.line}`,
									backgroundColor: isSelected ? `${color}14` : t.palette.custom.paper,
									transition: "border 120ms ease, background-color 120ms ease",
									"&:hover": { borderColor: color },
								})}
							>
								<Box
									sx={(t) => ({
										width: 32,
										height: 32,
										borderRadius: "8px",
										display: "grid",
										placeItems: "center",
										backgroundColor: isSelected ? `${color}24` : t.palette.custom.paper2,
										color: isSelected ? color : t.palette.custom.ink2,
										mb: 1,
									})}
								>
									<PayGlyph type={type} />
								</Box>
								<Typography sx={{ fontWeight: 600, fontSize: 13.5, color: isSelected ? color : "custom.ink" }}>
									{payementTypeLabel[type]}
								</Typography>
								{isSelected && (
									<Box
										sx={{
											position: "absolute",
											top: 8,
											right: 8,
											width: 20,
											height: 20,
											borderRadius: "50%",
											backgroundColor: color,
											color: "#fff",
											display: "grid",
											placeItems: "center",
										}}
									>
										<Check sx={{ fontSize: 13 }} />
									</Box>
								)}
							</Box>
						);
					})}
				</Box>
			</Box>

			<Box>
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.25 }}>
					<Typography variant="eyebrow">2. Répartir le montant</Typography>
					<Typography variant="mono" sx={{ fontSize: 12, color: "custom.ink3" }}>
						Bouton « auto » remplit le reste
					</Typography>
				</Stack>
				{selectedTypes.length === 0 ? (
					<Typography variant="mono" sx={{ fontSize: 12, color: "custom.ink3", fontStyle: "italic" }}>
						Sélectionne un moyen ci-dessus.
					</Typography>
				) : (
					<Stack spacing={1}>
						{selectedTypes.map((type) => (
							<DistributionRow
								key={type}
								type={type}
								amount={amounts[type]}
								accountWallet={accountWallet}
								onChange={(v) => setAmount(type, v)}
								onBlur={persist}
								onAuto={() => fillRemaining(type)}
							/>
						))}
					</Stack>
				)}
			</Box>
		</Stack>
	);
}

function DistributionRow({
	type,
	amount,
	accountWallet,
	onChange,
	onBlur,
	onAuto,
}: {
	type: OrderPaymentType;
	amount: number;
	accountWallet: number;
	onChange: (v: number) => void;
	onBlur: () => void;
	onAuto: () => void;
}) {
	const subInfo = (() => {
		switch (type) {
			case OrderPaymentType.Wallet:
				return `Crédit · ${fmtPrice(accountWallet)} dispo`;
			case OrderPaymentType.LunchVoucher:
				return "Cartes uniquement";
			case OrderPaymentType.Wero:
				return WERO_NUMBER;
			case OrderPaymentType.BankTransfer:
				return IBAN;
			case OrderPaymentType.Paypal:
				return "paypal.me/elyspio";
			case OrderPaymentType.Cash:
				return "Avant ~11h50";
			case OrderPaymentType.Admin:
				return "Picsou";
		}
	})();

	return (
		<Box
			sx={(t) => ({
				display: "flex",
				alignItems: "center",
				gap: 1.25,
				p: 1.25,
				borderRadius: "10px",
				border: `1px solid ${t.palette.custom.line}`,
				backgroundColor: t.palette.custom.paper2,
			})}
		>
			<Box
				sx={{
					width: 32,
					height: 32,
					borderRadius: "8px",
					display: "grid",
					placeItems: "center",
					flexShrink: 0,
					backgroundColor: `${payColors[type]}24`,
					color: payColors[type],
				}}
			>
				<PayGlyph type={type} />
			</Box>
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography sx={{ fontWeight: 600, fontSize: 13.5 }} noWrap>
					{payementTypeLabel[type]}
				</Typography>
				<Typography variant="mono" sx={{ fontSize: 11.5, color: "custom.ink3", overflowWrap: "anywhere" }}>
					{subInfo}
				</Typography>
			</Box>
			{type === OrderPaymentType.Paypal && (
				<Tooltip title="Scanner pour payer">
					<Link href={PAYPAL_URL} target="_blank" sx={(t) => ({ p: 0.5, backgroundColor: "#fff", border: `1px solid ${t.palette.custom.line}`, borderRadius: "6px", display: "grid", placeItems: "center", flexShrink: 0 })}>
						<QRCodeSVG value={PAYPAL_URL} height={36} width={36} />
					</Link>
				</Tooltip>
			)}
			<Box
				component="input"
				type="number"
				inputMode="decimal"
				value={amount || ""}
				placeholder="0,00"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number.parseFloat(e.target.value))}
				onBlur={onBlur}
				sx={(t) => ({
					width: 90,
					border: `1px solid ${t.palette.custom.line}`,
					backgroundColor: t.palette.custom.paper,
					borderRadius: "6px",
					px: 1,
					py: 0.5,
					fontFamily: t.typography.fontFamily,
					fontVariantNumeric: "tabular-nums",
					fontSize: 14,
					color: t.palette.custom.ink,
					outline: "none",
					textAlign: "right",
					"&:focus": { borderColor: t.palette.custom.ink },
				})}
			/>
			<Typography variant="mono" sx={{ fontSize: 13, color: "custom.ink3" }}>
				€
			</Typography>
			<IconButton
				data-testid={`pay-auto-${type}`}
				size="small"
				onClick={onAuto}
				sx={(t) => ({
					fontFamily: t.typography.fontFamily,
					fontSize: 11,
					fontWeight: 600,
					letterSpacing: "0.05em",
					px: 1,
					borderRadius: "6px",
					color: t.palette.custom.ink2,
					"&:hover": { color: t.palette.custom.accent, backgroundColor: "transparent" },
				})}
			>
				AUTO
			</IconButton>
		</Box>
	);
}
