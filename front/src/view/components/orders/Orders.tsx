import React, { useMemo } from "react";
import { Autocomplete, FormControl, Paper, Stack, TextField, Typography } from "@mui/material";
import { debounce } from "@mui/material/utils";
import { CreateOrder } from "./list/CreateOrder";
import { AllOrders } from "./list/AllOrders";
import { useIsSmallScreen } from "@hooks/utils/useBreakpoint";
import "dayjs/locale/fr";
import { useRole } from "@hooks/permissions/useRole";
import { SousMarinJauneRole } from "@apis/authentication/generated";
import { lastTime } from "@/core/data/orders/orders.utils";
import { useTime } from "@hooks/utils/useTime";
import { useClientStore } from "@/core/store/clientStore";
import { useOrders } from "@/core/data/orders/orders.queries";
import { useUsers } from "@/core/data/users/users.queries";

export function Orders() {
	const orders = useOrders();
	const allUsers = useUsers();
	const user = useClientStore((s) => s.orderName);
	const setOrderName = useClientStore((s) => s.setOrderName);

	const users = React.useMemo(() => [...new Set(orders.map((order) => order.user))].sort(), [orders]);

	const setUserDebounced = React.useMemo(
		() =>
			debounce((str: string | null) => {
				const usr = str ? str[0].toUpperCase() + str.slice(1) : undefined;
				setOrderName(usr);
			}, 50),
		[setOrderName],
	);

	const onChange = React.useCallback(
		(_: React.SyntheticEvent, str: string) => {
			return setUserDebounced(str);
		},
		[setUserDebounced],
	);

	const isAdmin = useRole(SousMarinJauneRole.Admin);

	const userBalance = useMemo(() => allUsers.find((u) => u.name === user)?.sold, [allUsers, user]);

	const isSmall = useIsSmallScreen();

	const now = useTime();

	const remainingTimeToOrder = lastTime.from(now, false);

	const tooLate = useMemo(() => now.isAfter(lastTime), [now]);

	const canCreate = useMemo(() => user && (!tooLate || isAdmin), [user, tooLate, isAdmin]);
	return (
		<Paper className={"maxHeightWidth"}>
			<Stack m={isSmall ? 1 : 2} spacing={2} p={isSmall ? 0 : 2} className={"maxHeightWidth"}>
				<Stack direction={"row"} spacing={1} width={"100%"}>
					<Typography textAlign={"right"}>Fin des commandes</Typography>
					<Typography textAlign={"right"} color={tooLate ? "error" : "yellow"}>
						{remainingTimeToOrder.toString()}
					</Typography>
				</Stack>
				<Stack spacing={4} direction={"row"} alignItems={"center"}>
					<FormControl sx={{ maxWidth: 150 }} fullWidth>
						<Autocomplete
							fullWidth
							id="select-user"
							value={user ?? ""}
							freeSolo
							options={users}
							onChange={onChange as any}
							renderInput={(params) => <TextField {...params} variant={"standard"} required label="Prénom" onBlur={(e) => setUserDebounced(e.target.value)} />}
						/>
					</FormControl>

					{canCreate && <CreateOrder />}

					{userBalance !== undefined && (
						<Stack direction={"row"} spacing={2} alignItems={"center"}>
							<Typography variant={"overline"} fontSize={"100%"}>
								Solde
							</Typography>
							<Typography>
								{userBalance > 0 ? "+ " : ""}
								{userBalance.toFixed(2)}€
							</Typography>
						</Stack>
					)}
				</Stack>

				<AllOrders />
			</Stack>
		</Paper>
	);
}
