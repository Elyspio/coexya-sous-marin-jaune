import { BurgerRecord, Drink } from "../../../../core/apis/backend/generated";
import { useAppDispatch } from "../../../../store";
import React, { useCallback } from "react";
import { Checkbox, debounce, FormControlLabel, TextField } from "@mui/material";
import { updateBurgerRecord } from "../../../../store/module/orders/orders.action";

export function OrderOptions({ data }: { data: BurgerRecord }) {


	const dispatch = useAppDispatch();

	const setOrder = useCallback((e, val: Drink | null) => {
		dispatch(updateBurgerRecord({
			...data,
			drink: val ?? undefined,
		}));
	}, [data, dispatch]);


	const setComment = React.useMemo(() => debounce((txt: string) => {
		dispatch(updateBurgerRecord({
			...data,
			comment: txt,
		}));
	}, 100), [data]);

	const onCommentChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setComment(e.target.value);
	}, [setComment]);


	const updateCheckbox = React.useCallback((key: keyof Pick<BurgerRecord, "xl" | "vegetarian">) => () => {
		dispatch(updateBurgerRecord({
			...data,
			[key]: !data[key],
		}));
	}, [data]);

	return <>
		<FormControlLabel
			control={<Checkbox sx={{ pl: 0 }} checked={data.vegetarian} onClick={updateCheckbox("vegetarian")} />}
			label={"Végétarien"} />
		<FormControlLabel
			control={<Checkbox sx={{ pl: 0 }} checked={data.xl} onClick={updateCheckbox("xl")} />}
			label={"XL"} />
		<TextField label={"Commentaire"} variant={"standard"} defaultValue={data.comment}
				   onChange={onCommentChange} />
	</>;

}