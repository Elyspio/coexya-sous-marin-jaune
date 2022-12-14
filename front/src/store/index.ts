import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { themeReducer } from "./module/theme/theme.reducer";
import { authenticationReducer } from "./module/authentication/authentication.reducer";
import { container } from "../core/di";
import { burgersReducer } from "./module/burgers/burgers.reducer";
import { ordersReducer } from "./module/orders/orders.reducer";
import { workflowReducer } from "./module/workflow/workflow.reducer";
import { userReducer } from "./module/users/users.reducer";
import { configReducer } from "./module/config/config.reducer";

const store = configureStore({
	reducer: {
		theme: themeReducer,
		authentication: authenticationReducer,
		burgers: burgersReducer,
		orders: ordersReducer,
		workflow: workflowReducer,
		users: userReducer,
		config: configReducer,
	},
	devTools: process.env.NODE_ENV !== "production",
	middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: { extraArgument: { container } } }),
});

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ExtraArgument = { container: typeof container };

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export default store;
