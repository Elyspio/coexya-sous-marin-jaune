import { createAsyncActionGenerator, getService } from "../../utils/utils.actions";
import { UserService } from "@services/user.service";
import { toast } from "react-toastify";

const createAsyncThunk = createAsyncActionGenerator("users");

type MergeUserParams = {
	nextName: string;
	users: string[];
};
export const mergeUsers = createAsyncThunk("mergeUsers", async ({ users, nextName }: MergeUserParams, { extra }) => {
	const userService = getService(UserService, extra);

	const promise = userService.merge(nextName, users);

	await toast.promise(promise, {
		success: "Merge terminé",
	});
});

export const getAllUsers = createAsyncThunk("getAllUsers", (_, { extra }) => {
	const userService = getService(UserService, extra);
	return userService.getAll();
});
