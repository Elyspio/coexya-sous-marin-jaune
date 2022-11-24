import { Order } from "../../../../core/apis/backend/generated";
import { useAppDispatch } from "../../../../store";
import React, { useCallback } from "react";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { updateOrder } from "../../../../store/module/orders/orders.action";

export function OrderStudent({ data }: { data: Order }) {


	const dispatch = useAppDispatch();

	const setOrder = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(updateOrder({
			...data,
			student: e.target.checked,
		}));
	}, [data, dispatch]);


	return <Box width={"100%"}>
		<FormControlLabel
			control={<Checkbox sx={{ pl: 0 }} checked={data.student} onChange={setOrder} />}
			label={"Etudiant"}
			sx={{ ml: 0 }}
		/>
	</Box>;

}