import { SousMarinJauneRole } from "@apis/authentication/generated";
import { useAppSelector } from "@store";

export function useRole(role: SousMarinJauneRole): boolean {
	const roles = useAppSelector((s) => s.authentication?.user?.authorizations.sousMarinJaune?.roles ?? []);

	return roles.includes(role);
}
