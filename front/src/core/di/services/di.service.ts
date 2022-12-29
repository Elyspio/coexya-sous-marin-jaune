import { AuthenticationService } from "../../services/common/authentication.service";
import { ThemeService } from "../../services/common/theme.service";
import { LocalStorageService } from "../../services/common/localStorage.service";
import { DiKeysService } from "./di.keys.service";
import { BurgerService } from "../../services/burger.service";
import { Container } from "inversify";
import { OrderService } from "../../services/order.service";
import { UpdateSocketService } from "../../services/socket/update.socket.service";
import { UserService } from "../../services/user.service";
import { ConfigService } from "../../services/config.service";
import { TokenService } from "../../services/common/token.service";

export const addServices = (container: Container) => {
	container.bind(AuthenticationService).toSelf();
	container.bind(TokenService).toSelf();
	container.bind(ThemeService).toSelf();
	container.bind<LocalStorageService>(DiKeysService.localStorage.jwt).toConstantValue(new LocalStorageService("authentication:jwt"));
	container.bind(BurgerService).toSelf();
	container.bind(OrderService).toSelf();
	container.bind(UpdateSocketService).toSelf();
	container.bind(UserService).toSelf();
	container.bind(ConfigService).toSelf();
};
