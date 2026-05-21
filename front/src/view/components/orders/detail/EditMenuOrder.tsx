import React, { useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { BurgerItem } from "./BurgerItem";
import { OrderStudent } from "../../burgers/Record/OrderStudent";
import { OrderFries } from "../../burgers/Record/OrderFries";
import { OrderDrink } from "../../burgers/Record/OrderDrink";
import { EditBurgerRecord } from "../../burgers/Record/EditBurgerRecord";
import { useClientStore } from "@/core/store/clientStore";
import { useOrder } from "@/core/data/orders/orders.queries";
import { useOrderEditing } from "@/core/data/orders/orders.editing";

export function EditMenuOrder() {
	const alteringId = useClientStore((s) => s.altering?.order);
	const recordIndex = useClientStore((s) => s.altering?.record);
	const order = useOrder(alteringId);
	const { createOrderRecord } = useOrderEditing();

	const addRecord = React.useCallback(() => {
		createOrderRecord();
	}, [createOrderRecord]);

	useEffect(() => {
		if (order?.burgers.length === 0) addRecord();
	}, [order, addRecord]);

	if (!order) return null;

	return (
		<>
			<Stack height={"100%"} px={2} minWidth={450} direction={"column"} justifyContent={"space-around"}>
				<Box>
					<Stack direction={"row"} spacing={3}>
						<Typography variant={"overline"}>Burgers </Typography>
					</Stack>
					<Box bgcolor={"background.default"} pl={2} borderRadius={4}>
						<Stack p={1} m={1} spacing={1} alignItems={"center"}>
							{order.burgers.map((burger, i) => (
								<BurgerItem data={burger} key={i} index={i} />
							))}
							<Button variant={"outlined"} sx={{ width: 100 }} color={"secondary"} size={"small"} onClick={addRecord}>
								Ajouter
							</Button>
						</Stack>
					</Box>
				</Box>

				<Stack spacing={1}>
					<Typography variant={"overline"}>Menu</Typography>

					<OrderStudent data={order} />
					<OrderFries data={order} />
					<OrderDrink data={order} />
				</Stack>
			</Stack>

			{recordIndex !== undefined && <EditBurgerRecord />}
		</>
	);
}
