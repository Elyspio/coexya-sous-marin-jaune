import { ConfigBase } from "@apis/backend/generated";
import { createActionGenerator } from "../../utils/utils.actions";

const createAction = createActionGenerator("config");

export const setConfig = createAction<ConfigBase>("setConfig");
