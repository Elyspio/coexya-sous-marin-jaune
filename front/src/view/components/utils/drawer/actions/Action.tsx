import React, { ReactNode } from "react";
import { Divider, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type ActionComponentProps = {
	icon: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
	onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
	divider?: string;
};

export const ActionComponent = ({ children, icon, onClick, className, divider }: ActionComponentProps) => {
	const {
		palette: { primary },
	} = useTheme();

	return !divider ? (
		<Stack className={`Action ${className ?? ""}`} onClick={onClick} direction={"row"} alignItems={"center"}>
			<div className={"icon"}>
				<IconButton size="medium">{icon}</IconButton>
			</div>
			<div className={"description"}>{children}</div>
		</Stack>
	) : (
		<Stack direction={"row"} width={"100%"} alignItems={"center"} pt={1}>
			<Divider sx={{ flex: 1 }} color={primary.main}></Divider>
			<Typography variant={"overline"} fontSize={14} textAlign={"center"} sx={{ flex: 1 }}>
				{divider}
			</Typography>
			<Divider sx={{ flex: 1 }} color={primary.main}></Divider>
		</Stack>
	);
};

export type ActionDescriptionProps = { children: ReactNode };
export const ActionDescription = (props: ActionDescriptionProps) => <Typography className={"MuiButton-label ActionDescription"}>{props.children}</Typography>;
