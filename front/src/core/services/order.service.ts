import { inject, injectable } from "inversify";
import { BackendApi } from "../apis/backend";
import { BaseService } from "./base.service";
import { Order } from "../apis/backend/generated";


@injectable()
export class OrderService extends BaseService {
	@inject(BackendApi)
	private backendApiClient!: BackendApi;

	public getAll() {
		return this.backendApiClient.orders.getAll2();
	}

	public createOrder(user: Order["user"]) {
		return this.backendApiClient.orders.create(user);
	}

	public deleteOrder(id: string) {
		return this.backendApiClient.orders.delete(id);
	}
}
