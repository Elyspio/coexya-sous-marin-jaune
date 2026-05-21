import { useQuery } from "@tanstack/react-query";
import { service } from "../api/services";
import { UserService } from "@services/user.service";
import { usersKeys } from "./users.keys";
import type { UserSold } from "@apis/backend/generated";

const EMPTY: UserSold[] = [];

export function useUsers() {
	const query = useQuery({
		queryKey: usersKeys.list(),
		queryFn: () => service(UserService).getAll(),
	});
	return query.data ?? EMPTY;
}
