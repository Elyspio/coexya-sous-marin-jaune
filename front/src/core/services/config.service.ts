import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/rest/api";
import { BaseService } from "./technical/base.service";
import { ConfigBase } from "@apis/rest/api/generated";

@injectable()
export class ConfigService extends BaseService {
	private readonly backendApi: BackendApi;

	constructor(@inject(BackendApi) backendApi: BackendApi) {
		super();
		this.backendApi = backendApi;
	}

	public update(config: ConfigBase) {
		return this.backendApi.client.v1ConfigUpdate(config).then(this.unWrapAxios);
	}

	public get() {
		return this.backendApi.client.v1ConfigGet().then(this.unWrapAxios);
	}
}
