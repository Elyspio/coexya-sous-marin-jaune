import React, { ReactNode, useCallback, useMemo } from "react";
import TabPanel from "@mui/lab/TabPanel";
import { Divider, IconButton, Stack, TextField, Tooltip } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { OrderPaymentType } from "../../../../../core/apis/backend/generated";
import { useAppDispatch } from "../../../../../store";
import { updateRemoteOrder } from "../../../../../store/module/orders/orders.async.action";

type PanelProps = {
	type: OrderPaymentType;
	top: ReactNode;
	bottom?: ReactNode;
	value: number;
	setValue: (val: number) => void;

	maxValue?: number;
};

export function PaymentPanel({ type, top, bottom, value, setValue, maxValue }: PanelProps) {
	const dispatch = useAppDispatch();

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setValue(Number.parseFloat(e.target.value));
		},
		[setValue]
	);

	const updateRemote = useCallback(() => dispatch(updateRemoteOrder()), [dispatch]);

	const stopUse = useCallback(() => {
		setValue(0);
		updateRemote();
	}, [setValue, updateRemote]);

	let isUsed = useMemo(() => value === 0, [value]);
	return (
		<TabPanel value={type} sx={{ height: "100%" }}>
			<Stack width={"100%"} alignItems={"center"} height={"100%"}>
				{top}

				<Stack direction={"column"} spacing={3} pt={2} alignItems={"center"} mt={"auto"}>
					<Divider sx={{ border: "1 solid white", width: "100%" }} />
					{bottom}
					<Stack direction={"row"} spacing={1} alignItems={"center"} width={"100%"}>
						<TextField
							fullWidth
							inputProps={{ step: 0.1, min: 0, max: maxValue }}
							label={"Montant"}
							value={value}
							type={"number"}
							onBlur={updateRemote}
							onChange={handleChange}
						/>

						<div>
							<Tooltip title={isUsed ? "" : "Ne plus utiliser ce moyen de payement"}>
								<IconButton disabled={isUsed} size={"large"} onClick={stopUse}>
									<Clear color={isUsed ? "disabled" : "error"} />
								</IconButton>
							</Tooltip>
						</div>
					</Stack>
				</Stack>
			</Stack>
		</TabPanel>
	);
}
