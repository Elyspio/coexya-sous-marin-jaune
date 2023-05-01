import { createSlice } from "@reduxjs/toolkit";
import { toggleModal, toggleModalWithOptions } from "./workflow.action";
import { ModalTypes, WorkflowState } from "./workflow.types";

const initialState: WorkflowState = {
	modals: {} as any,
	options: {},
};

Object.values(ModalTypes).forEach((type) => {
	initialState.modals[type] = false;
});

const slice = createSlice({
	name: "workflows",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(toggleModal, (state, action) => {
			state.modals[action.payload] = !state.modals[action.payload];
			if (state.options[action.payload]) state.options[action.payload] = undefined;
		});

		builder.addCase(toggleModalWithOptions, (state, action) => {
			state.modals[action.payload.modal] = true;
			state.options[action.payload.modal] = action.payload.options;
		});
	},
});

export const workflowReducer = slice.reducer;
