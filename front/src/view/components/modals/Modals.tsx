import * as React from "react";
import { lazy, Suspense } from "react";
import { useCallback, useMemo } from "react";
import { type ModalType, useClientStore } from "@/core/store/clientStore";
import { useOrders } from "@/core/data/orders/orders.queries";
import { useAuth } from "@/core/data/auth/AuthContext";

const DeleteOrderModal = lazy(() => import("./DeleteOrderModal").then((module) => ({ default: module.DeleteOrderModal })));
const EditOrder = lazy(() => import("../orders/detail/EditOrder").then((module) => ({ default: module.EditOrder })));
const OrderMessageModal = lazy(() => import("./OrderMessageModal").then((module) => ({ default: module.OrderMessageModal })));
const MergeUsers = lazy(() => import("./MergeUsers").then((module) => ({ default: module.MergeUsers })));
const Balances = lazy(() => import("./balance/Balances").then((module) => ({ default: module.Balances })));
const UpdateConfig = lazy(() => import("./UpdateConfig").then((module) => ({ default: module.UpdateConfig })));

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
			<Suspense fallback={null}>
				{modals.deleteOrder && <DeleteOrderModal setClose={closeModal("deleteOrder")} open />}
				{selectedOrder && <EditOrder />}
				{hasOrders && modals.message && <OrderMessageModal setClose={closeModal("message")} open />}
				{logged && modals.mergeUsers && <MergeUsers setClose={closeModal("mergeUsers")} open />}
				{logged && modals.balances && <Balances setClose={closeModal("balances")} open />}
				{logged && modals.updateConfig && <UpdateConfig setClose={closeModal("updateConfig")} open />}
			</Suspense>
		</>
	);
}
