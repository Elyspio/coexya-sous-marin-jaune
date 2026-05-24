import * as React from "react";
import { useCallback } from "react";
import { Dessert, Order } from "@apis/backend/generated";
import { OptRow } from "@components/ui/OptRow";
import { ChipToggle } from "@components/ui/ChipToggle";
import { useUpdateAndSaveOrder } from "@/core/data/orders/orders.editing";

const unavailableDesserts: Dessert[] = [Dessert.Brookie];

export function OrderDessert({ data }: { data: Order }) {
	const updateAndSave = useUpdateAndSaveOrder();

	const setDessert = useCallback((dessert: Dessert | undefined) => () => updateAndSave({ ...data, dessert }), [data, updateAndSave]);

	return (
		<OptRow label="Dessert">
			<ChipToggle selected={!data.dessert} onClick={setDessert(undefined)}>
				Aucun
			</ChipToggle>
			{(Object.values(Dessert) as Dessert[]).map((d) => (
				<ChipToggle key={d} selected={data.dessert === d} disabled={unavailableDesserts.includes(d)} onClick={setDessert(d)}>
					{d}
				</ChipToggle>
			))}
		</OptRow>
	);
}
