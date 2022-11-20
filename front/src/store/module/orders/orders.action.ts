import { createAction } from "@reduxjs/toolkit";
import { Burger, BurgerRecord } from "../../../core/apis/backend/generated";


export const updateBurgerRecord = createAction<BurgerRecord>("orders/updateBurgerRecord");
export const closeOrderModal = createAction<number | undefined>("orders/closeModal");
export const addOrderRecord = createAction<Burger["name"]>("orders/addOrderRecord");
export const setUser = createAction<string | undefined>("orders/setUser");