import React from "react";
import {
	Box,
	Button,
	ButtonGroup,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store";
import { OrderFries } from "../burgers/Record/OrderFries";
import { OrderDrink } from "../burgers/Record/OrderDrink";
import { OrderDessert } from "../burgers/Record/OrderDessert";
import {
	addOrderRecord,
	deleteOrderRecord,
	setAlteringOrder,
	setAlteringRecord,
} from "../../../store/module/orders/orders.action";
import { BurgerRecord } from "../../../core/apis/backend/generated";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { EditBurgerRecord } from "../burgers/Record/EditBurgerRecord";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteOrder, updateRemoteOrder } from "../../../store/module/orders/orders.async.action";
import { isToday } from "./UserOrders";
import { OrderStudent } from "../burgers/Record/OrderStudent";

export function EditOrder() {

	const { order, recordIndex } = useAppSelector(state => {
		let orderId = state.orders.altering?.order;
		return ({
			order: state.orders.all[orderId!],
			recordIndex: state.orders.altering?.record,
		});
	});

	const dispatch = useAppDispatch();

	const addRecord = React.useCallback(() => {
		dispatch(addOrderRecord());
	}, [order?.id]);

	const close = React.useCallback(() => dispatch(setAlteringOrder()), []);

	const deleteOrderFn = React.useCallback(() => {
		dispatch(deleteOrder(order.id));
		close();
	}, [order, close]);

	const updateOrderFn = React.useCallback(() => {
		dispatch(updateRemoteOrder());
		close();
	}, [dispatch, close]);

	if (!order) return null;

	return <Dialog open={Boolean(order)} onClose={close}>
		<DialogTitle>{isToday(order) ? "Création" : "Modification"} de votre commande</DialogTitle>
		<DialogContent dividers>

			{<Stack spacing={2} p={3} minWidth={350}>
				<Box>
					<Stack direction={"row"} spacing={3}>
						<Typography variant={"overline"}>Burgers </Typography>
						<IconButton size={"small"} sx={{ p: 0 }} onClick={addRecord}>
							<AddCircleOutlineIcon sx={{ width: 30, height: 30 }}
												  color={"secondary"} />
						</IconButton>
					</Stack>
					{order.burgers.length > 0 &&
						<Box bgcolor={"background.default"} pl={2}>
							<Stack p={1} m={1} spacing={1}>
								{order.burgers.map((burger, i) => <BurgerItem data={burger} key={i} index={i} />)}
							</Stack>
						</Box>}

				</Box>

				<Typography variant={"overline"}>Menu </Typography>

				<OrderStudent data={order} />
				<OrderFries data={order} />
				<OrderDrink data={order} />
				<OrderDessert data={order} />

			</Stack>}

			{recordIndex !== undefined && <EditBurgerRecord />}


		</DialogContent>
		<DialogActions>
			<Button color={"inherit"} onClick={deleteOrderFn}>Annuler</Button>
			<Button color={"success"} variant={"text"} onClick={updateOrderFn}
					disabled={order?.burgers?.length === 0}>Valider</Button>
		</DialogActions>
	</Dialog>;
}


function BurgerItem({ data, index }: { data: BurgerRecord, index: number }) {

	const dispatch = useAppDispatch();

	const edit = React.useCallback(() => {
		dispatch(setAlteringRecord(index));
	}, [data]);

	const del = React.useCallback(() => {
		dispatch(deleteOrderRecord(index));
	}, [data]);


	const exclusion = React.useMemo(() => <>(sans {data.excluded.join(", ")})</>, [data.excluded]);
	return <Stack direction={"row"} spacing={2} justifyContent={"flex-start"} alignItems={"center"} width={"100%"}>
		<Tooltip title={data.name}>
			<Typography noWrap title={data.name}>
				{data.name}
			</Typography>
		</Tooltip>


		{data.excluded.length > 0 && <Tooltip title={exclusion}>
			<Typography noWrap>
				{exclusion}
			</Typography>
		</Tooltip>}
		<Box sx={{ marginLeft: "auto !important", pl: 2 }}>
			<ButtonGroup variant="outlined">
				<IconButton onClick={edit}>
					<EditIcon color={"primary"} />
				</IconButton>
				<IconButton onClick={del}>
					<DeleteIcon color={"error"} />
				</IconButton>
			</ButtonGroup>
		</Box>

	</Stack>;
}