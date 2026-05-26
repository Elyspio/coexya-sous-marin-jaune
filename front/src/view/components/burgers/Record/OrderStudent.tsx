import * as React from "react";
import { useCallback } from "react";
import { Switch } from "@mui/material";
import { Order } from "@apis/rest/api/generated";
import { OptRow } from "@components/ui/OptRow";
import { useUpdateAndSaveOrder } from "@/core/data/orders/orders.editing";

export function OrderStudent({ data }: { data: Order }) {
	const updateAndSave = useUpdateAndSaveOrder();

	const setStudent = useCallback((_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => updateAndSave({ ...data, student: checked }), [data, updateAndSave]);

	return (
		<OptRow label="Étudiant">
			<Switch checked={data.student} onChange={setStudent} slotProps={{ input: { "aria-label": "Étudiant" } }} />
		</OptRow>
	);
}
