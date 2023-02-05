import React, { useCallback, useMemo } from "react";
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store";
import { updateConfig } from "../../../store/module/config/config.async.action";
import { Config } from "../../../core/apis/backend/generated";
import { setConfig } from "../../../store/module/config/config.actions";
import { Transition } from "./common/Transition";
import { ModalComponentProps } from "./common/ModalProps";
import { useMounted } from "../../hooks/useMounted";

export function UpdateConfig({ setClose, open }: ModalComponentProps) {
	const { allUsers, config } = useAppSelector(s => ({ allUsers: s.orders.all, config: s.config }));
	const dispatch = useAppDispatch();

	const users = useMemo(() => [...new Set(Object.values(allUsers).map(order => order.user))].sort((o1, o2) => o1.localeCompare(o2)), [allUsers]);

	const updateRemote = useCallback(() => {
		dispatch(updateConfig());
		setClose();
	}, [dispatch, setClose, config]);

	const onFieldChanged = useCallback(
		(field: keyof Config) => (e: React.ChangeEvent<HTMLInputElement>) => {
			dispatch(
				setConfig({
					...config,
					[field]: e.target.checked,
				})
			);
		},
		[dispatch, config]
	);

	const onCarrierChanged = useCallback(
		(_, carrier: string | null) => {
			dispatch(
				setConfig({
					...config,
					carrier: carrier ?? undefined,
				})
			);
		},
		[dispatch, config]
	);

	const [mounted, ref] = useMounted();

	if (!mounted && !open) return null;

	return (
		<Dialog open={open} ref={ref} onClose={setClose} TransitionComponent={Transition}>
			<DialogTitle>Modifier la configuration</DialogTitle>
			<DialogContent dividers>
				<Stack p={2} spacing={3} minWidth={400}>
					<Autocomplete
						onChange={onCarrierChanged}
						options={users}
						value={config.carrier}
						freeSolo
						renderInput={params => <TextField helperText={"La personne qui va aller chercher la commande"} {...params} label={"Livreur"} />}
					/>
					<FormControlLabel label="Restaurant ouvert" control={<Checkbox checked={config.kitchenOpened} onChange={onFieldChanged("kitchenOpened")} />} />
					<FormControlLabel label="Système de payement" control={<Checkbox checked={config.paymentEnabled} onChange={onFieldChanged("paymentEnabled")} />} />
				</Stack>
			</DialogContent>
			<DialogActions>
				<Box p={1}>
					<Button variant={"outlined"} color={"success"} onClick={updateRemote}>
						Valider
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
}
