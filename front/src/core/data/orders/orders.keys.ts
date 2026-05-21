export const ordersKeys = {
	all: ["orders"] as const,
	list: () => [...ordersKeys.all, "list"] as const,
};
