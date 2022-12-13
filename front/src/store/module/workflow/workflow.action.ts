import { createActionBase } from "../../common/common.actions";
import { WorkflowState } from "./workflow.reducer";

const createAction = createActionBase("workflow");

export const toggleModal = createAction<keyof WorkflowState["modals"]>("toggleModal");
