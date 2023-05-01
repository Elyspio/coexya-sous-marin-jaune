import { createActionGenerator } from "@store/utils/utils.actions";

const createAction = createActionGenerator("theme");

export const setTheme = createAction<"dark" | "light">("set");
export const toggleTheme = createAction<void>("toggle");
