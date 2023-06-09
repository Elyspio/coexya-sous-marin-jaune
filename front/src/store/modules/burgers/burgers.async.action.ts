import { createAsyncActionGenerator, getService } from "../../utils/utils.actions";
import { BurgerService } from "@services/burger.service";

const createAsyncThunk = createAsyncActionGenerator("burgers");

export const getBurgers = createAsyncThunk("get", (_, { extra }) => {
	const service = getService(BurgerService, extra);
	return service.getAll();
});
