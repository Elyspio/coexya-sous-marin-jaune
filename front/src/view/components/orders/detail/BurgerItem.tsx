import * as React from "react";
import { Box, Chip, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { debounce } from "@mui/material/utils";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { BurgerRecord } from "@apis/rest/api/generated";
import { noneBurger, useOrderEditing, useUpdateAndSaveOrder } from "@/core/data/orders/orders.editing";
import { useClientStore } from "@/core/store/clientStore";
import { useOrder } from "@/core/data/orders/orders.queries";
import { useBurgers } from "@/core/data/burgers/burgers.queries";
import { useUpdateRemoteOrder } from "@/core/data/orders/orders.mutations";

export function BurgerItem({ data, index }: { data: BurgerRecord; index: number }) {
	const setAlteringRecord = useClientStore((s) => s.setAlteringRecord);
	const alteringOrderId = useClientStore((s) => s.altering?.order);
	const order = useOrder(alteringOrderId);
	const burgers = useBurgers();
	const { deleteOrderRecord } = useOrderEditing();
	const updateRemote = useUpdateRemoteOrder();
	const updateAndSave = useUpdateAndSaveOrder();

	const def = burgers.find((b) => b.name === data.name);
	const chosen = data.name !== noneBurger && !!def;

	const edit = React.useCallback(() => setAlteringRecord(index), [setAlteringRecord, index]);

	const del = React.useCallback(() => {
		deleteOrderRecord(index);
		if (order) {
			updateRemote.mutate({ ...order, burgers: [...order.burgers.slice(0, index), ...order.burgers.slice(index + 1)] });
		}
	}, [deleteOrderRecord, index, order, updateRemote]);

	const setComment = React.useMemo(
		() =>
			debounce((txt: string) => {
				if (!order) return;
				const next = order.burgers.slice();
				next[index] = { ...next[index], comment: txt };
				updateAndSave({ ...order, burgers: next });
			}, 300),
		[order, index, updateAndSave],
	);

	const onCommentChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value), [setComment]);

	return (
		<Stack
			spacing={1}
			sx={(t) => ({
				p: "12px 14px",
				border: `1px solid ${t.palette.custom.line}`,
				borderRadius: "8px",
				backgroundColor: t.palette.custom.paper,
			})}
		>
			<Stack direction="row" alignItems="center" spacing={1.75}>
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Stack direction="row" alignItems="center" spacing={1}>
						<Typography sx={{ fontWeight: 600, fontSize: 14, color: chosen ? "custom.ink" : "custom.ink3" }}>{chosen ? data.name : "Choisir un burger"}</Typography>
						{data.vegetarian && <Chip label="VEGE" size="small" variant="outlined" />}
						{data.xl && <Chip label="XL" size="small" variant="outlined" />}
					</Stack>
					{chosen && (
						<Typography sx={{ fontSize: 12, color: "custom.ink3", mt: 0.25 }}>
							{def!.ingredients.map((ing, k) => (
								<React.Fragment key={ing}>
									{data.excluded.includes(ing) ? <Box component="del" sx={{ color: "custom.ink4" }}>{ing}</Box> : <span>{ing}</span>}
									{k < def!.ingredients.length - 1 ? ", " : ""}
								</React.Fragment>
							))}
						</Typography>
					)}
				</Box>
				<Tooltip title="Modifier">
					<IconButton size="small" aria-label="Modifier le burger" onClick={edit}>
						<EditIcon sx={{ fontSize: 17 }} color="primary" />
					</IconButton>
				</Tooltip>
				<Tooltip title="Retirer">
					<IconButton size="small" aria-label="Retirer le burger" onClick={del}>
						<DeleteIcon sx={{ fontSize: 17 }} color="error" />
					</IconButton>
				</Tooltip>
			</Stack>

			{chosen && <TextField key={`${index}-${data.name}`} label="Commentaire" variant="standard" fullWidth defaultValue={data.comment ?? ""} onChange={onCommentChange} />}
		</Stack>
	);
}
