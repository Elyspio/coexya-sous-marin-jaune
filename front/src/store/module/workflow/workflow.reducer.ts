import { createSlice } from "@reduxjs/toolkit";
import { toggleModal } from "./workflow.action";

export type ModalType = "message" | "mergeUsers" | "balances";

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
		balances: false,
	},
};

const slice = createSlice({
	name: "workflows",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(toggleModal, (state, action) => {
			state.modals[action.payload] = !state.modals[action.payload];
		});
	},
});

export const workflowReducer = slice.reducer;
