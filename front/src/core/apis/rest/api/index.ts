import { inject, injectable } from "inversify";
import axios from "axios";
import { BackendApi as GeneratedBackendApi, Configuration } from "./generated";
import { TokenService } from "@services/common/token.service";

@injectable()
export class BackendApi {
	public readonly client: GeneratedBackendApi;

	constructor(@inject(TokenService) tokenService: TokenService) {
		const baseURL = window.config.endpoints.core;

		const instance = axios.create({ baseURL, withCredentials: true });

		instance.interceptors.request.use((value) => {
			const token = tokenService.getToken();
			if (token) value.headers!["Authorization"] = `Bearer ${token}`;
			return value;
		});

		this.client = new GeneratedBackendApi(new Configuration({ basePath: baseURL }), baseURL, instance);
	}
}
