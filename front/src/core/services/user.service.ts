import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/backend";
import { BaseService } from "./technical/base.service";

@injectable()
export class UserService extends BaseService {
	@inject(BackendApi)
	private backendApiClient!: BackendApi;

	public merge(nextName: string, users: string[]) {
		return this.backendApiClient.users.mergeUsers(nextName, users);
	}

	public getAll() {
		return this.backendApiClient.users.getUsers();
	}
}
