import * as React from "react";
import ButtonBase from "@mui/material/ButtonBase";

type Props = {
	selected: boolean;
	onClick: () => void;
	disabled?: boolean;
	children: React.ReactNode;
};

/** Bouton-puce sélectionnable (boissons, desserts, « changer » de burger). */
export function ChipToggle({ selected, onClick, disabled, children }: Props) {
	return (
		<ButtonBase
			disabled={disabled}
			onClick={onClick}
			sx={(theme) => ({
				border: `1px solid ${selected ? theme.palette.custom.ink : theme.palette.custom.line}`,
				backgroundColor: selected ? theme.palette.custom.ink : theme.palette.custom.paper,
				color: selected ? theme.palette.custom.paper : theme.palette.custom.ink2,
				fontSize: 13,
				fontWeight: 500,
				padding: "6px 12px",
				borderRadius: 999,
				lineHeight: 1.2,
				transition: "all 120ms ease",
				"&:hover": selected ? {} : { borderColor: theme.palette.custom.ink3, color: theme.palette.custom.ink },
				"&.Mui-disabled": { opacity: 0.4 },
			})}
		>
			{children}
		</ButtonBase>
	);
}
