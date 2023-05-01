import { ActionCreatorWithPayload, ActionReducerMapBuilder, AsyncThunk, Draft } from "@reduxjs/toolkit";
import { PromiseState } from "./utils.types";

export function setPromiseStatus<T, U extends string>(
	builder: ActionReducerMapBuilder<T>,
	thunk: AsyncThunk<any, any, any>,
	getProps: (state: Draft<T>) => Record<U, PromiseState>,
	prop: U,
	status: PromiseState[] = ["fulfilled", "pending", "rejected"]
) {
	status.forEach((promiseStatus) => {
		builder.addCase(thunk[promiseStatus], (state, action) => {
			getProps(state)[prop] = action.meta.requestStatus;
		});
	});
}

export function addReplaceCase<T extends object>(builder: ActionReducerMapBuilder<T>, actionCreator: ActionCreatorWithPayload<T>) {
	builder.addCase(actionCreator, (state: Draft<T>, action) => {
		(Object.keys(action.payload) as (keyof T)[]).forEach((key) => {
			console.log(action.type, key);
			// @ts-ignore
			state[key] = action.payload[key];
		});
	});
}
