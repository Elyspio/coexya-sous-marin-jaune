import { BurgerRecord, Order } from "../../../../core/apis/backend/generated";
import { useAppDispatch, useAppSelector } from "../../../../store";
import React, { useMemo } from "react";
import { setAlteringOrder } from "../../../../store/module/orders/orders.action";
import { deleteOrder, duplicateOrder } from "../../../../store/module/orders/orders.async.action";
import { Chip, IconButton, Skeleton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { canCreateSelector, isToday } from "../../../../store/module/orders/orders.utils";
import { Euro } from "@mui/icons-material";
import { useIsSmallScreen } from "../../../hooks/useBreakpoint";

type OrderItemProps = { data: Order; show: { name?: boolean; date?: boolean; edit?: boolean; del?: boolean; duplicate?: boolean } };

export function OrderItem({ data, show }: OrderItemProps) {
	const { canCreate, user, logged } = useAppSelector(s => {
		let name = s.orders.name;
		let userOrders = Object.values(s.orders.all).filter(order => order.user === name);
		return {
			canCreate: canCreateSelector(s) === true,
			user: name,
			logged: s.authentication.logged,
		};
	});

	const dispatch = useAppDispatch();

	const edit = React.useCallback(() => {
		dispatch(setAlteringOrder(data.id));
	}, [data]);

	const del = React.useCallback(() => {
		dispatch(deleteOrder(data.id));
	}, [data]);

	const duplicate = React.useCallback(() => {
		dispatch(duplicateOrder(data.id));
	}, [data]);

	const fritesElem = React.useMemo(() => {
		if (!data.fries) return null;
		let sauces = data.fries.sauces.join(", ");
		return <Typography>Frites {sauces.length ? `(${sauces})` : ""}</Typography>;
	}, [data.fries]);

	const { palette } = useTheme();

	let isSelf = data.user === user;

	const isSmall = useIsSmallScreen();

	const isWaitingPaymentValidation = useMemo(() => {
		if (!data || !data.paymentEnabled) return false;

		return data.payments.reduce((acc, current) => acc + (current.received ?? 0), 0) < data.price;
	}, [data]);

	const isMissingPayment = useMemo(() => {
		if (!data || !data.paymentEnabled) return false;
		return data.payments.reduce((acc, current) => acc + current.amount, 0) < data.price;
	}, [data]);

	return (
		<Stack direction={isSmall ? "column" : "row"} alignItems={"center"} spacing={2} position={"relative"} color={isSelf ? palette.secondary.main : "inherit"}>
			{show.date && <Typography>{dayjs(data.date).format("DD/MM/YYYY")}</Typography>}

			{show.name && (
				<Typography minWidth={80} color={isSmall ? "secondary" : "inherit"}>
					{data.user}
				</Typography>
			)}

			{data.burgers.length > 0 ? (
				<Stack direction={"row"} spacing={2}>
					{data.burgers.map(burger => (
						<BurgerItem key={burger.name} data={burger} />
					))}
				</Stack>
			) : (
				<Skeleton width={100} variant={"text"} />
			)}

			{(fritesElem || data.drink || data.dessert) && (
				<Stack direction={"row"} spacing={2}>
					{fritesElem}
					{data.drink && <Typography>{data.drink}</Typography>}
					{data.dessert && <Typography>{data.dessert}</Typography>}
				</Stack>
			)}

			{data.student && <Typography>??tudiant</Typography>}

			<Stack alignItems={"center"} direction={"row"} spacing={0.5}>
				{((isToday(data) && isSelf) || logged) && (
					<>
						<IconButton onClick={edit}>
							<EditIcon color={"primary"} fontSize={"small"} />
						</IconButton>
						<IconButton onClick={del}>
							<DeleteIcon color={"error"} fontSize={"small"} />
						</IconButton>
					</>
				)}

				{canCreate && (
					<Tooltip title={"Dupliquer la commande"}>
						<IconButton onClick={duplicate}>
							<ContentCopy color={"inherit"} fontSize={"small"} />
						</IconButton>
					</Tooltip>
				)}

				{isWaitingPaymentValidation && (
					<Tooltip title={"Payement en attente de validation"} arrow placement={isSmall ? "bottom" : "right"}>
						<Euro className={"blink"} color={"warning"} />
					</Tooltip>
				)}

				{isMissingPayment && (
					<Tooltip title={"Payement insuffisant"} arrow placement={isSmall ? "bottom" : "right"}>
						<Euro className={"blink"} color={"error"} />
					</Tooltip>
				)}
			</Stack>
		</Stack>
	);
}

function BurgerItem({ data }: { data: BurgerRecord }) {
	return (
		<Stack direction={"row"} spacing={1} alignItems={"center"}>
			<Typography>{data.name}</Typography>
			{data.xl && <Chip label={"XL"} size={"small"} variant={"outlined"} />}
		</Stack>
	);
}
