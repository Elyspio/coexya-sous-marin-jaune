import React, { useCallback, useMemo } from "react";
import TabContext from "@mui/lab/TabContext";
import { Box, Link, MenuItem, type MenuItemProps, Select, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { OrderPaymentType } from "@apis/backend/generated";
import TicketRestaurant from "@/view/icons/ticket-restaurant.png";
import Bank from "@/view/icons/bank.png";
import Cash from "@/view/icons/cash.png";
import Wallet from "@/view/icons/wallet.png";
import Picsou from "@/view/icons/picsou.gif";
import { PaymentPanel } from "./PaymentPanel";
import { QRCodeSVG } from "qrcode.react";
import { Check } from "@mui/icons-material";
import { useClientStore } from "@/core/store/clientStore";
import { useOrder } from "@/core/data/orders/orders.queries";
import { useOrderEditing } from "@/core/data/orders/orders.editing";
import { useUsers } from "@/core/data/users/users.queries";
import { useAuth } from "@/core/data/auth/AuthContext";
import { calculateOrderPrice } from "@/core/data/orders/orders.utils";
import { payementTypeLabel } from "./paymentLabels";

function MenuItemWithSelector(props: { label: string; value: OrderPaymentType; mark: boolean } & MenuItemProps) {
	const { label, value, mark, ...other } = props;
	return (
		<MenuItem value={value} {...other}>
			<Stack direction={"row"} spacing={1}>
				<Typography>{label}</Typography>
				{mark && <Check color={"primary"} />}
			</Stack>
		</MenuItem>
	);
}

export function PayementOrder() {
	const { logged } = useAuth();
	const alteringId = useClientStore((s) => s.altering?.order);
	const order = useOrder(alteringId);
	const users = useUsers();
	const { updateOrderPayment } = useOrderEditing();

	const accountWallet = useMemo(() => users.find((u) => u.name === order?.user)?.sold ?? 0, [users, order?.user]);

	const [value, setValue] = React.useState(OrderPaymentType.Cash);

	const { palette } = useTheme();

	const orderPrice = useMemo(() => (order ? calculateOrderPrice(order) : 0), [order]);

	const remainingToPay = useMemo(() => {
		if (!order) return 0;
		return orderPrice - order.payments.reduce((acc, current) => acc + current.amount, 0);
	}, [order, orderPrice]);

	const remainingToPayStr = useMemo(() => (Number.isNaN(remainingToPay) ? orderPrice : remainingToPay.toFixed(2)), [remainingToPay, orderPrice]);

	const amounts = useMemo(() => {
		const data: Record<OrderPaymentType, number> = {} as any;
		if (!order) return data;
		for (const type of Object.values(OrderPaymentType)) {
			data[type] = order.payments.find((p) => p.type === type)?.amount ?? 0;
		}
		return data;
	}, [order]);

	const handleChange = useCallback((e: any) => {
		setValue(e.target.value);
	}, []);

	const updatePayment = useCallback(
		(type: OrderPaymentType) => (val: number) => {
			updateOrderPayment(type, val ?? 0);
		},
		[updateOrderPayment],
	);

	const maxWalletValue = useMemo(() => {
		if (!order) return 0;
		const remainingToPayWithWallet = Math.abs(remainingToPay + (order.payments.find((p) => p.type === OrderPaymentType.Wallet)?.amount ?? 0));
		return Math.min(accountWallet, remainingToPayWithWallet);
	}, [remainingToPay, order, accountWallet]);

	const theme = useTheme();

	if (!order) return null;

	return (
		<Stack spacing={2} mt={1} alignItems={"center"} height={"100%"} minWidth={450}>
			<Typography variant={"overline"}>
				Montant restant à payer
				<Typography component={"span"} pl={2} color={palette.warning.main}>
					{remainingToPayStr}€
				</Typography>
			</Typography>

			<TabContext value={value}>
				<Stack spacing={2} width={"100%"}>
					<Select fullWidth value={value} onChange={handleChange} renderValue={(selected) => payementTypeLabel[selected]}>
						{Object.keys(payementTypeLabel)
							.filter((key) => (key as OrderPaymentType) !== "Admin")
							.map((key) => (
								<MenuItemWithSelector
									key={key}
									mark={amounts[key as OrderPaymentType] > 0}
									label={payementTypeLabel[key as OrderPaymentType]}
									value={key as OrderPaymentType}
								/>
							))}
						{logged && <MenuItem value={OrderPaymentType.Admin}>{payementTypeLabel.Admin}</MenuItem>}
					</Select>
					<Box alignItems={"center"} justifyContent={"center"} height={"100%"} width={"100%"}>
						<PaymentPanel
							type={OrderPaymentType.Wallet}
							top={<img src={Wallet} width={120} alt={"Porte-feuille"} />}
							bottom={<Typography>Argent restant sur votre compte {(accountWallet + orderPrice - amounts.Wallet).toFixed(2)}€</Typography>}
							value={amounts.Wallet}
							setValue={updatePayment(OrderPaymentType.Wallet)}
							maxValue={maxWalletValue}
						/>

						<PaymentPanel
							type={OrderPaymentType.LunchVoucher}
							bottom={
								<Stack spacing={1} alignItems={"center"}>
									<Typography color={theme.palette.warning.main}>Uniquement les CARTES restaurant.</Typography>
									<Typography>Merci de la déposer avant le départ ~11h50</Typography>
								</Stack>
							}
							top={<img src={TicketRestaurant} height={120} alt={"Cartes restaurant"} />}
							value={amounts.LunchVoucher}
							setValue={updatePayment(OrderPaymentType.LunchVoucher)}
						/>

						<PaymentPanel
							type={OrderPaymentType.Wero}
							top={
								<Stack spacing={3} alignItems={"center"}>
									<img alt={"Logo de WERO"} src={"https://dkfyb2lgyu0b1.cloudfront.net/img_article/wero2.jpg"} width={200} />
									<Typography variant={"h5"}>06 95 13 50 64</Typography>
								</Stack>
							}
							value={amounts.Wero}
							setValue={updatePayment(OrderPaymentType.Wero)}
						/>

						<PaymentPanel
							type={OrderPaymentType.BankTransfer}
							top={
								<Stack spacing={2} alignItems={"center"}>
									<img src={Bank} width={120} alt={"Virement bancaire"} />
									<Stack direction={"row"} alignItems={"center"} spacing={3}>
										<Typography variant={"overline"} fontSize={"larger"}>
											IBAN:
										</Typography>
										<Typography>FR76 3000 4003 7800 0014 7491 905</Typography>
									</Stack>
								</Stack>
							}
							value={amounts.BankTransfer}
							setValue={updatePayment(OrderPaymentType.BankTransfer)}
						/>

						<PaymentPanel
							type={OrderPaymentType.Paypal}
							top={
								<Stack spacing={1} alignItems={"center"} justifyContent={"center"}>
									<Box bgcolor={"background.default"} p={2}>
										<QRCodeSVG height={150} width={150} value="https://paypal.me/elyspio?country.x=FR" />
									</Box>
									<Link target={"_blank"} href={"https://paypal.me/elyspio?country.x=FR"}>
										https://paypal.me/elyspio?country.x=FR
									</Link>
								</Stack>
							}
							value={amounts.Paypal}
							setValue={updatePayment(OrderPaymentType.Paypal)}
						/>

						<PaymentPanel
							type={OrderPaymentType.Cash}
							bottom={<Typography>Merci de déposer l'argent avant le départ ~ 11h50</Typography>}
							top={<img src={Cash} height={150} alt={"Argent en espèces"} />}
							value={amounts.Cash}
							setValue={updatePayment(OrderPaymentType.Cash)}
						/>

						{logged && (
							<PaymentPanel
								type={OrderPaymentType.Admin}
								bottom={<Typography>Zone admin</Typography>}
								top={<img src={Picsou} height={150} alt={"Zone d'administration"} />}
								value={amounts.Admin}
								setValue={updatePayment(OrderPaymentType.Admin)}
							/>
						)}
					</Box>
				</Stack>
			</TabContext>
		</Stack>
	);
}
