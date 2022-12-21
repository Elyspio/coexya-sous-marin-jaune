import { inject, injectable } from "inversify";
import { BackendApi } from "../apis/backend";
import { BaseService } from "./technical/base.service";
import { Order, OrderPaymentType } from "../apis/backend/generated";

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

	public updateOrder(order: Order) {
		return this.backendApiClient.orders.updateOrder(order.id, order);
	}

	public updatePaymentReceived(idOrder: string, type: OrderPaymentType, value: number) {
		return this.backendApiClient.orders.updateOrderPaymentReceived(idOrder, type, value);
	}
}
