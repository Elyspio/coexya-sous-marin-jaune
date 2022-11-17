import { inject, injectable } from "inversify";
import { BackendApi } from "../apis/backend";
import { Todo } from "../apis/backend/generated";
import { BaseService } from "./base.service";

interface ITodoServiceSub {
	get: () => Promise<Todo[]>;
	add: (label: string) => Promise<Todo>;
	remove: (id: Todo["id"]) => Promise<void>;
	check: (id: Todo["id"]) => Promise<Todo>;
}

@injectable()
export class TodoService extends BaseService {
	@inject(BackendApi)
	private backendApiClient!: BackendApi;

	public common: ITodoServiceSub = {
		get: async () => {
			return await this.backendApiClient.todo.common.getAll().then(this.unWrapAxios);
		},
		add: async (label: string) => {
			return await this.backendApiClient.todo.common.add(label).then(this.unWrapAxios);
		},
		check: async (id: Todo["id"]) => {
			return await this.backendApiClient.todo.common.check(id).then(this.unWrapAxios);
		},
		remove: async (id: Todo["id"]) => {
			await this.backendApiClient.todo.common._delete(id);
		},
	};

	public user: ITodoServiceSub = {
		get: async () => {
			return await this.backendApiClient.todo.user.getAllForUser().then(this.unWrapAxios);
		},
		add: async (label: string) => {
			return await this.backendApiClient.todo.user.addForUser(label).then(this.unWrapAxios);
		},
		check: async (id: Todo["id"]) => {
			return await this.backendApiClient.todo.user.checkForUser(id).then(this.unWrapAxios);
		},
		remove: async (id: Todo["id"]) => {
			await this.backendApiClient.todo.user.deleteForUser(id);
		},
	};
}
