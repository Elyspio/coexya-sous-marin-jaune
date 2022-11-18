import { injectable } from "inversify";
import axios from "axios";
import { BurgerClient, OrderClient } from "./generated";

const instance = axios.create({
	withCredentials: true,
	transformResponse: [],
});

@injectable()
export class BackendApi {
	public burgers = new BurgerClient(window.config.endpoints.core, instance);
	public orders = new OrderClient(window.config.endpoints.core, instance);
}
