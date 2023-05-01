import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/backend";
import { BaseService } from "./technical/base.service";
import { ConfigBase } from "@apis/backend/generated";

@injectable()
export class ConfigService extends BaseService {
	@inject(BackendApi)
	private backendApiClient!: BackendApi;

	public update(config: ConfigBase) {
		return this.backendApiClient.config.update(config);
	}

	public get() {
		return this.backendApiClient.config.get();
	}
}
