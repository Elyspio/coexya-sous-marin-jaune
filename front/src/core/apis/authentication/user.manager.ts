import { UserManager } from 'oidc-client-ts';
export function getUserManager() {


	return new UserManager({
		...window.config.oidc
	})
}