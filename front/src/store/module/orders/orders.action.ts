import { createAction } from "@reduxjs/toolkit";
import { Burger, BurgerRecord } from "../../../core/apis/backend/generated";
import { OrderState } from "./orders.reducer";


export const updateBurgerRecord = createAction<BurgerRecord>("orders/updateBurgerRecord");
export const addOrderRecord = createAction<Burger["name"]>("orders/addOrderRecord");
export const setUser = createAction<string | undefined>("orders/setUser");


export const setAlteringOrder = createAction<string | undefined>("orders/setAlteringOrder")
export const setAlteringRecord = createAction<number | undefined>("orders/setAlteringRecord")
