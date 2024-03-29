import * as signalR from "@microsoft/signalr";
import { HubConnection, LogLevel } from "@microsoft/signalr";
import { Config, Order } from "@apis/backend/generated";
import { injectable } from "inversify";

interface UpdateHub extends HubConnection {
	on(event: "OrderUpdated", callback: (order: Order) => void): void;

	on(event: "OrderDeleted", callback: (orderId: Order["id"]) => void): void;

	on(event: "ConfigUpdated", callback: (config: Config) => void): void;
}

@injectable()
export class UpdateSocketService {
	async createSocket() {
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${window.config.endpoints.core}/ws/update`)
			.configureLogging(LogLevel.Information)
			.withAutomaticReconnect({ nextRetryDelayInMilliseconds: () => 5000 })
			.build();

		await connection.start();
		return connection as UpdateHub;
	}
}
