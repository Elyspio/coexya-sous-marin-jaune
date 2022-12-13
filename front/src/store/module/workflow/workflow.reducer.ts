import { createSlice } from "@reduxjs/toolkit";
import { toggleModal } from "./workflow.action";

export type ModalType = "message" | "mergeUsers";

export type WorkflowState = {
	/**
	 * if a modal is shown
	 */
	modals: Record<ModalType, boolean>;
};

const initialState: WorkflowState = {
	modals: {
		message: false,
		mergeUsers: false,
	},
};

const slice = createSlice({
	name: "burgers",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(toggleModal, (state, action) => {
			state.modals[action.payload] = !state.modals[action.payload];
		});
	},
});

export const workflowReducer = slice.reducer;
