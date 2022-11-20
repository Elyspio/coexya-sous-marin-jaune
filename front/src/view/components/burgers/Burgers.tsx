import { Box } from "@mui/material";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { BurgerItem } from "./Burger";
import { getBurgers } from "../../../store/module/burgers/burgers.async.action";
import { EditBurgerRecord } from "./Record/EditBurgerRecord";


export const Burgers = () => {

	const { burgers, altering } = useAppSelector(state => ({
		altering: state.orders.altering,
		burgers: state.burgers.all,
	}));

	const dispatch = useAppDispatch();

	React.useEffect(() => {
		dispatch(getBurgers());
	}, [dispatch]);

	return (
		<Box id={"Burgers"}>
			<Box display={"flex"} justifyContent={"center"} flexWrap={"wrap"}>
				{burgers.map(burger => <BurgerItem key={burger.name} data={burger} />)}
			</Box>
			{altering?.record && <EditBurgerRecord />}
		</Box>
	);
};

