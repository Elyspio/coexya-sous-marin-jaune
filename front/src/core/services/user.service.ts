import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/backend";
import { BaseService } from "./technical/base.service";

@injectable()
export class UserService extends BaseService {
	@inject(BackendApi)
	private readonly backendApiClient!: BackendApi;

	public merge(nextName: string, users: string[]) {
		return this.backendApiClient.users.v1_User_MergeUsers(nextName, users);
	}

	public getAll() {
		return this.backendApiClient.users.v1_User_GetUsers();
	}

	async getUserPermissions() {
		return this.backendApiClient.users.v1_User_GetUserPermissions();
	}
}
