import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/backend";
import { BaseService } from "./technical/base.service";

@injectable()
export class UserService extends BaseService {
	private readonly backendApiClient: BackendApi;

	constructor(@inject(BackendApi) backendApiClient: BackendApi) {
		super();
		this.backendApiClient = backendApiClient;
	}

	public merge(nextName: string, users: string[]) {
		return this.backendApiClient.users.v1_User_MergeUsers(nextName, users);
	}

	public getAll() {
		return this.backendApiClient.users.v1_User_GetUsers();
	}
}
