import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "@apis/backend/generated";
import { getUrlTheme, type Themes } from "@/config/theme";

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

export enum OrderTime {
	"today" = "Aujourd'hui",
	"month" = "1 mois",
	"months3" = "3 mois",
	"months6" = "6 mois",
	"year" = "1 an",
	"all" = "Toutes",
}

type AlteringState = {
	order: Order["id"];
	record?: number;
};

type OrderMode = {
	order?: "create" | "update";
	record?: "create" | "update";
};

type PersistedState = {
	theme: Themes;
	orderName?: string;
	timeRange: OrderTime;
};

type TransientState = {
	modals: Record<ModalType, boolean>;
	modalOptions: ModalOptions;
	altering?: AlteringState;
	mode: OrderMode;
};

type Actions = {
	setTheme: (theme: Themes) => void;
	toggleTheme: () => void;
	toggleModal: (modal: ModalType) => void;
	openModalWithOptions: <T extends keyof ModalOptions>(modal: T, options: ModalOptions[T]) => void;
	closeAllModals: () => void;
	setOrderName: (name: string | undefined) => void;
	setAlteringOrder: (id: Order["id"] | undefined) => void;
	setAlteringRecord: (record: number | undefined) => void;
	setOrderMode: (mode: Partial<OrderMode>) => void;
	resetOrderMode: () => void;
	setTimeRange: (range: OrderTime) => void;
};

type ClientState = PersistedState & TransientState & Actions;

const initialModals: Record<ModalType, boolean> = {
	message: false,
	mergeUsers: false,
	balances: false,
	updateConfig: false,
	deleteOrder: false,
};

let persistedName = localStorage.getItem("user") ?? undefined;
if (persistedName === "undefined") persistedName = "";

export const useClientStore = create<ClientState>()(
	persist(
		(set) => ({
			// persisted
			theme: getUrlTheme(),
			orderName: persistedName,
			timeRange: OrderTime.months3,
			// transient
			modals: { ...initialModals },
			modalOptions: {},
			altering: undefined,
			mode: {},
			// actions
			setTheme: (theme) => set({ theme }),
			toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
			toggleModal: (modal) =>
				set((s) => ({
					modals: { ...s.modals, [modal]: !s.modals[modal] },
					modalOptions: { ...s.modalOptions, [modal]: undefined },
				})),
			openModalWithOptions: (modal, options) =>
				set((s) => ({
					modals: { ...s.modals, [modal]: true },
					modalOptions: { ...s.modalOptions, [modal]: options },
				})),
			closeAllModals: () => set({ modals: { ...initialModals }, modalOptions: {} }),
			setOrderName: (name) => set({ orderName: name, mode: {} }),
			setAlteringOrder: (id) =>
				set({
					altering: id ? { order: id } : undefined,
					mode: {},
				}),
			setAlteringRecord: (record) =>
				set((s) =>
					s.altering
						? {
								altering: { ...s.altering, record },
								mode: { ...s.mode, record: record === undefined ? undefined : "update" },
						  }
						: s
				),
			setOrderMode: (mode) => set((s) => ({ mode: { ...s.mode, ...mode } })),
			resetOrderMode: () => set({ mode: {} }),
			setTimeRange: (timeRange) => set({ timeRange }),
		}),
		{
			name: "client-store",
			partialize: (state) =>
				({
					theme: state.theme,
					orderName: state.orderName,
					timeRange: state.timeRange,
				} as PersistedState),
		}
	)
);
