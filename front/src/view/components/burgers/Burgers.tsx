import { Box } from "@mui/material";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { BurgerItem } from "./Burger";
import { getBurgers } from "../../../store/module/burgers/burgers.async.action";
import { EditBurgerRecord } from "./Edit/EditBurgerRecord";


export const Burgers = () => {

	const burgers = useAppSelector(state => state.burgers.all);

	const dispatch = useAppDispatch();

	React.useEffect(() => {
		dispatch(getBurgers() as any);
	}, [dispatch]);

	return (
		<Box id={"Burgers"}>
			<Box display={"flex"} justifyContent={"center"} flexWrap={"wrap"}>
				{burgers.map(burger => <BurgerItem key={burger.name} data={burger} />)}
			</Box>
			<EditBurgerRecord />
		</Box>
	);
};

