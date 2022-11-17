import { injectable } from "inversify";
import axios from "axios";
import { TodoClient, TodoUserClient } from "./generated";

const instance = axios.create({
	withCredentials: true,
});

@injectable()
export class BackendApi {


	public readonly todo = {
		common: new TodoClient(window.config.endpoints.core, instance),
		user: new TodoUserClient(window.config.endpoints.core, instance),
	};
}
