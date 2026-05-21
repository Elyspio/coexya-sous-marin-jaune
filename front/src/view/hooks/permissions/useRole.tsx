import { SousMarinJauneRole } from "@apis/authentication/generated";
import { useAuth } from "@/core/data/auth/AuthContext";

export function useRole(role: SousMarinJauneRole): boolean {
	const { permissions } = useAuth();
	return permissions?.role === role;
}
