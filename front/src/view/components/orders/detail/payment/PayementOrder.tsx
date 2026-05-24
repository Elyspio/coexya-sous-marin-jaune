import * as React from "react";
import { useCallback, useMemo } from "react";
import { Box, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import CreditCard from "@mui/icons-material/CreditCard";
import PhoneAndroid from "@mui/icons-material/PhoneAndroid";
import AccountBalance from "@mui/icons-material/AccountBalance";
import Payments from "@mui/icons-material/Payments";
import LocalAtm from "@mui/icons-material/LocalAtm";
import Close from "@mui/icons-material/Close";
import { QRCodeSVG } from "qrcode.react";
import { OrderPaymentType } from "@apis/backend/generated";
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

const subLabels: Partial<Record<OrderPaymentType, string>> = {
	[OrderPaymentType.Wallet]: "Crédit interne",
	[OrderPaymentType.LunchVoucher]: "Cartes uniquement",
	[OrderPaymentType.Wero]: WERO_NUMBER,
	[OrderPaymentType.BankTransfer]: "Virement bancaire",
	[OrderPaymentType.Paypal]: "paypal.me/elyspio",
	[OrderPaymentType.Cash]: "Avant ~11h50",
	[OrderPaymentType.Admin]: "Picsou",
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
	const progress = price > 0 ? Math.min(100, (paid / price) * 100) : 0;

	const maxWalletValue = useMemo(() => Math.min(accountWallet, remaining + amounts.Wallet), [accountWallet, remaining, amounts.Wallet]);

	// Met à jour le cache localement (réactif) pendant la frappe, sans persister.
	const setAmount = useCallback(
		(type: OrderPaymentType, value: number) => {
			let v = Number.isNaN(value) ? 0 : Math.max(0, value);
			if (type === OrderPaymentType.Wallet) v = Math.min(v, maxWalletValue);
			updateOrderPayment(type, v);
		},
		[updateOrderPayment, maxWalletValue],
	);

	// Construit l'order à jour et le persiste (évite d'enregistrer une closure périmée).
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
		(type: OrderPaymentType) => () => {
			const target = type === OrderPaymentType.Wallet ? Math.min(remaining, maxWalletValue) : remaining;
			commitPayment(type, target);
		},
		[remaining, maxWalletValue, commitPayment],
	);

	if (!order) return null;

	const types = Object.values(OrderPaymentType).filter((t) => t !== OrderPaymentType.Admin || logged);

	return (
		<Stack spacing={3}>
			<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 1.5 }}>
				<SummaryCard label="Total" value={fmtPrice(price)} />
				<SummaryCard label="Versé" value={fmtPrice(paid)} tone={paid >= price - 0.001 ? "ok" : undefined} />
				<SummaryCard label="Reste" value={fmtPrice(remaining)} tone={remaining > 0 ? "due" : "ok"} />
			</Box>

			<Box sx={(t) => ({ height: 6, borderRadius: 999, backgroundColor: t.palette.custom.paper3, overflow: "hidden" })}>
				<Box sx={(t) => ({ height: "100%", width: `${progress}%`, borderRadius: 999, background: `linear-gradient(90deg, ${t.palette.custom.accent}, ${t.palette.custom.accent2})`, transition: "width 240ms ease" })} />
			</Box>

			<Box>
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.25 }}>
					<Typography variant="eyebrow">Moyens de paiement</Typography>
					<Typography variant="mono" sx={{ fontSize: 12, color: "custom.ink3" }}>
						Réparti librement
					</Typography>
				</Stack>
				<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gridAutoRows: "1fr", gap: 1.25 }}>
					{types.map((type) => {
						const amount = amounts[type];
						const selected = amount > 0;
						return (
							<Box
								key={type}
								data-testid={`pay-card-${type}`}
								sx={(t) => ({
									display: "flex",
									flexDirection: "column",
									height: "100%",
									minWidth: 0,
									gap: 1.25,
									p: 1.75,
									borderRadius: "12px",
									border: `1px solid ${selected ? t.palette.custom.ink : t.palette.custom.line}`,
									boxShadow: selected ? `0 0 0 3px ${t.palette.custom.line}` : "none",
									backgroundColor: t.palette.custom.paper,
									transition: "border 120ms ease, box-shadow 120ms ease",
								})}
							>
								<Stack direction="row" alignItems="center" spacing={1.25}>
									<Box
										sx={(t) => ({
											width: 36,
											height: 36,
											borderRadius: "10px",
											display: "grid",
											placeItems: "center",
											flexShrink: 0,
											backgroundColor: type === OrderPaymentType.Admin ? t.palette.custom.claySoft : type === OrderPaymentType.Wallet ? t.palette.custom.accentSoft : t.palette.custom.paper2,
											color: type === OrderPaymentType.Admin ? t.palette.custom.clay : type === OrderPaymentType.Wallet ? t.palette.custom.accent : t.palette.custom.ink2,
										})}
									>
										<PayGlyph type={type} />
									</Box>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography sx={{ fontWeight: 600, fontSize: 14 }}>{payementTypeLabel[type]}</Typography>
										<Typography variant="mono" sx={{ fontSize: 11.5, color: "custom.ink3" }} noWrap>
											{subLabels[type]}
										</Typography>
									</Box>
									{!selected && remaining > 0 && (
										<Box
											component="button"
											data-testid={`pay-fill-${type}`}
											onClick={fillRemaining(type)}
											sx={(t) => ({
												appearance: "none",
												background: "transparent",
												border: `1px dashed ${t.palette.custom.line}`,
												color: t.palette.custom.ink3,
												fontSize: 11,
												fontFamily: t.typography.fontFamily,
												px: 1,
												py: 0.375,
												borderRadius: 999,
												cursor: "pointer",
												whiteSpace: "nowrap",
												flexShrink: 0,
												"&:hover": { color: t.palette.custom.accent, borderColor: t.palette.custom.accent },
											})}
										>
											Tout payer
										</Box>
									)}
								</Stack>

								{type === OrderPaymentType.Wallet && (
									<Typography variant="mono" sx={{ fontSize: 11.5, color: "custom.ink3" }}>
										Solde disponible {fmtPrice(accountWallet)}
									</Typography>
								)}
								{type === OrderPaymentType.BankTransfer && (
									<Typography variant="mono" sx={{ fontSize: 11.5, color: "custom.ink2", overflowWrap: "anywhere" }}>
										{IBAN}
									</Typography>
								)}
								{type === OrderPaymentType.Paypal && (
									<Stack direction="row" alignItems="center" spacing={1.25}>
										<Box sx={(t) => ({ p: 0.75, backgroundColor: "#fff", border: `1px solid ${t.palette.custom.line}`, borderRadius: "8px", display: "grid", placeItems: "center" })}>
											<QRCodeSVG value={PAYPAL_URL} height={56} width={56} />
										</Box>
										<Link href={PAYPAL_URL} target="_blank" sx={{ fontSize: 11.5 }}>
											Scanner pour payer
										</Link>
									</Stack>
								)}

								<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: "auto" }}>
									<Box
										component="input"
										type="number"
										inputMode="decimal"
										value={amount || ""}
										placeholder="0,00"
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(type, Number.parseFloat(e.target.value))}
										onBlur={persist}
										sx={(t) => ({
											flex: 1,
											minWidth: 0,
											border: `1px solid ${t.palette.custom.line}`,
											backgroundColor: t.palette.custom.paper2,
											borderRadius: "6px",
											px: 1.25,
											py: 0.75,
											fontFamily: t.typography.fontFamily,
											fontVariantNumeric: "tabular-nums",
											fontSize: 14,
											color: t.palette.custom.ink,
											outline: "none",
											"&:focus": { borderColor: t.palette.custom.ink, backgroundColor: t.palette.custom.paper },
										})}
									/>
									<Typography variant="mono" sx={{ fontSize: 13, color: "custom.ink3" }}>
										€
									</Typography>
									<Tooltip title="Effacer">
										<span>
											<IconButton size="small" disabled={!selected} onClick={() => commitPayment(type, 0)}>
												<Close sx={{ fontSize: 16 }} />
											</IconButton>
										</span>
									</Tooltip>
								</Stack>
							</Box>
						);
					})}
				</Box>
			</Box>
		</Stack>
	);
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone?: "ok" | "due" }) {
	return (
		<Box sx={(t) => ({ p: "12px 14px", borderRadius: "8px", border: `1px solid ${t.palette.custom.line}`, backgroundColor: t.palette.custom.paper2 })}>
			<Typography variant="eyebrow" sx={{ fontSize: 10 }}>
				{label}
			</Typography>
			<Typography variant="mono" sx={{ fontSize: 20, fontWeight: 500, color: tone === "ok" ? "custom.accent" : tone === "due" ? "custom.warn" : "custom.ink" }}>
				{value}
			</Typography>
		</Box>
	);
}
