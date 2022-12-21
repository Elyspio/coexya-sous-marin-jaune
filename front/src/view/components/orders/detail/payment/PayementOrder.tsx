import { useAppDispatch, useAppSelector } from "../../../../../store";
import React, { useCallback, useMemo } from "react";
import TabContext from "@mui/lab/TabContext";
import { Box, Stack, Tab, Typography, useTheme } from "@mui/material";
import TabList from "@mui/lab/TabList";
import { OrderPaymentType } from "../../../../../core/apis/backend/generated";
import { ReactComponent as PaypalIcon } from "../../../../icons/paypal.svg";
import TicketRestaurant from "../../../../icons/ticket-restaurant.png";
import Bank from "../../../../icons/bank.png";
import Cash from "../../../../icons/cash.png";
import Picsou from "../../../../icons/picsou.gif";
import { updateOrderPayment } from "../../../../../store/module/orders/orders.action";
import { PaymentPanel } from "./PaymentPanel";

export const payementTypeLabel: Record<OrderPaymentType, string> = {
	[OrderPaymentType.BankTransfer]: "Virement",
	[OrderPaymentType.Cash]: "Liquide",
	[OrderPaymentType.Paypal]: "PayPal",
	[OrderPaymentType.LunchVoucher]: "Ticket restaurant",
	[OrderPaymentType.Admin]: "Admin",
};

export function PayementOrder() {
	const { order, recordIndex, creating, logged } = useAppSelector(state => {
		let orderId = state.orders.altering?.order;
		return {
			order: state.orders.all[orderId!],
			recordIndex: state.orders.altering?.record,
			creating: state.orders.mode.order === "create",
			logged: state.authentication.logged,
		};
	});

	const dispatch = useAppDispatch();

	const [value, setValue] = React.useState(OrderPaymentType.LunchVoucher);

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
				<TabList onChange={handleChange} aria-label="lab API tabs example" variant={"fullWidth"} orientation={"horizontal"}>
					<Tab label={payementTypeLabel.LunchVoucher} value={OrderPaymentType.LunchVoucher} />
					<Tab label={payementTypeLabel.Paypal} value={OrderPaymentType.Paypal} />
					<Tab label={payementTypeLabel.BankTransfer} value={OrderPaymentType.BankTransfer} />
					<Tab label={payementTypeLabel.Cash} value={OrderPaymentType.Cash} />
					{logged && <Tab label={payementTypeLabel.Admin} value={OrderPaymentType.Admin} />}
				</TabList>
				<Box alignItems={"center"} justifyContent={"center"} height={"100%"} width={"100%"}>
					<PaymentPanel
						type={OrderPaymentType.Paypal}
						top={<PaypalIcon width={190} height={190} />}
						value={amounts.Paypal}
						setValue={updatePayment(OrderPaymentType.Paypal)}
					/>

					<PaymentPanel
						type={OrderPaymentType.LunchVoucher}
						bottom={<Typography>Merci de déposer l'argent avant le départ ~ 11h50</Typography>}
						top={<img src={TicketRestaurant} height={120} alt={"Ticket restaurant"} />}
						value={amounts.LunchVoucher}
						setValue={updatePayment(OrderPaymentType.LunchVoucher)}
					/>

					<PaymentPanel
						type={OrderPaymentType.Cash}
						bottom={<Typography>Merci de déposer l'argent avant le départ ~ 11h50</Typography>}
						top={<img src={Cash} height={150} alt={"Argent en espèces"} />}
						value={amounts.Cash}
						setValue={updatePayment(OrderPaymentType.Cash)}
					/>

					<PaymentPanel
						type={OrderPaymentType.BankTransfer}
						top={
							<Stack spacing={2} alignItems={"center"}>
								<img src={Bank} width={150} alt={"Virement bancaire"} />
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
