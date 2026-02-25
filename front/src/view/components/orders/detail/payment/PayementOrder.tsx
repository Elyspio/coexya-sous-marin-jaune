import { useAppDispatch, useAppSelector } from "@store";
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
import { updateOrderPayment } from "@modules/orders/orders.action";
import { PaymentPanel } from "./PaymentPanel";
import { QRCodeSVG } from "qrcode.react";
import { Check } from "@mui/icons-material";

export const payementTypeLabel: Record<OrderPaymentType, string> = {
	[OrderPaymentType.BankTransfer]: "Virement",
	[OrderPaymentType.Cash]: "Liquide",
	[OrderPaymentType.Paypal]: "PayPal",
	[OrderPaymentType.LunchVoucher]: "Cartes restaurant",
	[OrderPaymentType.Admin]: "Admin",
	[OrderPaymentType.Wallet]: "Solde",
	[OrderPaymentType.Wero]: "Wero",
};

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
	const { logged, accountWallet } = useAppSelector((state) => {
		const orderId = state.orders.altering?.order;
		const selectedOrder = state.orders.all[orderId!];
		return {
			logged: state.authentication.logged,
			accountWallet: state.users.all.find((user) => user.name === selectedOrder.user)!.sold,
		};
	});

	const order = useAppSelector((state) => state.orders.all[state.orders.altering?.order!]);

	const dispatch = useAppDispatch();

	const [value, setValue] = React.useState(OrderPaymentType.Cash);

	const { palette } = useTheme();

	// region memo

	const remainingToPay = useMemo(() => {
		if (!order?.price) return 0;

		return order.price - order.payments.reduce((acc, current) => acc + current.amount, 0);
	}, [order]);

	const remainingToPayStr = useMemo(() => (Number.isNaN(remainingToPay) ? order.price : remainingToPay.toFixed(2)), [remainingToPay, order]);

	const amounts = useMemo(() => {
		const data: Record<OrderPaymentType, number> = {} as any;

		for (const type of Object.values(OrderPaymentType)) {
			data[type] = order.payments.find((p) => p.type === type)?.amount ?? 0;
		}

		return data;
	}, [order.payments]);

	// endregion

	// region callbacks

	const handleChange = useCallback((e: any) => {
		console.log("handlechange", e.target.value);
		setValue(e.target.value);
	}, []);

	const updatePayment = useCallback(
		(type: OrderPaymentType) => (value: number) => {
			dispatch(
				updateOrderPayment({
					value: value ?? 0,
					type,
				})
			);
		},
		[dispatch]
	);
	// endregion

	const maxWalletValue = useMemo(() => {
		const remainingToPayWithWallet = Math.abs(remainingToPay + (order.payments.find((p) => p.type === OrderPaymentType.Wallet)?.amount ?? 0));

		return Math.min(accountWallet, remainingToPayWithWallet);
	}, [remainingToPay, order.payments, accountWallet]);

	const theme = useTheme();

	if (!order) return null;

	console.log({ amounts });

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
							bottom={<Typography>Argent restant sur votre compte {(accountWallet + (order.price ?? 0) - amounts.Wallet).toFixed(2)}€</Typography>}
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
