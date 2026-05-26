import {useQuery} from "@tanstack/react-query";
import {getService} from "../api/services";
import {UserService} from "@services/user.service";
import {usersKeys} from "./users.keys";
import type {UserSold} from "@apis/rest/api/generated";

const EMPTY: UserSold[] = [];

export function useUsers() {
	const query = useQuery({
		queryKey: usersKeys.list(),
		queryFn: () => getService(UserService).getAll(),
	});
	return query.data ?? EMPTY;
}
