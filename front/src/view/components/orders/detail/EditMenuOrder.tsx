import * as React from "react";
import { useEffect } from "react";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { BurgerItem } from "./BurgerItem";
import { OrderStudent } from "../../burgers/Record/OrderStudent";
import { OrderFries } from "../../burgers/Record/OrderFries";
import { OrderDrink } from "../../burgers/Record/OrderDrink";
import { OrderDessert } from "../../burgers/Record/OrderDessert";
import { EditBurgerRecord } from "../../burgers/Record/EditBurgerRecord";
import { useClientStore } from "@/core/store/clientStore";
import { useOrder } from "@/core/data/orders/orders.queries";
import { useOrderEditing } from "@/core/data/orders/orders.editing";

export function SectionTitle({ children }: { children: React.ReactNode }) {
	return <Typography variant="eyebrow">{children}</Typography>;
}

export function EditMenuOrder() {
	const alteringId = useClientStore((s) => s.altering?.order);
	const recordIndex = useClientStore((s) => s.altering?.record);
	const order = useOrder(alteringId);
	const { createOrderRecord } = useOrderEditing();

	const addRecord = React.useCallback(() => createOrderRecord(), [createOrderRecord]);

	useEffect(() => {
		if (order?.burgers.length === 0) addRecord();
	}, [order, addRecord]);

	if (!order) return null;

	return (
		<>
			<Box sx={{ mb: 3.5 }}>
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.25 }}>
					<SectionTitle>Burgers</SectionTitle>
					<Typography variant="mono" sx={{ fontSize: 12, color: "custom.ink3" }}>
						{order.burgers.length} {order.burgers.length > 1 ? "items" : "item"}
					</Typography>
				</Stack>
				<Stack spacing={1}>
					{order.burgers.map((burger, i) => (
						<BurgerItem data={burger} key={i} index={i} />
					))}
				</Stack>
				<ButtonBase
					onClick={addRecord}
					sx={(t) => ({
						mt: 1,
						width: "100%",
						display: "flex",
						alignItems: "center",
						gap: 1.25,
						justifyContent: "center",
						p: "12px 14px",
						border: `1px dashed ${t.palette.custom.line}`,
						borderRadius: "8px",
						color: t.palette.custom.ink3,
						fontSize: 13,
						fontWeight: 500,
						transition: "border-color 120ms ease, color 120ms ease, background 120ms ease",
						"&:hover": { borderColor: t.palette.custom.accent, color: t.palette.custom.accent },
					})}
				>
					<Add sx={{ fontSize: 16 }} /> Ajouter un burger
				</ButtonBase>
			</Box>

			<Box>
				<Box sx={{ mb: 1.25 }}>
					<SectionTitle>Accompagnements</SectionTitle>
				</Box>
				<Stack spacing={1}>
					<OrderFries data={order} />
					<OrderDrink data={order} />
					<OrderDessert data={order} />
					<OrderStudent data={order} />
				</Stack>
			</Box>

			{recordIndex !== undefined && <EditBurgerRecord />}
		</>
	);
}
