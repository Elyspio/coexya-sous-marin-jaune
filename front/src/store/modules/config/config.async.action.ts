import { createAsyncThunk } from "@reduxjs/toolkit";
import { getService } from "../../utils/utils.actions";
import { toast } from "react-toastify";
import { ConfigService } from "@services/config.service";
import { setConfig } from "./config.actions";
import { StoreState } from "@store";

export const updateConfig = createAsyncThunk("config/updateConfig", async (_, { extra, getState }) => {
	const userService = getService(ConfigService, extra);

	const { config } = getState() as StoreState;

	const promise = userService.update(config);

	await toast.promise(promise, {
		success: "Config mise à jour",
		error: "Erreur lors de la mise à jour de la config",
		pending: "Mise à jour de la config",
	});
});

export const getConfig = createAsyncThunk("config/getConfig", async (_, { extra, dispatch }) => {
	const userService = getService(ConfigService, extra);
	const config = await userService.get();

	await dispatch(setConfig(config));
});
