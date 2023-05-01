import { inject, injectable } from "inversify";
import axios from "axios";
import { BurgerClient, ConfigClient, OrderClient, UserClient } from "./generated";
import { TokenService } from "@services/common/token.service";

@injectable()
export class BackendApi {
	public readonly burgers: BurgerClient;
	public readonly orders: OrderClient;
	public readonly config: ConfigClient;
	public readonly users: UserClient;

	constructor(@inject(TokenService) tokenService: TokenService) {
		const instance = axios.create({ withCredentials: true, transformResponse: [] });

		instance.interceptors.request.use((value) => {
			value.headers!["Authorization"] = `Bearer ${tokenService.getToken()}`;
			return value;
		});

		this.burgers = new BurgerClient(window.config.endpoints.core, instance);
		this.orders = new OrderClient(window.config.endpoints.core, instance);
		this.users = new UserClient(window.config.endpoints.core, instance);
		this.config = new ConfigClient(window.config.endpoints.core, instance);
	}
}
