import { BurgerRecord, Order, OrderPaymentType } from "@apis/backend/generated";
import { createActionGenerator } from "../../utils/utils.actions";
import { OrderState } from "./orders.reducer";

const createAction = createActionGenerator("orders");

export const updateBurgerRecord = createAction<BurgerRecord>("updateBurgerRecord");
export const updateOrder = createAction<Order>("updateOrder");
export const createOrderRecord = createAction("createOrderRecord");
export const setOrderRecordBurger = createAction<BurgerRecord["name"]>("setOrderRecordBurger");
export const setUser = createAction<string | undefined>("setUser");
export const removeOrder = createAction<Order["id"]>("removeOrder");
export const setAlteringOrder = createAction<string | undefined>("setAlteringOrder");
export const setAlteringRecord = createAction<number | undefined>("setAlteringRecord");
export const deleteOrderRecord = createAction<number>("deleteOrderRecordBurger");

export const setOrderTimeRange = createAction<OrderState["timeRange"]>("setMaxOrderTimeToDisplay");

export const updateOrderPayment = createAction<{
	type: OrderPaymentType;
	value: number;
}>("updateOrderPayment");
