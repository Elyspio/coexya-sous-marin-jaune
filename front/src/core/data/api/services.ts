import { container } from "@/core/di";
import type { Newable } from "inversify";

export function service<T>(klass: Newable<T>): T {
	return container.get(klass);
}
