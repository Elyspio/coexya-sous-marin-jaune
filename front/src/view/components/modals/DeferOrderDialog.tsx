import { Box, Button, Dialog, DialogActions, DialogContent, Stack, Typography } from "@mui/material";
import AccessTime from "@mui/icons-material/AccessTime";
import EventAvailable from "@mui/icons-material/EventAvailable";
import dayjs from "dayjs";
import "dayjs/locale/fr";

type Props = {
	open: boolean;
	plannedDate: string | undefined;
	onCancel: () => void;
	onConfirm: () => void;
	pending?: boolean;
};

export function DeferOrderDialog({ open, plannedDate, onCancel, onConfirm, pending }: Props) {
	const date = plannedDate ? dayjs(plannedDate).locale("fr") : null;

	return (
		<Dialog
			open={open}
			onClose={pending ? undefined : onCancel}
			aria-labelledby="defer-dialog-title"
			PaperProps={{
				sx: (t) => ({
					borderRadius: 3,
					maxWidth: 460,
					border: `1px solid ${t.palette.custom.line}`,
					boxShadow: t.palette.custom.shadowLg,
					overflow: "hidden",
				}),
			}}
		>
			<Box
				sx={(t) => ({
					height: 6,
					background: `linear-gradient(90deg, ${t.palette.custom.warn} 0%, ${t.palette.custom.clay} 100%)`,
				})}
			/>

			<DialogContent sx={{ pt: 4, pb: 3, px: 4 }}>
				<Stack spacing={3} alignItems="flex-start">
					<Box
						sx={(t) => ({
							width: 48,
							height: 48,
							borderRadius: "50%",
							background: t.palette.custom.warnSoft,
							color: t.palette.custom.warn,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						})}
					>
						<AccessTime sx={{ fontSize: 26 }} />
					</Box>

					<Stack spacing={1.25}>
						<Typography variant="eyebrow" sx={(t) => ({ color: t.palette.custom.warn })}>
							Heure limite dépassée
						</Typography>
						<Typography id="defer-dialog-title" variant="h4" sx={{ lineHeight: 1.25 }}>
							Votre commande sera enregistrée pour&nbsp;jeudi prochain
						</Typography>
						<Typography variant="body1" sx={(t) => ({ color: t.palette.custom.ink3 })}>
							Les commandes ne sont plus prises pour aujourd'hui. Confirmez pour créer une commande qui partira avec la fournée suivante.
						</Typography>
					</Stack>

					{date && (
						<Box
							sx={(t) => ({
								alignSelf: "stretch",
								mt: 1,
								px: 2.5,
								py: 2,
								borderRadius: 2,
								background: t.palette.custom.paper2,
								border: `1px solid ${t.palette.custom.line}`,
								display: "flex",
								alignItems: "center",
								gap: 1.5,
							})}
						>
							<EventAvailable sx={(t) => ({ color: t.palette.custom.accent, fontSize: 22 })} />
							<Stack spacing={0.25}>
								<Typography variant="eyebrow">Date retenue</Typography>
								<Typography variant="h5" sx={{ textTransform: "capitalize" }}>
									{date.format("dddd D MMMM")}
								</Typography>
							</Stack>
						</Box>
					)}
				</Stack>
			</DialogContent>

			<DialogActions sx={(t) => ({ px: 4, pb: 3, pt: 1, gap: 1, borderTop: `1px solid ${t.palette.custom.lineSoft}` })}>
				<Button variant="soft" onClick={onCancel} disabled={pending}>
					Annuler
				</Button>
				<Button variant="accent" onClick={onConfirm} disabled={pending}>
					{pending ? "Création…" : "Créer pour jeudi"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
