import { Box, Stack } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { BurgerItem } from "./Burger";
import { useBurgers } from "@/core/data/burgers/burgers.queries";

export const Burgers = () => {
	const burgers = useBurgers();

	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Box id={"Burgers"}>
			<Stack direction={isSmall ? "column" : "row"} spacing={2} display={"flex"} justifyContent={"center"} flexWrap={"nowrap"}>
				{burgers.map((burger) => (
					<BurgerItem key={burger.name} data={burger} />
				))}
			</Stack>
		</Box>
	);
};
