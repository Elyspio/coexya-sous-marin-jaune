import { createAction } from "@reduxjs/toolkit";
import { BurgerRecord, Order } from "../../../core/apis/backend/generated";

export const updateBurgerRecord = createAction<BurgerRecord>("orders/updateBurgerRecord");
export const updateOrder = createAction<Order>("orders/updateOrder");
export const createOrderRecord = createAction("orders/createOrderRecord");
export const setOrderRecordBurger = createAction<BurgerRecord["name"]>("orders/setOrderRecordBurger");
export const setUser = createAction<string | undefined>("orders/setUser");
export const removeOrder = createAction<Order["id"]>("orders/removeOrder");
export const setAlteringOrder = createAction<string | undefined>("orders/setAlteringOrder");
export const setAlteringRecord = createAction<number | undefined>("orders/setAlteringRecord");
export const deleteOrderRecord = createAction<number>("orders/deleteOrderRecordBurger");

