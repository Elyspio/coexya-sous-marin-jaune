import { BurgerRecord, Order } from "../../../core/apis/backend/generated";
import { createActionBase } from "../../common/common.actions";
import { OrderState } from "./orders.reducer";


const createAction = createActionBase("orders");

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