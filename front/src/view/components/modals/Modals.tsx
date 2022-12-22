import * as React from "react";
import { useCallback, useMemo } from "react";
import { MergeUsers } from "./MergeUsers";
import { useAppDispatch, useAppSelector } from "../../../store";
import { ModalType } from "../../../store/module/workflow/workflow.reducer";
import { toggleModal } from "../../../store/module/workflow/workflow.action";
import { EditOrder } from "../orders/detail/EditOrder";
import { OrderMessageModal } from "./OrderMessageModal";
import { Balances } from "./balance/Balances";
import { UpdateConfig } from "./UpdateConfig";

export function Modals() {
	const {
		modals: { message, mergeUsers, balances, updateConfig },
		orders,
	} = useAppSelector(s => ({
		modals: s.workflow.modals,
		orders: s.orders.all,
	}));

	const dispatch = useAppDispatch();

	const closeModal = useCallback((modal: ModalType) => () => dispatch(toggleModal(modal)), [dispatch]);

	const allOrders = useMemo(() => Object.keys(orders), [orders]);

	return (
		<>
			<EditOrder />
			{allOrders.length > 0 && <OrderMessageModal setClose={closeModal("message")} open={message} />}
			<MergeUsers setClose={closeModal("mergeUsers")} open={mergeUsers} />
			<Balances setClose={closeModal("balances")} open={balances} />
			<UpdateConfig setClose={closeModal("updateConfig")} open={updateConfig} />
		</>
	);
}
