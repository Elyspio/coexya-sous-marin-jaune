import * as React from "react";
import { Box, Stack } from "@mui/material";

type Props = {
	label: React.ReactNode;
	children: React.ReactNode;
	/** Pile verticalement (label au-dessus de la valeur) au lieu d'une rangée. */
	stacked?: boolean;
	align?: "center" | "flex-start";
};

/** Ligne d'option encadrée (frites, boisson, dessert, étudiant…). */
export function OptRow({ label, children, stacked, align = "center" }: Props) {
	return (
		<Box
			sx={(t) => ({
				display: "flex",
				flexDirection: stacked ? "column" : "row",
				alignItems: stacked ? "stretch" : align,
				gap: 1.5,
				p: "12px 14px",
				border: `1px solid ${t.palette.custom.line}`,
				borderRadius: "8px",
				backgroundColor: t.palette.custom.paper,
			})}
		>
			<Box sx={{ fontWeight: 500, minWidth: stacked ? "auto" : 80 }}>{label}</Box>
			<Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ flex: 1, gap: 0.75 }}>
				{children}
			</Stack>
		</Box>
	);
}
