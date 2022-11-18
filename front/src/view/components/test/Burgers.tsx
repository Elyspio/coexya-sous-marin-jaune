import { Container, Stack, Typography } from "@mui/material";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { BurgerItem } from "./Burger";
import { getBurgers } from "../../../store/module/burgers/burgers.actions";


export const Burgers = () => {

	const burgers = useAppSelector(state => state.burgers.all);

	const dispatch = useAppDispatch();

	React.useEffect(() => {
		dispatch(getBurgers() as any);
	}, [dispatch]);

	return (
		<Container id={"Burgers"}>
			<Stack alignItems={"center"} spacing={2}>
				<Typography variant={"overline"} fontSize={"large"}>Burgers</Typography>
				<Stack direction={"row"} spacing={3}>
					{burgers.map(burger => <BurgerItem data={burger} />)}
				</Stack>
			</Stack>
		</Container>
	);
};

