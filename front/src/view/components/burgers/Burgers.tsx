import * as React from "react";
import { Box } from "@mui/material";
import { BurgerItem } from "./Burger";
import { useBurgers } from "@/core/data/burgers/burgers.queries";

export const Burgers = () => {
	const burgers = useBurgers();

	return (
		<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
			{burgers.map((burger) => (
				<BurgerItem key={burger.name} data={burger} />
			))}
		</Box>
	);
};
