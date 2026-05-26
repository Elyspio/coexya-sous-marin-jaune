import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, TextField } from "@mui/material";
import type { Config } from "@apis/rest/api/generated";
import { Transition } from "./common/Transition";
import { ModalComponentProps } from "./common/ModalProps";
import { useMounted } from "@hooks/utils/useMounted";
import { useOrders } from "@/core/data/orders/orders.queries";
import { useConfig } from "@/core/data/config/config.queries";
import { useUpdateConfig } from "@/core/data/config/config.mutations";

export function UpdateConfig({ setClose, open }: ModalComponentProps) {
	const orders = useOrders();
	const remoteConfig = useConfig();
	const { mutate: updateConfigMutate } = useUpdateConfig();

	const users = useMemo(() => [...new Set(orders.map((order) => order.user))].sort((a, b) => a.localeCompare(b)), [orders]);

	const [draft, setDraft] = useState<Config>(remoteConfig as Config);
	useEffect(() => {
		setDraft(remoteConfig as Config);
	}, [remoteConfig]);

	const updateRemote = useCallback(() => {
		updateConfigMutate(draft);
		setClose();
	}, [draft, updateConfigMutate, setClose]);

	const onFieldChanged = useCallback(
		(field: keyof Config) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setDraft((d) => ({ ...d, [field]: e.target.checked }));
		},
		[],
	);

	const onCarrierChanged = useCallback((_: React.SyntheticEvent, carrier: string | null) => {
		setDraft((d) => ({ ...d, carrier: carrier ?? undefined }));
	}, []);

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
						value={draft.carrier ?? null}
						freeSolo
						renderInput={(params) => <TextField helperText={"La personne qui va aller chercher la commande"} {...params} label={"Livreur"} />}
					/>
					<FormControlLabel label="Restaurant ouvert" control={<Checkbox checked={draft.kitchenOpened} onChange={onFieldChanged("kitchenOpened")} />} />
					<FormControlLabel label="Système de payement" control={<Checkbox checked={draft.paymentEnabled} onChange={onFieldChanged("paymentEnabled")} />} />
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
