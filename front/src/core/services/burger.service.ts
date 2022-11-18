import { inject, injectable } from "inversify";
import { BackendApi } from "../apis/backend";
import { BaseService } from "./base.service";


@injectable()
export class BurgerService extends BaseService {
	@inject(BackendApi)
	private backendApiClient!: BackendApi;

	public getAll() {
		return this.backendApiClient.burgers.getAll();
	}


}
