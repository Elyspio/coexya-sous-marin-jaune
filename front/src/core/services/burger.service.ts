import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/backend";
import { BaseService } from "./technical/base.service";

@injectable()
export class BurgerService extends BaseService {
	@inject(BackendApi)
	private readonly backendApiClient!: BackendApi;

	public getAll() {
		return this.backendApiClient.burgers.v1_Burger_GetAll();
	}
}
