import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { themeReducer } from "@modules/theme/theme.reducer";
import { authenticationReducer } from "@modules/authentication/authentication.reducer";
import { container } from "@/core/di";
import { burgersReducer } from "@modules/burgers/burgers.reducer";
import { ordersReducer } from "@modules/orders/orders.reducer";
import { workflowReducer } from "@modules/workflow/workflow.reducer";
import { userReducer } from "@modules/users/users.reducer";
import { configReducer } from "@modules/config/config.reducer";

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
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: { extraArgument: { container } } }),
});

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ExtraArgument = {
	container: typeof container;
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export default store;
