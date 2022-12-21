import { ConfigBase } from "../../../core/apis/backend/generated";
import { createActionBase } from "../../common/common.actions";

const createAction = createActionBase("config");

export const setConfig = createAction<ConfigBase>("setConfig");
