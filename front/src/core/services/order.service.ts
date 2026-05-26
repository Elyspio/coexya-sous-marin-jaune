import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/backend";
import { BaseService } from "./technical/base.service";
import { Order, OrderPaymentType } from "@apis/backend/generated";

@injectable()
export class OrderService extends BaseService {
	private readonly backendApiClient: BackendApi;

	constructor(@inject(BackendApi) backendApiClient: BackendApi) {
		super();
		this.backendApiClient = backendApiClient;
	}

	public getAll() {
		return this.backendApiClient.orders.v1_Order_GetAll();
	}

	public createOrder(user: Order["user"], acceptDefer?: boolean) {
		return this.backendApiClient.orders.v1_Order_Create(user, acceptDefer);
	}

	public getCreationInfo() {
		return this.backendApiClient.orders.v1_Order_GetCreationInfo();
	}

	public deleteOrder(id: string) {
		return this.backendApiClient.orders.v1_Order_Delete(id);
	}

	public updateOrder(order: Order) {
		return this.backendApiClient.orders.v1_Order_UpdateOrder(order.id, order);
	}

	public updatePaymentReceived(idOrder: string, type: OrderPaymentType, value: number) {
		return this.backendApiClient.orders.v1_Order_UpdateOrderPaymentReceived(idOrder, type, value);
	}
}
