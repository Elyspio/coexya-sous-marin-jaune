import { useAppDispatch, useAppSelector } from "@store";
import React, { useCallback, useMemo } from "react";
import TabContext from "@mui/lab/TabContext";
import { Box, Divider, Link, Stack, Tab, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TabList from "@mui/lab/TabList";
import { OrderPaymentType } from "@apis/backend/generated";
import TicketRestaurant from "@/view/icons/ticket-restaurant.png";
import Bank from "@/view/icons/bank.png";
import Cash from "@/view/icons/cash.png";
import Wallet from "@/view/icons/wallet.png";
import Picsou from "@/view/icons/picsou.gif";
import { updateOrderPayment } from "@modules/orders/orders.action";
import { PaymentPanel } from "./PaymentPanel";
import { QRCodeSVG } from "qrcode.react";

export const payementTypeLabel: Record<OrderPaymentType, string> = {
	[OrderPaymentType.BankTransfer]: "Virement",
	[OrderPaymentType.Cash]: "Liquide",
	[OrderPaymentType.Paypal]: "PayPal",
	[OrderPaymentType.LunchVoucher]: "Cartes restaurant",
	[OrderPaymentType.Admin]: "Admin",
	[OrderPaymentType.Wallet]: "Solde",
};

export function PayementOrder() {
	const { order, logged, accountWallet } = useAppSelector((state) => {
		const orderId = state.orders.altering?.order;
		const selectedOrder = state.orders.all[orderId!];
		return {
			order: selectedOrder,
			logged: state.authentication.logged,
			accountWallet: state.users.all.find((user) => user.name === selectedOrder.user)!.sold,
		};
	});

	const dispatch = useAppDispatch();

	const [value, setValue] = React.useState(OrderPaymentType.Cash);

	const { palette } = useTheme();

	// region memo

	const remainingToPay = useMemo(() => {
		if (!order) return 0;

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

	const handleChange = useCallback((_: React.SyntheticEvent, newValue: OrderPaymentType) => {
		setValue(newValue);
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

	return (
		<Stack spacing={2} mt={1} alignItems={"center"} height={"100%"} minWidth={450}>
			<Typography variant={"overline"}>
				Montant restant à payer
				<Typography component={"span"} pl={2} color={palette.warning.main}>
					{remainingToPayStr}€
				</Typography>
			</Typography>

			<TabContext value={value}>
				<Divider flexItem />
				<TabList
					indicatorColor={value === "Wallet" ? "secondary" : "primary"}
					textColor={value === "Wallet" ? "secondary" : "primary"}
					onChange={handleChange}
					aria-label="lab API tabs example"
					variant={"scrollable"}
					orientation={"horizontal"}
				>
					<Tab label={payementTypeLabel.Cash} value={OrderPaymentType.Cash} />
					<Tab label={payementTypeLabel.BankTransfer} value={OrderPaymentType.BankTransfer} />
					<Tab label={payementTypeLabel.Paypal} value={OrderPaymentType.Paypal} />
					<Tab label={payementTypeLabel.LunchVoucher} value={OrderPaymentType.LunchVoucher} />
					{(accountWallet > 0 || order.payments.some((payment) => payment.type === "Wallet")) && <Tab label={payementTypeLabel.Wallet} value={OrderPaymentType.Wallet} />}
					{logged && <Tab label={payementTypeLabel.Admin} value={OrderPaymentType.Admin} />}
				</TabList>
				<Divider flexItem />
				<Box alignItems={"center"} justifyContent={"center"} height={"100%"} width={"100%"}>
					<PaymentPanel
						type={OrderPaymentType.Wallet}
						top={<img src={Wallet} width={120} alt={"Porte-feuille"} />}
						bottom={<Typography>Argent restant sur votre compte {(accountWallet + order.price - amounts.Wallet).toFixed(2)}€</Typography>}
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
			</TabContext>
		</Stack>
	);
}
