import { Burger } from "../../../core/apis/backend/generated";
import React from "react";
import { Divider, Paper, Stack, Typography } from "@mui/material";

type BurgerProps = { data: Burger };


export function BurgerItem({ data }: BurgerProps) {
	return <Paper>
		<Stack p={2} spacing={1} alignItems={"center"} minWidth={200}>
			<Typography variant={"overline"} fontWeight={"bold"}>{data.name}</Typography>
			<Divider variant={"fullWidth"} sx={{ width: "100%" }}></Divider>
			<Stack spacing={1} width={"100%"}>
				{data.ingredients.map(i => <Typography variant={"subtitle1"} key={i}>{i}</Typography>)}
			</Stack>
		</Stack>
	</Paper>;
}