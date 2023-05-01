import { Order } from "@apis/backend/generated";

export const ModalTypes = {
	message: "message",
	mergeUsers: "mergeUsers",
	balances: "balances",
	updateConfig: "updateConfig",
	deleteOrder: "deleteOrder",
} as const;
export type ModalType = (typeof ModalTypes)[keyof typeof ModalTypes];

export interface ModalOptions {
	[ModalTypes.deleteOrder]?: {
		orderId: Order["id"];
	};
}

export type WorkflowState = {
	/**
	 * if a modal is shown
	 */
	modals: Record<ModalType, boolean>;
	options: ModalOptions;
};
