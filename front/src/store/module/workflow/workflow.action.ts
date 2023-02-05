import { createActionBase } from "../../common/common.actions";
import { ModalOptions, ModalType } from "./workflow.types";

const createAction = createActionBase("workflow");

export const toggleModal = createAction<ModalType>("toggleModal");

type Created = {
	modal: ModalType;
	options: any;
};

export const toggleModalWithOptions = createAction<Created>("toggleModalWithOptions");

export const toggleModalWithOptionsFn = <T extends keyof ModalOptions>(modal: T, options: ModalOptions[T]) =>
	toggleModalWithOptions({
		modal,
		options,
	});
