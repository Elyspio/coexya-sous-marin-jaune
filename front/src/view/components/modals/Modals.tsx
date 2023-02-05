import * as React from "react";
import { useCallback, useMemo } from "react";
import { MergeUsers } from "./MergeUsers";
import { useAppDispatch, useAppSelector } from "../../../store";
import { toggleModal } from "../../../store/module/workflow/workflow.action";
import { EditOrder } from "../orders/detail/EditOrder";
import { OrderMessageModal } from "./OrderMessageModal";
import { Balances } from "./balance/Balances";
import { UpdateConfig } from "./UpdateConfig";
import { ModalType } from "../../../store/module/workflow/workflow.types";
import { DeleteOrderModal } from "./DeleteOrderModal";

export function Modals() {
	const {
		selectedOrder,
		logged,
		modals: { message, mergeUsers, balances, updateConfig, deleteOrder },
		orders,
	} = useAppSelector(s => ({
		modals: s.workflow.modals,
		orders: s.orders.all,
		selectedOrder: s.orders.altering?.order,
		logged: s.authentication.logged,
	}));

	const dispatch = useAppDispatch();

	const closeModal = useCallback((modal: ModalType) => () => dispatch(toggleModal(modal)), [dispatch]);

	const allOrders = useMemo(() => Object.keys(orders), [orders]);

	return (
		<>
			<DeleteOrderModal setClose={closeModal("deleteOrder")} open={deleteOrder} />
			{selectedOrder && <EditOrder />}
			{allOrders.length > 0 && <OrderMessageModal setClose={closeModal("message")} open={message} />}
			{logged && (
				<>
					<MergeUsers setClose={closeModal("mergeUsers")} open={mergeUsers} />
					<Balances setClose={closeModal("balances")} open={balances} />
					<UpdateConfig setClose={closeModal("updateConfig")} open={updateConfig} />
				</>
			)}
		</>
	);
}
