export const configKeys = {
	all: ["config"] as const,
	current: () => [...configKeys.all, "current"] as const,
};
