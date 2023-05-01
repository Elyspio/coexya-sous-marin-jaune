import { ActionCreatorWithPayload, AsyncThunkPayloadCreator, createAction as _createAction, createAsyncThunk as _createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkFulfilledActionCreator, AsyncThunkPendingActionCreator, AsyncThunkRejectedActionCreator } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { ExtraArgument, StoreState } from "@store";

type Constructor<T> = new (...args: any[]) => T;

export function getService<T>(service: Constructor<T>, extra: ExtraArgument): T {
	return extra.container.get(service);
}

type ActionCreator = AsyncThunkPendingActionCreator<any, any> | AsyncThunkRejectedActionCreator<any, any> | AsyncThunkFulfilledActionCreator<any, any>;

export function throwIfRejected(action: ReturnType<ActionCreator>) {
	if (action.meta.requestStatus === "rejected") throw new Error((action as any).error.message);
}

export function createReplaceAction<T>(creator: (module: string) => any): ActionCreatorWithPayload<T> {
	return creator("replace");
}

type ThunkParam = { extra: ExtraArgument; state: StoreState };

export function createAsyncActionGenerator(prefix: string) {
	return <Ret, Arg = void>(suffix: string, payloadCreator: AsyncThunkPayloadCreator<Ret, Arg, ThunkParam>) => _createAsyncThunk<Ret, Arg>(`${prefix}/${suffix}`, payloadCreator);
}

export function createActionGenerator(prefix: string) {
	return <Arg = void>(suffix: string) => _createAction<Arg>(`${prefix}/${suffix}`);
}
