import { openPage } from "../../utils/web";
import { inject, injectable } from "inversify";
import { AuthenticationApiClient } from "@apis/authentication";
import { EventManager } from "../../utils/event";
import { BaseService } from "../technical/base.service";
import { User } from "@apis/authentication/generated";
import { DiKeysService } from "../../di/services/di.keys.service";
import { LocalStorageService } from "./localStorage.service";

@injectable()
export class AuthenticationService extends BaseService {
	@inject(DiKeysService.localStorage.jwt)
	private localStorage!: LocalStorageService;

	@inject(AuthenticationApiClient)
	private authenticationApi!: AuthenticationApiClient;

	public openLoginPage() {
		return openPage(`${window.config.endpoints.authentication}/login`);
	}

	public async logout() {
		await this.localStorage.remove();
		AuthenticationEvents.emit("logout");
	}

	public isValid() {
		return this.authenticationApi.jwt.verify();
	}
}

export const AuthenticationEvents = new EventManager<{
	login: (user: User) => void;
	logout: () => void;
}>();
