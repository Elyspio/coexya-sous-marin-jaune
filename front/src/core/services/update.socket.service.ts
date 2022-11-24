import * as signalR from "@microsoft/signalr";
import { LogLevel } from "@microsoft/signalr";
import store from "../../store";
import { getOrders } from "../../store/module/orders/orders.async.action";

export class UpdateSocketService {


	createSocket() {
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${window.config.endpoints.core}/ws/update`)
			.configureLogging(LogLevel.Information)
			.withAutomaticReconnect({ nextRetryDelayInMilliseconds: retryContext => 5000 })
			.build();

		connection.on("orders-updated", () => {
			store.dispatch(getOrders());
		});
		connection.start();
		return connection;

	}

}

