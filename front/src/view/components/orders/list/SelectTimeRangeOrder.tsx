import React from "react";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { OrderTime } from "@modules/orders/orders.reducer";
import { useAppDispatch, useAppSelector } from "@store";
import { setOrderTimeRange } from "@modules/orders/orders.action";

export function SelectTimeRangeOrder() {
	const { timeRange } = useAppSelector((s) => ({
		timeRange: s.orders.timeRange,
	}));

	const dispatch = useAppDispatch();

	const onTimeRangeChange = React.useCallback((e: SelectChangeEvent<OrderTime>) => dispatch(setOrderTimeRange(e.target.value as OrderTime)), [dispatch]);

	return (
		<FormControl sx={{ maxWidth: 120 }} fullWidth>
			<Select value={timeRange} onChange={onTimeRangeChange} label={"Depuis"} variant={"standard"}>
				{Object.values(OrderTime).map((time) => (
					<MenuItem key={time} value={time}>
						{time}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
