import React, { useCallback, useMemo, useState } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Stack, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store";
import { mergeUsers } from "../../../store/module/users/users.async.action";
import { TransitionProps } from "@mui/material/transitions";

export type ModalComponentProps = {
	setClose: () => void;
	open: boolean;
};

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="left" ref={ref} {...props} />;
});

export function Balances({ setClose, open }: ModalComponentProps) {
	const allUsers = useAppSelector(s => s.orders.all);
	const dispatch = useAppDispatch();
	const users = useMemo(() => [...new Set(Object.values(allUsers).map(order => order.user))].sort((o1, o2) => o1.localeCompare(o2)), [allUsers]);

	const [nextName, setNextName] = useState(users[0] ?? "");

	const [usersToMerge, setUsersToMerge] = useState<string[]>([]);

	const onNextNameChange = useCallback((_, name: string | null) => {
		setNextName(name ?? "");
	}, []);

	const onSelectedUserChange = useCallback(
		(_, names: string[]) => {
			setUsersToMerge([...names]);
			if (!nextName) {
				setNextName(names[0]);
			}
		},
		[nextName]
	);

	const merge = useCallback(() => {
		dispatch(mergeUsers({ nextName, users: usersToMerge }));
		setClose();
	}, [setClose, dispatch, nextName, usersToMerge]);

	return (
		<Dialog open={open} onClose={setClose} TransitionComponent={Transition}>
			<DialogTitle>Merge Users</DialogTitle>
			<DialogContent dividers>
				<Stack p={2} spacing={3} minWidth={400}>
					<Autocomplete
						onChange={onNextNameChange}
						options={users}
						freeSolo
						renderInput={params => <TextField helperText={"Le nom de l'utilisateur après le merge"} {...params} label={"Prochain nom"} />}
					/>

					<Autocomplete
						onChange={onSelectedUserChange}
						multiple
						options={users}
						renderInput={params => <TextField helperText={"Users to merge"} {...params} label={"Utilisateur à unir"} />}
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Box p={1}>
					<Button variant={"outlined"} color={"success"} onClick={merge}>
						Merge
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
}
