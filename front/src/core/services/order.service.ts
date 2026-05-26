import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/rest/api";
import { BaseService } from "./technical/base.service";
import { Order, OrderPaymentType } from "@apis/rest/api/generated";

@injectable()
export class OrderService extends BaseService {
	private readonly backendApi: BackendApi;

	constructor(@inject(BackendApi) backendApi: BackendApi) {
		super();
		this.backendApi = backendApi;
	}

	public getAll() {
		return this.backendApi.client.v1OrderGetAll().then(this.unWrapAxios);
	}

	public createOrder(user: Order["user"], acceptDefer?: boolean) {
		return this.backendApi.client.v1OrderCreate(user, acceptDefer).then(this.unWrapAxios);
	}

	public getCreationInfo() {
		return this.backendApi.client.v1OrderGetCreationInfo().then(this.unWrapAxios);
	}

	public deleteOrder(id: string) {
		return this.backendApi.client.v1OrderDelete(id).then(this.unWrapAxios);
	}

	public updateOrder(order: Order) {
		return this.backendApi.client.v1OrderUpdateOrder(order.id, order).then(this.unWrapAxios);
	}

	public updatePaymentReceived(idOrder: string, type: OrderPaymentType, value: number) {
		return this.backendApi.client.v1OrderUpdateOrderPaymentReceived(idOrder, type, value).then(this.unWrapAxios);
	}
}
