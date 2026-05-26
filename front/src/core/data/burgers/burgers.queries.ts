import {useQuery} from "@tanstack/react-query";
import {getService} from "../api/services";
import {BurgerService} from "@services/burger.service";
import {burgersKeys} from "./burgers.keys";
import type {Burger} from "@apis/rest/api/generated";

const EMPTY: Burger[] = [];

export function useBurgers() {
	const query = useQuery({
		queryKey: burgersKeys.list(),
		queryFn: () => getService(BurgerService).getAll(),
		staleTime: "static",
	});
	return query.data ?? EMPTY;
}
