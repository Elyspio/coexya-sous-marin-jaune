import { BackendApi } from "@apis/rest/api";
import { AuthenticationApiClient } from "@apis/authentication";
import { Container } from "inversify";
import { UserManager } from "oidc-client-ts";
import { getUserManager } from "@apis/authentication/user.manager";

export const addApis = (container: Container) => {
	container.bind(BackendApi).toSelf();
	container.bind<AuthenticationApiClient>(AuthenticationApiClient).toSelf();
	container.bind(UserManager).toDynamicValue(getUserManager);
};
