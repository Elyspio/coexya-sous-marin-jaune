import { BurgerRecord, Order, OrderPaymentType } from "@apis/backend/generated";
import { useAppDispatch, useAppSelector } from "@store";
import React, { useMemo } from "react";
import { setAlteringOrder } from "@modules/orders/orders.action";
import { duplicateOrder } from "@modules/orders/orders.async.action";
import { Chip, IconButton, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { isToday } from "@modules/orders/orders.utils";
import { Euro } from "@mui/icons-material";
import { useIsSmallScreen } from "@hooks/utils/useBreakpoint";
import { toggleModalWithOptionsFn } from "@modules/workflow/workflow.action";
import { useRole } from "@hooks/permissions/useRole";
import { SousMarinJauneRole } from "@apis/authentication/generated";
import { useCanCreateOrder } from "@hooks/orders/useCanCreateOrder";

type OrderItemProps = {
	data: Order;
	show: {
		name?: boolean;
		date?: boolean;
		edit?: boolean;
		del?: boolean;
		duplicate?: boolean;
	};
};

export function OrderItem({ data, show }: OrderItemProps) {
	const { user } = useAppSelector((s) => ({
		user: s.orders.name,
	}));

	const isAdmin = useRole(SousMarinJauneRole.Admin);

	const canCreate = useCanCreateOrder();

	const dispatch = useAppDispatch();

	const edit = React.useCallback(() => {
		dispatch(setAlteringOrder(data.id));
	}, [data.id, dispatch]);

	const del = React.useCallback(() => {
		dispatch(toggleModalWithOptionsFn("deleteOrder", { orderId: data.id }));
	}, [data.id, dispatch]);

	const duplicate = React.useCallback(() => {
		dispatch(duplicateOrder(data.id));
	}, [data.id, dispatch]);

	const fritesElem = React.useMemo(() => {
		if (!data.fries) return null;
		const sauces = data.fries.sauces
			.filter((sq) => sq.amount)
			.map((sq) => sq.sauce + (sq.amount > 1 ? ` x${sq.amount}` : ""))
			.join(", ");
		return <Typography>Frites {sauces.length ? `(${sauces})` : ""}</Typography>;
	}, [data.fries]);

	const { palette } = useTheme();

	const isSelf = useMemo(() => data.user === user, [data.user, user]);

	const isSmall = useIsSmallScreen();

	const walletAmount = useMemo(() => data.payments.find((p) => p.type === OrderPaymentType.Wallet)?.amount ?? 0, [data]);

	const isWaitingPaymentValidation = useMemo(() => {
		if (!data.paymentEnabled) return false;

		const received = data.payments.reduce((acc, current) => acc + (current.received ?? 0), 0);
		return received < data.price - walletAmount;
	}, [data.paymentEnabled, data.payments, data.price, walletAmount]);

	const isMissingPayment = useMemo(() => {
		if (!data.paymentEnabled) return false;

		const payments = data.payments.reduce((acc, current) => acc + current.amount, 0);
		return payments < data.price - walletAmount;
	}, [data, walletAmount]);

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
					{data.burgers.map((burger, i) => (
						<BurgerItem key={burger.name + "-" + i} data={burger} />
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

			{data.student && <Typography>Étudiant</Typography>}

			<Stack alignItems={"center"} direction={"row"} spacing={0.5}>
				{((isToday(data) && isSelf) || isAdmin) && (
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
