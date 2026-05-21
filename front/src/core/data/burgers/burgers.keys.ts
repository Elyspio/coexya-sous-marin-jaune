export const burgersKeys = {
	all: ["burgers"] as const,
	list: () => [...burgersKeys.all, "list"] as const,
};
