import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fade,
	FormControlLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { toggleModal } from "../../../../store/module/workflow/workflow.action";
import { isToday } from "../../../../store/module/orders/orders.utils";
import { BurgerRecord, Drink, Fries } from "../../../../core/apis/backend/generated";
import { toast } from "react-toastify";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";


export const drinkLabels: Record<Drink, string> = {
	Coca: "Coca",
	IceTea: "Ice Tea",
	CocaZero: "Coca Zéro",
	Limonade: "Limonade",
};


let pad = number => number < 10 ? `0${number}` : number;


const times: string[] = [];

let t = 11.75 * 3600;

while (t < 14 * 3600 + 5) {
	const h = Math.floor(t / 3600);
	const mn = (t % 3600) / 60;
	times.push(`${h}h${pad(mn % 60)}`);
	t += 5 * 60;
}


export function OrderMessageModal() {


	const { orders, open } = useAppSelector(s => ({
		orders: s.orders.all,
		open: s.workflow.modals.message,

	}));


	const [header, setHeader] = useState(true);

	const toggleHeader = React.useCallback(() => setHeader(old => !old), []);

	const [time, setTime] = React.useState("12h15");

	const onTimeChange = React.useCallback((e: SelectChangeEvent<string>) => setTime(e.target.value), []);

	// region message

	const todayOrders = React.useMemo(() => Object.values(orders).filter(order => isToday(order)), [orders]);


	const dispatch = useAppDispatch();

	const close = React.useCallback(() => dispatch(toggleModal("message")), [dispatch]);


	const getFriteLabel = React.useCallback((frites: Fries | undefined) => frites ? `Frites${frites.sauces.length ? ` (${frites.sauces.join(", ")})` : ""}` : "", []);


	const getBurgerLabel = React.useCallback((burgers: BurgerRecord[]) => {
		let str = "";
		for (let burger of burgers) {
			str += burger.name;
			if (burger.vegetarian) str += " végétarien";
			if (burger.xl) str += " XL";
			if (burger.excluded.length) {
				str += ` sans ${burger.excluded}`;
			}
			if (burger.comment) str += ` (${burger.comment})`;
			str += ", ";
		}
		return str;

	}, []);

	// endregion message


	const textRef = useRef<HTMLElement>(null);


	const copy = React.useCallback(async () => {
		if (textRef.current) {
			await navigator.clipboard.writeText(textRef.current.innerText);
			toast.success("Texte copié dans le presse papier");
			close();
		}
	}, [textRef.current, close]);


	return <Dialog open={open} onClose={close}>
		<DialogTitle>Message à envoyer</DialogTitle>
		<DialogContent dividers>

			<Stack spacing={3}>

				<Stack direction={"row"} spacing={1}>
					<FormControlLabel
						control={<Checkbox sx={{ mr: 1,  }} checked={header} onChange={toggleHeader} />}
						label={"Entête"}
					/>


					<Fade in={header}>
						<Select value={time} onChange={onTimeChange}>
							{times.map(time => <MenuItem value={time} key={time}>{time}</MenuItem>)}
						</Select>
					</Fade>
				</Stack>


				<Stack spacing={2} ref={textRef}>
					<Fade in={header}>
						<Typography>Bonjour, J'aimerai commander
							pour {todayOrders.length} personnne{todayOrders.length > 1 ? "s" : ""} pour {time} :</Typography>
					</Fade>
					<List>
						{todayOrders.map(order => <ListItem key={order.id}>
							<Typography>
								{order.user} {order.student ? "étudiant" : ""} {getBurgerLabel(order.burgers)} {getFriteLabel(order.fries)}, {order.drink ? drinkLabels[order.drink] : ""}
							</Typography>
						</ListItem>)}
					</List>
					<Fade in={header}>
						<Typography>Nous viendrons récupérer la commande sur place à Limonest. Si ça fait trop juste
							pour {time}, pour quelle heure ça serait ? Merci </Typography>
					</Fade>

				</Stack>
			</Stack>


		</DialogContent>

		<DialogActions>
			<Button color={"primary"} onClick={copy} variant={"outlined"}>Copier</Button>
		</DialogActions>
	</Dialog>;
}



