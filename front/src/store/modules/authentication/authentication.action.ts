import { createActionGenerator } from "../../utils/utils.actions";
import type {User} from "oidc-client-ts";

const createAction = createActionGenerator("authentication");

export const setUserFromToken = createAction<User>("setUserFromToken");
