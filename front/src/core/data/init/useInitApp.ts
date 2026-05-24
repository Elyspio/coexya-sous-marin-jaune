import {useEffect, useRef} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {getService} from "../api/services";
import {UpdateSocketService} from "@services/socket/update.socket.service";
import {ordersRealtime} from "../orders/orders.realtime";

export function useInitApp() {
	const qc = useQueryClient();
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;

		let socketCleanup: (() => void) | undefined;

		(async () => {
			const updateSocketService = getService(UpdateSocketService);
			const socket = await updateSocketService.createSocket();

			socket.on("OrderUpdated", (order) => ordersRealtime.onOrderUpdated(qc, order));
			socket.on("OrderDeleted", (orderId) => ordersRealtime.onOrderDeleted(qc, orderId));
			socket.on("ConfigUpdated", (config) => ordersRealtime.onConfigUpdated(qc, config));

			socketCleanup = () => {
				void socket.stop();
			};
		})().catch((err) => {
			console.error("Failed to start update socket", err);
		});

		return () => {
			socketCleanup?.();
		};
	}, [qc]);
}
