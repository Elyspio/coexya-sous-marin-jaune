import { BurgerRecord } from "@apis/backend/generated";
import React from "react";
import { Box, ButtonGroup, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useClientStore } from "@/core/store/clientStore";
import { useOrderEditing } from "@/core/data/orders/orders.editing";
import { useUpdateRemoteOrder } from "@/core/data/orders/orders.mutations";
import { useOrder } from "@/core/data/orders/orders.queries";

export function BurgerItem({ data, index }: { data: BurgerRecord; index: number }) {
	const setAlteringRecord = useClientStore((s) => s.setAlteringRecord);
	const alteringOrderId = useClientStore((s) => s.altering?.order);
	const order = useOrder(alteringOrderId);
	const { deleteOrderRecord } = useOrderEditing();
	const updateRemote = useUpdateRemoteOrder();

	const edit = React.useCallback(() => {
		setAlteringRecord(index);
	}, [setAlteringRecord, index]);

	const del = React.useCallback(() => {
		deleteOrderRecord(index);
		if (order) {
			const next = {
				...order,
				burgers: [...order.burgers.slice(0, index), ...order.burgers.slice(index + 1)],
			};
			updateRemote.mutate(next);
		}
	}, [deleteOrderRecord, index, order, updateRemote]);

	const exclusion = React.useMemo(() => <>(sans {data.excluded.join(", ")})</>, [data.excluded]);

	return (
		<Stack direction={"row"} spacing={2} justifyContent={"flex-start"} alignItems={"center"} width={"100%"}>
			<Tooltip title={data.name}>
				<Typography noWrap>{data.name}</Typography>
			</Tooltip>

			{data.excluded.length > 0 && (
				<Tooltip title={exclusion}>
					<Typography noWrap>{exclusion}</Typography>
				</Tooltip>
			)}
			<Box sx={{ marginLeft: "auto !important", pl: 2 }}>
				<ButtonGroup variant="outlined">
					<IconButton onClick={edit}>
						<EditIcon color={"primary"} />
					</IconButton>
					<IconButton onClick={del}>
						<DeleteIcon color={"error"} />
					</IconButton>
				</ButtonGroup>
			</Box>
		</Stack>
	);
}
