import * as React from "react";
import { useCallback } from "react";
import { Drink, Order } from "@apis/rest/api/generated";
import { OptRow } from "@components/ui/OptRow";
import { ChipToggle } from "@components/ui/ChipToggle";
import { drinkLabels } from "../../modals/OrderMessageModal";
import { useUpdateAndSaveOrder } from "@/core/data/orders/orders.editing";

const unavailableDrinks: Drink[] = [Drink.Limonade];

export function OrderDrink({ data }: { data: Order }) {
	const updateAndSave = useUpdateAndSaveOrder();

	const setDrink = useCallback((drink: Drink | undefined) => () => updateAndSave({ ...data, drink }), [data, updateAndSave]);

	return (
		<OptRow label="Boisson">
			<ChipToggle selected={!data.drink} onClick={setDrink(undefined)}>
				Aucune
			</ChipToggle>
			{(Object.values(Drink) as Drink[]).map((d) => (
				<ChipToggle key={d} selected={data.drink === d} disabled={unavailableDrinks.includes(d)} onClick={setDrink(d)}>
					{drinkLabels[d]}
				</ChipToggle>
			))}
		</OptRow>
	);
}
