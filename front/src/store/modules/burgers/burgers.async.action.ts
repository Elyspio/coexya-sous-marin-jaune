import { createAsyncThunk } from "@reduxjs/toolkit";
import { getService } from "../../utils/utils.actions";
import { BurgerService } from "@services/burger.service";

export const getBurgers = createAsyncThunk("burgers/getBurgers", (_, { extra }) => {
	const service = getService(BurgerService, extra);
	return service.getAll();
});
