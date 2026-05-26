export const ordersKeys = {
	all: ["orders"] as const,
	list: () => [...ordersKeys.all, "list"] as const,
	creationInfo: () => [...ordersKeys.all, "creation-info"] as const,
};
