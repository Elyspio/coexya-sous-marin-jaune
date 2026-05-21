import {useQuery} from "@tanstack/react-query";
import {service} from "../api/services";
import {BurgerService} from "@services/burger.service";
import {burgersKeys} from "./burgers.keys";
import type {Burger} from "@apis/backend/generated";

const EMPTY: Burger[] = [];

export function useBurgers() {
	const query = useQuery({
		queryKey: burgersKeys.list(),
		queryFn: () => service(BurgerService).getAll(),
		staleTime: "static",
	});
	return query.data ?? EMPTY;
}
