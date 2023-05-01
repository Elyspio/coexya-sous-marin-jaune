import { createActionGenerator } from "../../utils/utils.actions";
import { User } from "@apis/authentication/generated";

const createAction = createActionGenerator("authentication");

export const setUserFromToken = createAction<User>("setUserFromToken");
