import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/rest/api";
import { BaseService } from "./technical/base.service";

@injectable()
export class BurgerService extends BaseService {
	private readonly backendApi: BackendApi;

	constructor(@inject(BackendApi) backendApi: BackendApi) {
		super();
		this.backendApi = backendApi;
	}

	public getAll() {
		return this.backendApi.client.v1BurgerGetAll().then(this.unWrapAxios);
	}
}
