import * as React from "react";
import { useRef } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from "@mui/material";
import Close from "@mui/icons-material/Close";
import Check from "@mui/icons-material/Check";
import { OrderOptions } from "./OrderOptions";
import { Burgers } from "../Burgers";
import { SectionTitle } from "@components/orders/detail/EditMenuOrder";
import { ChipToggle } from "@components/ui/ChipToggle";
import { noneBurger, useOrderEditing } from "@/core/data/orders/orders.editing";
import { useClientStore } from "@/core/store/clientStore";
import { useOrder } from "@/core/data/orders/orders.queries";
import { useBurgers } from "@/core/data/burgers/burgers.queries";
import { useDeleteOrder, useUpdateRemoteOrder } from "@/core/data/orders/orders.mutations";

export function EditBurgerRecord() {
	const alteringOrderId = useClientStore((s) => s.altering?.order);
	const recordIndex = useClientStore((s) => s.altering?.record);
	const mode = useClientStore((s) => s.mode);
	const setAlteringRecord = useClientStore((s) => s.setAlteringRecord);
	const order = useOrder(alteringOrderId);
	const burgers = useBurgers();
	const { updateBurgerRecord, deleteCurrentOrderRecord, setOrderRecordBurger } = useOrderEditing();
	const { mutate: deleteOrder } = useDeleteOrder();
	const updateRemote = useUpdateRemoteOrder();

	const data = order && recordIndex !== undefined ? order.burgers[recordIndex] : undefined;
	const burger = burgers.find((b) => b.name === data?.name);
	const display = alteringOrderId !== undefined;

	const unchangedData = useRef(data);

	const close = React.useCallback(
		(choice: "success" | "cancel") => () => {
			if (choice === "success") {
				if (order) updateRemote.mutate(order);
			} else if (unchangedData.current) {
				updateBurgerRecord(unchangedData.current);
			}

			if (choice === "cancel") {
				if (mode.order === "create" && alteringOrderId) deleteOrder(alteringOrderId);
				else if (mode.record === "create") deleteCurrentOrderRecord();
			} else {
				setAlteringRecord(undefined);
			}
		},
		[mode.order, mode.record, alteringOrderId, deleteOrder, deleteCurrentOrderRecord, setAlteringRecord, order, updateRemote, updateBurgerRecord],
	);

	const updateExcluded = React.useCallback(
		(ingredient: string) => () => {
			if (!data) return;
			const included = data.excluded.includes(ingredient);
			updateBurgerRecord({ ...data, excluded: included ? data.excluded.filter((i) => i !== ingredient) : [...data.excluded, ingredient] });
		},
		[updateBurgerRecord, data],
	);

	if (!data) return null;

	const chosen = data.name !== noneBurger && !!burger;

	return (
		<Dialog open={display} onClose={close("cancel")} maxWidth={false} slotProps={{ paper: { sx: { width: 720, maxWidth: "calc(100vw - 40px)" } } }}>
			<DialogTitle sx={{ pb: 1.5 }}>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Box>
						<Typography variant="eyebrow">{chosen ? "Personnaliser" : "Choisir un burger"}</Typography>
						<Typography variant="h4">{chosen ? data.name : "Au menu"}</Typography>
					</Box>
					<IconButton onClick={close("cancel")}>
						<Close sx={{ fontSize: 18 }} />
					</IconButton>
				</Stack>
			</DialogTitle>
			<DialogContent dividers>
				{chosen ? (
					<Stack direction={{ xs: "column", sm: "row" }} spacing={3.5} alignItems="flex-start">
						<Box sx={{ minWidth: 260 }}>
							<Box sx={{ mb: 1.25 }}>
								<SectionTitle>Ingrédients</SectionTitle>
							</Box>
							<Stack>
								{burger!.ingredients.map((ing) => {
									const included = !data.excluded.includes(ing);
									return (
										<Stack
											key={ing}
											direction="row"
											alignItems="center"
											spacing={1.25}
											onClick={updateExcluded(ing)}
											sx={(t) => ({ p: "7px 10px", borderRadius: "6px", cursor: "pointer", userSelect: "none", "&:hover": { backgroundColor: t.palette.custom.paper2 } })}
										>
											<Box
												sx={(t) => ({
													width: 18,
													height: 18,
													borderRadius: "5px",
													display: "grid",
													placeItems: "center",
													border: `1.5px solid ${included ? t.palette.custom.ink : t.palette.custom.ink4}`,
													backgroundColor: included ? t.palette.custom.ink : "transparent",
													color: t.palette.custom.paper,
												})}
											>
												{included && <Check sx={{ fontSize: 12 }} />}
											</Box>
											<Typography sx={{ color: included ? "custom.ink" : "custom.ink4", textDecoration: included ? "none" : "line-through" }}>{ing}</Typography>
										</Stack>
									);
								})}
							</Stack>
						</Box>

						<Divider flexItem orientation="vertical" sx={{ display: { xs: "none", sm: "block" } }} />

						<Box sx={{ flex: 1, width: "100%" }}>
							<Box sx={{ mb: 1.25 }}>
								<SectionTitle>Options</SectionTitle>
							</Box>
							<OrderOptions data={data} />
							<Box sx={{ mt: 2, mb: 1.25 }}>
								<SectionTitle>Changer</SectionTitle>
							</Box>
							<Stack direction="row" flexWrap="wrap" gap={0.75}>
								{burgers.map((b) => (
									<ChipToggle key={b.name} selected={b.name === data.name} onClick={() => setOrderRecordBurger(b.name)}>
										{b.name}
									</ChipToggle>
								))}
							</Stack>
						</Box>
					</Stack>
				) : (
					<Burgers />
				)}
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button variant="soft" onClick={close("cancel")}>
					Fermer
				</Button>
				<Button variant="solid" startIcon={<Check />} disabled={!chosen} onClick={close("success")}>
					Confirmer
				</Button>
			</DialogActions>
		</Dialog>
	);
}
