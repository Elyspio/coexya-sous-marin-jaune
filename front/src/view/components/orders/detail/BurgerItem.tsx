import { BurgerRecord } from "../../../../core/apis/backend/generated";
import { useAppDispatch } from "../../../../store";
import React from "react";
import { deleteOrderRecord, setAlteringRecord } from "../../../../store/module/orders/orders.action";
import { updateRemoteOrder } from "../../../../store/module/orders/orders.async.action";
import { Box, ButtonGroup, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export function BurgerItem({ data, index }: { data: BurgerRecord; index: number }) {
	const dispatch = useAppDispatch();

	const edit = React.useCallback(() => {
		dispatch(setAlteringRecord(index));
	}, [dispatch, index]);

	const del = React.useCallback(() => {
		dispatch(deleteOrderRecord(index));
		dispatch(updateRemoteOrder());
	}, [dispatch, index]);

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
