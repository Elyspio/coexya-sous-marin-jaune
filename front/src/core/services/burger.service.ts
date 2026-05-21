import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/backend";
import { BaseService } from "./technical/base.service";

@injectable()
export class BurgerService extends BaseService {
	private readonly backendApiClient: BackendApi;

	constructor(@inject(BackendApi) backendApiClient: BackendApi) {
		super();
		this.backendApiClient = backendApiClient;
	}

	public getAll() {
		return this.backendApiClient.burgers.v1_Burger_GetAll();
	}
}
