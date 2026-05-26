import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/rest/api";
import { BaseService } from "./technical/base.service";

@injectable()
export class UserService extends BaseService {
	private readonly backendApi: BackendApi;

	constructor(@inject(BackendApi) backendApi: BackendApi) {
		super();
		this.backendApi = backendApi;
	}

	public merge(nextName: string, users: string[]) {
		return this.backendApi.client.v1UserMergeUsers(nextName, users).then(this.unWrapAxios);
	}

	public getAll() {
		return this.backendApi.client.v1UserGetUsers().then(this.unWrapAxios);
	}
}
