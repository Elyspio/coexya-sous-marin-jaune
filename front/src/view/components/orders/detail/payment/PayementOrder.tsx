import { useAppDispatch, useAppSelector } from "../../../../../store";
import React, { useCallback, useMemo } from "react";
import TabContext from "@mui/lab/TabContext";
import { Box, Divider, Stack, Tab, Typography, useTheme } from "@mui/material";
import TabList from "@mui/lab/TabList";
import { OrderPaymentType } from "../../../../../core/apis/backend/generated";
import { ReactComponent as PaypalIcon } from "../../../../icons/paypal.svg";
import TicketRestaurant from "../../../../icons/ticket-restaurant.png";
import Bank from "../../../../icons/bank.png";
import Cash from "../../../../icons/cash.png";
import Wallet from "../../../../icons/wallet.png";
import Picsou from "../../../../icons/picsou.gif";
import { updateOrderPayment } from "../../../../../store/module/orders/orders.action";
import { PaymentPanel } from "./PaymentPanel";

export const payementTypeLabel: Record<OrderPaymentType, string> = {
	[OrderPaymentType.BankTransfer]: "Virement",
	[OrderPaymentType.Cash]: "Liquide",
	[OrderPaymentType.Paypal]: "PayPal",
	[OrderPaymentType.LunchVoucher]: "Ticket restaurant",
	[OrderPaymentType.Admin]: "Admin",
	[OrderPaymentType.Wallet]: "Solde",
};

export function PayementOrder() {
	const { order, recordIndex, creating, logged, accountWallet } = useAppSelector(state => {
		let orderId = state.orders.altering?.order;
		let selectedOrder = state.orders.all[orderId!];
		return {
			order: selectedOrder,
			recordIndex: state.orders.altering?.record,
			creating: state.orders.mode.order === "create",
			logged: state.authentication.logged,
			accountWallet: state.users.all.find(user => user.name === selectedOrder.user)!.sold,
		};
	});

	const dispatch = useAppDispatch();

	const [value, setValue] = React.useState(OrderPaymentType.Wallet);

	const { palette } = useTheme();

	// region memo

	const remainingToPay = useMemo(() => {
		if (!order) return 0;

		return order.price - order.payments.reduce((acc, current) => acc + current.amount, 0);
	}, [order]);

	const remainingToPayStr = useMemo(() => (Number.isNaN(remainingToPay) ? order.price : Math.round(remainingToPay * 100) / 100), [remainingToPay, order]);

	const amounts = useMemo(() => {
		const data: Record<OrderPaymentType, number> = {} as any;

		for (const type of Object.values(OrderPaymentType)) {
			data[type] = order.payments.find(p => p.type === type)?.amount ?? 0;
		}

		return data;
	}, [order.payments]);

	// endregion

	// region callbacks

	const handleChange = useCallback((_, newValue: OrderPaymentType) => {
		setValue(newValue);
	}, []);

	const updatePayment = useCallback(
		(type: OrderPaymentType) => (value: number) => {
			dispatch(updateOrderPayment({ value: value ?? 0, type }));
		},
		[dispatch]
	);
	// endregion

	if (!order) return null;

	return (
		<Stack spacing={2} mt={1} alignItems={"center"} height={"100%"}>
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
					{accountWallet > 0 && <Tab label={payementTypeLabel.Wallet} value={OrderPaymentType.Wallet} />}
					<Tab label={payementTypeLabel.LunchVoucher} value={OrderPaymentType.LunchVoucher} />
					<Tab label={payementTypeLabel.BankTransfer} value={OrderPaymentType.BankTransfer} />
					<Tab label={payementTypeLabel.Paypal} value={OrderPaymentType.Paypal} />
					<Tab label={payementTypeLabel.Cash} value={OrderPaymentType.Cash} />

					{logged && <Tab label={payementTypeLabel.Admin} value={OrderPaymentType.Admin} />}
				</TabList>
				<Divider flexItem />
				<Box alignItems={"center"} justifyContent={"center"} height={"100%"} width={"100%"}>
					<PaymentPanel
						type={OrderPaymentType.Wallet}
						top={<img src={Wallet} width={120} alt={"Porte-feuille"} />}
						bottom={<Typography>Argent restant sur votre compte {accountWallet}€</Typography>}
						value={amounts.Wallet}
						setValue={updatePayment(OrderPaymentType.Wallet)}
						maxValue={Math.min(Math.abs(remainingToPay + (order.payments.find(p => p.type === OrderPaymentType.Wallet)?.amount ?? 0)), accountWallet)}
					/>

					<PaymentPanel
						type={OrderPaymentType.LunchVoucher}
						bottom={<Typography>Merci de déposer l'argent avant le départ ~ 11h50</Typography>}
						top={<img src={TicketRestaurant} height={120} alt={"Ticket restaurant"} />}
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
						top={<PaypalIcon width={190} height={190} />}
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
							top={<img src={Picsou} height={150} alt={"Argent en espèces"} />}
							value={amounts.Admin}
							setValue={updatePayment(OrderPaymentType.Admin)}
						/>
					)}
				</Box>
			</TabContext>
		</Stack>
	);
}
