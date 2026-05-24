import * as React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";

type Props = {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
};

/** Contrôle quantité «  –  n  +  » (sauces). */
export function QtyStepper({ value, onChange, min = 0, max = 9 }: Props) {
	return (
		<Box
			sx={(theme) => ({
				display: "inline-flex",
				alignItems: "center",
				border: `1px solid ${theme.palette.custom.line}`,
				borderRadius: 999,
				overflow: "hidden",
				backgroundColor: theme.palette.custom.paper,
			})}
		>
			<IconButton size="small" aria-label="moins" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} sx={{ borderRadius: 0, width: 28, height: 28 }}>
				<Remove fontSize="inherit" />
			</IconButton>
			<Typography variant="mono" sx={{ minWidth: 24, textAlign: "center", fontSize: 13 }}>
				{value}
			</Typography>
			<IconButton size="small" aria-label="plus" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} sx={{ borderRadius: 0, width: 28, height: 28 }}>
				<Add fontSize="inherit" />
			</IconButton>
		</Box>
	);
}
