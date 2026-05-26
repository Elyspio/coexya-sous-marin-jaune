import * as React from "react";
import { Box, Typography } from "@mui/material";
import { Burger } from "@apis/rest/api/generated";
import { useOrderEditing } from "@/core/data/orders/orders.editing";

export function BurgerItem({ data }: { data: Burger }) {
	const { setOrderRecordBurger } = useOrderEditing();

	const onClick = React.useCallback(() => setOrderRecordBurger(data.name), [data.name, setOrderRecordBurger]);

	return (
		<Box
			onClick={onClick}
			data-testid={`burger-card-${data.name}`}
			sx={(t) => ({
				border: `1px solid ${t.palette.custom.line}`,
				backgroundColor: t.palette.custom.paper,
				borderRadius: "12px",
				p: 2,
				cursor: "pointer",
				transition: "border-color 120ms ease, transform 60ms ease",
				"&:hover": { borderColor: t.palette.custom.ink },
				"&:active": { transform: "translateY(1px)" },
			})}
		>
			<Typography sx={{ fontWeight: 600, fontSize: 16, letterSpacing: "-0.015em", mb: 0.75 }}>{data.name}</Typography>
			<Typography sx={{ fontSize: 12, color: "custom.ink3", lineHeight: 1.5 }}>{data.ingredients.join(" · ")}</Typography>
		</Box>
	);
}
