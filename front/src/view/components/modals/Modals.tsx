import * as React from "react";
import { useCallback, useMemo } from "react";
import { MergeUsers } from "./MergeUsers";
import { EditOrder } from "../orders/detail/EditOrder";
import { OrderMessageModal } from "./OrderMessageModal";
import { Balances } from "./balance/Balances";
import { UpdateConfig } from "./UpdateConfig";
import { DeleteOrderModal } from "./DeleteOrderModal";
import { useClientStore, type ModalType } from "@/core/store/clientStore";
import { useOrders } from "@/core/data/orders/orders.queries";
import { useAuth } from "@/core/data/auth/AuthContext";

export function Modals() {
	const modals = useClientStore((s) => s.modals);
	const selectedOrder = useClientStore((s) => s.altering?.order);
	const toggleModal = useClientStore((s) => s.toggleModal);
	const orders = useOrders();
	const { logged } = useAuth();

	const closeModal = useCallback((modal: ModalType) => () => toggleModal(modal), [toggleModal]);

	const hasOrders = useMemo(() => orders.length > 0, [orders]);

	return (
		<>
			<DeleteOrderModal setClose={closeModal("deleteOrder")} open={modals.deleteOrder} />
			{selectedOrder && <EditOrder />}
			{hasOrders && <OrderMessageModal setClose={closeModal("message")} open={modals.message} />}
			{logged && (
				<>
					<MergeUsers setClose={closeModal("mergeUsers")} open={modals.mergeUsers} />
					<Balances setClose={closeModal("balances")} open={modals.balances} />
					<UpdateConfig setClose={closeModal("updateConfig")} open={modals.updateConfig} />
				</>
			)}
		</>
	);
}
