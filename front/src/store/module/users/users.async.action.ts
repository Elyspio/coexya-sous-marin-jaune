import { createAsyncThunk } from "@reduxjs/toolkit";
import { getService } from "../../common/common.actions";
import { UserService } from "../../../core/services/user.service";
import { toast } from "react-toastify";

type MergeUserParams = {
	nextName: string;
	users: string[];
};
export const mergeUsers = createAsyncThunk("users/mergeUsers", async ({ users, nextName }: MergeUserParams, { extra }) => {
	const userService = getService(UserService, extra);

	const promise = userService.merge(nextName, users);

	await toast.promise(promise, {
		success: "Merge terminé",
	});
});

export const getAllUsers = createAsyncThunk("users/getAllUsers", (_, { extra }) => {
	const userService = getService(UserService, extra);
	return userService.getAll();
});
