import { SousMarinJauneRole } from "@apis/authentication/generated";
import { useAppSelector } from "@store";

export function useRole(role: SousMarinJauneRole): boolean {
	const roles = useAppSelector((s) => [s.authentication.permissions?.role].filter(Boolean));

	return roles.includes(role);
}
