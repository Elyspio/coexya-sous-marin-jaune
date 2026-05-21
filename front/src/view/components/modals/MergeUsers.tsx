import React, { useCallback, useMemo, useState } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { Transition } from "./common/Transition";
import { ModalComponentProps } from "./common/ModalProps";
import { useMounted } from "@hooks/utils/useMounted";
import { useOrders } from "@/core/data/orders/orders.queries";
import { useMergeUsers } from "@/core/data/users/users.mutations";

export function MergeUsers({ setClose, open }: ModalComponentProps) {
	const orders = useOrders();
	const merge = useMergeUsers();
	const users = useMemo(() => [...new Set(orders.map((order) => order.user))].sort((a, b) => a.localeCompare(b)), [orders]);

	const [nextName, setNextName] = useState(users[0] ?? "");
	const [usersToMerge, setUsersToMerge] = useState<string[]>([]);

	const onNextNameChange = useCallback((_: React.SyntheticEvent, name: string | null) => {
		setNextName(name ?? "");
	}, []);

	const onSelectedUserChange = useCallback(
		(_: React.SyntheticEvent, names: string[]) => {
			setUsersToMerge([...names]);
			if (!nextName) setNextName(names[0]);
		},
		[nextName],
	);

	const onMerge = useCallback(() => {
		merge.mutate({ nextName, users: usersToMerge });
		setClose();
	}, [merge, nextName, usersToMerge, setClose]);

	const [mounted, ref] = useMounted();

	if (!mounted && !open) return null;

	return (
		<Dialog open={open} ref={ref} onClose={setClose} TransitionComponent={Transition}>
			<DialogTitle>Merge Users</DialogTitle>
			<DialogContent dividers>
				<Stack p={2} spacing={3} minWidth={400}>
					<Autocomplete
						onChange={onNextNameChange}
						options={users}
						freeSolo
						renderInput={(params) => <TextField helperText={"Le nom de l'utilisateur après le merge"} {...params} label={"Prochain nom"} />}
					/>

					<Autocomplete
						onChange={onSelectedUserChange}
						multiple
						options={users}
						renderInput={(params) => <TextField helperText={"Users to merge"} {...params} label={"Utilisateur à unir"} />}
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Box p={1}>
					<Button variant={"outlined"} color={"success"} onClick={onMerge}>
						Merge
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
}
