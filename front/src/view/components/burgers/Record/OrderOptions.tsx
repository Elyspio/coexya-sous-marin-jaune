import { BurgerRecord } from "@apis/backend/generated";
import { useAppDispatch } from "@store";
import React from "react";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { debounce } from "@mui/material/utils";
import { updateBurgerRecord } from "@modules/orders/orders.action";

export function OrderOptions({ data }: { data: BurgerRecord }) {
	const dispatch = useAppDispatch();

	const setComment = React.useMemo(
		() =>
			debounce((txt: string) => {
				dispatch(
					updateBurgerRecord({
						...data,
						comment: txt,
					})
				);
			}, 100),
		[data, dispatch]
	);

	const onCommentChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setComment(e.target.value);
		},
		[setComment]
	);

	const updateCheckbox = React.useCallback(
		(key: keyof Pick<BurgerRecord, "xl" | "vegetarian">) => () => {
			dispatch(
				updateBurgerRecord({
					...data,
					[key]: !data[key],
				})
			);
		},
		[data, dispatch]
	);

	return (
		<>
			<FormControlLabel control={<Checkbox checked={data.vegetarian} onClick={updateCheckbox("vegetarian")} />} label={"Végétarien"} />
			<FormControlLabel control={<Checkbox sx={{ pl: 0 }} checked={data.xl} onClick={updateCheckbox("xl")} />} label={"XL"} />
			<TextField label={"Commentaire"} variant={"standard"} defaultValue={data.comment} onChange={onCommentChange} />
		</>
	);
}
