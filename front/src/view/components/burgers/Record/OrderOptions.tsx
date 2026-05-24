import * as React from "react";
import { Stack, Switch, Typography } from "@mui/material";
import { BurgerRecord } from "@apis/backend/generated";
import { OptRow } from "@components/ui/OptRow";
import { useOrderEditing } from "@/core/data/orders/orders.editing";

export function OrderOptions({ data }: { data: BurgerRecord }) {
	const { updateBurgerRecord } = useOrderEditing();

	const toggle = React.useCallback(
		(key: "xl" | "vegetarian") => (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
			updateBurgerRecord({ ...data, [key]: checked });
		},
		[data, updateBurgerRecord],
	);

	return (
		<Stack spacing={1}>
			<OptRow
				label="Taille XL"
				children={
					<Stack direction="row" alignItems="center" spacing={1.25}>
						<Switch checked={!!data.xl} onChange={toggle("xl")} />
						<Typography sx={{ fontSize: 12, color: "custom.ink3" }}>double steak</Typography>
					</Stack>
				}
			/>
			<OptRow label="Végétarien">
				<Switch checked={data.vegetarian} onChange={toggle("vegetarian")} />
			</OptRow>
		</Stack>
	);
}
