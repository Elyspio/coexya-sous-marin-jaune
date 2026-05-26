import * as React from "react";
import { useCallback, useMemo } from "react";
import { Box, Stack, Switch, Typography } from "@mui/material";
import { Order, Sauce } from "@apis/rest/api/generated";
import { OptRow } from "@components/ui/OptRow";
import { QtyStepper } from "@components/ui/QtyStepper";
import { useUpdateAndSaveOrder } from "@/core/data/orders/orders.editing";
import { useUpdateSauceQuantity } from "@/core/data/orders/orders.mutations";

const MAX_SAUCES = 2;

export function OrderFries({ data }: { data: Order }) {
	const updateAndSave = useUpdateAndSaveOrder();
	const { mutate: updateSauceQuantity } = useUpdateSauceQuantity();

	const toggleFries = useCallback(() => {
		updateAndSave({ ...data, fries: data.fries ? undefined : { sauces: [] } });
	}, [data, updateAndSave]);

	const quantityPerSauce = useMemo(() => {
		const base = Object.values(Sauce).reduce((acc, s) => ({ ...acc, [s]: 0 }), {} as Record<Sauce, number>);
		for (const sq of data.fries?.sauces ?? []) base[sq.sauce] = sq.amount;
		return base;
	}, [data.fries]);

	const nbSauces = useMemo(() => Object.values(quantityPerSauce).reduce((acc, n) => acc + n, 0), [quantityPerSauce]);

	const onSauceChange = useCallback(
		(sauce: Sauce) => (quantity: number) => {
			updateSauceQuantity({ idOrder: data.id, sauce, quantity });
		},
		[data.id, updateSauceQuantity],
	);

	return (
		<>
			<OptRow label="Frites">
				<Switch checked={!!data.fries} onChange={toggleFries} slotProps={{ input: { "aria-label": "Frites" } }} />
			</OptRow>

			{data.fries && (
				<OptRow label="Sauces" stacked>
					<Box sx={{ width: "100%" }}>
						<Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
							<Typography variant="mono" sx={{ fontSize: 12, color: "custom.ink3" }}>
								{nbSauces}/{MAX_SAUCES} sélectionnées
							</Typography>
						</Stack>
						{Object.values(Sauce).map((sauce) => (
							<Stack key={sauce} direction="row" alignItems="center" justifyContent="space-between" sx={(t) => ({ py: 1, borderBottom: `1px solid ${t.palette.custom.lineSoft}`, "&:last-of-type": { borderBottom: 0 } })}>
								<Typography sx={{ color: quantityPerSauce[sauce] > 0 ? "custom.ink" : "custom.ink3" }}>{sauce}</Typography>
								<QtyStepper value={quantityPerSauce[sauce]} onChange={onSauceChange(sauce)} max={MAX_SAUCES - nbSauces + quantityPerSauce[sauce]} />
							</Stack>
						))}
					</Box>
				</OptRow>
			)}
		</>
	);
}
