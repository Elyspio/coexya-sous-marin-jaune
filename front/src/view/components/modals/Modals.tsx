import * as React from "react";
import { useCallback } from "react";
import { MergeUsers } from "./MergeUsers";
import { useAppDispatch, useAppSelector } from "../../../store";
import { ModalType } from "../../../store/module/workflow/workflow.reducer";
import { toggleModal } from "../../../store/module/workflow/workflow.action";
import { EditOrder } from "../orders/EditOrder";
import { OrderMessageModal } from "./OrderMessageModal";

export function Modals() {
	const { message, mergeUsers } = useAppSelector(s => s.workflow.modals);

	const dispatch = useAppDispatch();

	const closeModal = useCallback((modal: ModalType) => () => dispatch(toggleModal(modal)), [dispatch]);

	return (
		<>
			<EditOrder />
			<OrderMessageModal />
			<MergeUsers setClose={closeModal("mergeUsers")} open={mergeUsers} />
		</>
	);
}
