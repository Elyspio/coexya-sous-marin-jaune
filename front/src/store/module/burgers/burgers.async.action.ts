import { createAsyncThunk } from "@reduxjs/toolkit";
import { getService } from "../../common/common.actions";
import { BurgerService } from "../../../core/services/burger.service";

export const getBurgers = createAsyncThunk("burgers/getBurgers", (_, { extra }) => {
	const service = getService(BurgerService, extra);
	return service.getAll();
});
