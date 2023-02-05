import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../../../store";
import { debounce, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { updatePaymentReceived } from "../../../../store/module/orders/orders.async.action";
import { payementTypeLabel } from "../../orders/detail/payment/PayementOrder";
import { PriceCheck } from "@mui/icons-material";
import { OrderPaymentType } from "../../../../core/apis/backend/generated";

type BalanceItemProps = {
	date: string;
	user: string;
	idOrder: string;
	type: OrderPaymentType;
	amount: number;
	received?: number | undefined;
};

export function BalanceItem(props: BalanceItemProps) {
	const [received, setReceived] = useState(props.received ?? 0);

	const dispatch = useAppDispatch();

	const updateRemote = useMemo(
		() =>
			debounce(
				(value: number) =>
					dispatch(
						updatePaymentReceived({
							idOrder: props.idOrder,
							type: props.type,
							value: value,
						})
					),
				500
			),
		[dispatch, props.idOrder, props.type]
	);

	const fullReceived = useCallback(() => {
		setReceived(props.amount);
		updateRemote(props.amount);
	}, [props.amount, updateRemote]);

	const onReceivedChanged = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			let value = Number.parseFloat(e.target.value);
			setReceived(value);
			updateRemote(value);
		},
		[updateRemote]
	);

	useEffect(() => setReceived(props.received ?? 0), [props.received]);

	return (
		<Stack direction={"row"} spacing={4} alignItems={"center"}>
			<Typography width={130} variant={"body1"}>
				{payementTypeLabel[props.type]}
			</Typography>
			<Tooltip title={"Montant prévu"}>
				<Typography variant={"body1"}>{props.amount}</Typography>
			</Tooltip>
			<Tooltip title={"Montant reçu"}>
				<TextField
					variant={"outlined"}
					size={"small"}
					inputProps={{
						min: 0,
					}}
					type={"number"}
					value={received}
					onChange={onReceivedChanged}
				/>
			</Tooltip>

			<Tooltip title={"La totalité du payement a été perçue"}>
				<IconButton onClick={fullReceived}>
					<PriceCheck color={"success"} />
				</IconButton>
			</Tooltip>
		</Stack>
	);
}
