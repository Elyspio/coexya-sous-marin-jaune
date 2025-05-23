import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fade,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Typography,
} from "@mui/material";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@store";
import { BurgerRecord, Drink, Fries } from "@apis/backend/generated";
import { toast } from "react-toastify";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import dayjs from "dayjs";
import { Transition } from "./common/Transition";
import { ModalComponentProps } from "./common/ModalProps";
import { useMounted } from "@hooks/utils/useMounted";
import { useOrderDates } from "@hooks/orders/useOrderDates";

export const drinkLabels: Record<Drink, string> = {
	Coca: "Coca",
	IceTea: "Ice Tea",
	CocaZero: "Coca Zéro",
	Limonade: "Limonade",
};

const pad = (number: number) => (number < 10 ? `0${number}` : number);

const times: string[] = [];

let t = 11.75 * 3600;

while (t < 14 * 3600 + 5) {
	const h = Math.floor(t / 3600);
	const mn = (t % 3600) / 60;
	times.push(`${h}h${pad(mn % 60)}`);
	t += 5 * 60;
}

export function OrderMessageModal({ open, setClose }: ModalComponentProps) {
	const { orders } = useAppSelector((s) => ({
		orders: s.orders.all,
	}));

	const [header, setHeader] = useState(true);

	const toggleHeader = useCallback(() => setHeader((old) => !old), []);

	const [time, setTime] = useState("12h15");

	const availableDates = useOrderDates();

	const [selectedDay, setSelectedDay] = useState(availableDates[0]);

	const onTimeChange = useCallback((e: SelectChangeEvent) => setTime(e.target.value), []);

	const onSelectedDateChanged = useCallback((e: SelectChangeEvent) => setSelectedDay(dayjs(e.target.value)), []);

	// region message

	const todayOrders = useMemo(() => Object.values(orders).filter((order) => selectedDay.isSame(order.date, "day")), [orders, selectedDay]);

	const getFriteLabel = useCallback((frites: Fries | undefined) => {
		if (!frites) return "";
		const sauces = frites?.sauces
			.filter((sq) => sq.amount)
			.map((sq) => sq.sauce + (sq.amount > 1 ? ` x${sq.amount}` : ""))
			.join(", ");

		return `Frites ${sauces ? `(${sauces})` : ""}`;
	}, []);

	const getBurgerLabel = useCallback((burgers: BurgerRecord[]) => {
		let str = "";
		for (const burger of burgers) {
			str += burger.name;
			if (burger.vegetarian) str += " végétarien";
			if (burger.xl) str += " XL";
			if (burger.excluded.length) {
				str += ` sans ${burger.excluded}`;
			}
			if (burger.comment) str += ` (${burger.comment})`;
			str += ", ";
		}
		if (str.endsWith(", ")) str = str.slice(0, str.length - 2);

		return str;
	}, []);

	// endregion message

	const textRef = useRef<HTMLDivElement>(null);

	const copy = React.useCallback(async () => {
		if (textRef.current) {
			await navigator.clipboard.writeText(textRef.current.innerText);
			toast.success("Texte copié dans le presse papier");
			setClose();
		}
	}, [setClose]);

	const [mounted, ref] = useMounted();

	if (!mounted && !open) return null;

	const totalPrice = todayOrders.reduce((acc, order) => {
		return acc + order.price;
	}, 0);
	return (
		<Dialog open={open} ref={ref} onClose={setClose} TransitionComponent={Transition}>
			<DialogTitle>
				<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
					<Typography>Message à envoyer</Typography>

					<FormControl>
						<InputLabel id="select-date-label">Date</InputLabel>
						<Select labelId="select-date-label" id="select-date" value={selectedDay.toISOString()} label={"Date"} onChange={onSelectedDateChanged}>
							{availableDates.map((time) => (
								<MenuItem value={time.toISOString()} key={time.toISOString()}>
									{time.format("DD/MM/YYYY")}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
			</DialogTitle>
			<DialogContent dividers>
				<Stack spacing={3}>
					<Stack direction={"row"} spacing={1}>
						<FormControlLabel control={<Checkbox sx={{ mr: 1 }} checked={header} onChange={toggleHeader} />} label={"Entête"} />

						<Fade in={header}>
							<Select value={time} onChange={onTimeChange}>
								{times.map((time) => (
									<MenuItem value={time} key={time}>
										{time}
									</MenuItem>
								))}
							</Select>
						</Fade>
					</Stack>

					<Stack spacing={2} ref={textRef}>
						<Fade in={header}>
							<Typography>
								Bonjour, J'aimerai commander pour {todayOrders.length} personnne{todayOrders.length > 1 ? "s" : ""} pour {time} :
							</Typography>
						</Fade>
						<List>
							{todayOrders.map((order) => (
								<ListItem key={order.id}>
									<Typography>
										<span style={{ fontWeight: "bold" }}>{order.user}</span> : {order.student ? "étudiant" : ""} {getBurgerLabel(order.burgers)}{" "}
										{getFriteLabel(order.fries)}
										{order.drink ? `, ${drinkLabels[order.drink]}` : ""} {order.dessert} ({order.price}€)
									</Typography>
								</ListItem>
							))}
						</List>
						<Fade in={header}>
							<Stack spacing={1}>
								<Typography>
									Nous viendrons récupérer la commande sur place à Limonest. Si ça fait trop juste pour {time}, pour quelle heure ça serait ? Merci
								</Typography>
								<Typography>Le total semble être de {totalPrice}€</Typography>
							</Stack>
						</Fade>
					</Stack>
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button color={"primary"} onClick={copy} variant={"outlined"}>
					Copier
				</Button>
			</DialogActions>
		</Dialog>
	);
}
