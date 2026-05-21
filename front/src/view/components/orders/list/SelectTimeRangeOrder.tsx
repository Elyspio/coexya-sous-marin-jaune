import React from "react";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { OrderTime, useClientStore } from "@/core/store/clientStore";

export function SelectTimeRangeOrder() {
	const timeRange = useClientStore((s) => s.timeRange);
	const setTimeRange = useClientStore((s) => s.setTimeRange);

	const onTimeRangeChange = React.useCallback((e: SelectChangeEvent<OrderTime>) => setTimeRange(e.target.value as OrderTime), [setTimeRange]);

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
