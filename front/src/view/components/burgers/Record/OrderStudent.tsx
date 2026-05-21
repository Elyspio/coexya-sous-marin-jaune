import { Order } from "@apis/backend/generated";
import React, { useCallback } from "react";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { useUpdateAndSaveOrder } from "@/core/data/orders/orders.editing";

export function OrderStudent({ data }: { data: Order }) {
	const updateAndSave = useUpdateAndSaveOrder();

	const setOrder = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			updateAndSave({ ...data, student: e.target.checked });
		},
		[data, updateAndSave],
	);

	return (
		<Box width={"100%"}>
			<FormControlLabel control={<Checkbox sx={{ pl: 0 }} checked={data.student} onChange={setOrder} />} label={"Etudiant"} sx={{ ml: 0 }} />
		</Box>
	);
}
