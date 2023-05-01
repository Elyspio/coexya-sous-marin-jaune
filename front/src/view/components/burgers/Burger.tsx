import { Burger } from "@apis/backend/generated";
import React from "react";
import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch } from "@store";
import { setOrderRecordBurger } from "@modules/orders/orders.action";

type BurgerProps = { data: Burger };

export function BurgerItem({ data }: BurgerProps) {
	const { palette } = useTheme();

	const dispatch = useAppDispatch();

	const onClick = React.useCallback(() => {
		dispatch(setOrderRecordBurger(data.name));
	}, [data.name, dispatch]);

	return (
		<Button onClick={onClick}>
			<Paper sx={{ width: "100%", height: "100%" }}>
				<Stack p={2} spacing={1} alignItems={"center"} minWidth={200}>
					<Typography variant={"overline"} fontSize={"100%"} fontWeight={"bold"}>
						{data.name}
					</Typography>
					<Divider variant={"fullWidth"} color={palette.primary.main} sx={{ width: "100%" }}></Divider>
					<Stack spacing={1} width={"100%"}>
						{data.ingredients.map((i) => (
							<Typography variant={"subtitle1"} key={i}>
								{i}
							</Typography>
						))}
					</Stack>
				</Stack>
			</Paper>
		</Button>
	);
}
