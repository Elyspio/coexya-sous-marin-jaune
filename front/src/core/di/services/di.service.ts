import { AuthenticationService } from "../../services/common/authentication.service";
import { ThemeService } from "../../services/common/theme.service";
import { LocalStorageService } from "../../services/common/localStorage.service";
import { DiKeysService } from "./di.keys.service";
import { BurgerService } from "../../services/burger.service";
import { Container } from "inversify";
import { OrderService } from "../../services/order.service";
import { UpdateSocketService } from "../../services/socket/update.socket.service";
import { UserService } from "../../services/user.service";

export const addServices = (container: Container) => {
	container.bind(AuthenticationService).toSelf();
	container.bind(ThemeService).toSelf();
	container.bind<LocalStorageService>(DiKeysService.localStorage.settings).toConstantValue(new LocalStorageService("elyspio-authentication-settings"));
	container.bind<LocalStorageService>(DiKeysService.localStorage.validation).toConstantValue(new LocalStorageService("elyspio-authentication-validation"));
	container.bind(BurgerService).toSelf();
	container.bind(OrderService).toSelf();
	container.bind(UpdateSocketService).toSelf();
	container.bind(UserService).toSelf();

};