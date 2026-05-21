import { OrderPaymentType } from "@apis/backend/generated";

export const payementTypeLabel: Record<OrderPaymentType, string> = {
	[OrderPaymentType.BankTransfer]: "Virement",
	[OrderPaymentType.Cash]: "Liquide",
	[OrderPaymentType.Paypal]: "PayPal",
	[OrderPaymentType.LunchVoucher]: "Cartes restaurant",
	[OrderPaymentType.Admin]: "Admin",
	[OrderPaymentType.Wallet]: "Solde",
	[OrderPaymentType.Wero]: "Wero",
};
