import { Box, Stack } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { useAppSelector } from "@store";
import { BurgerItem } from "./Burger";

export const Burgers = () => {
	const { burgers } = useAppSelector((state) => ({
		burgers: state.burgers.all,
	}));

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
