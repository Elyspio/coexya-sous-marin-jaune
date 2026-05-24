import * as React from "react";
import MuiAvatar from "@mui/material/Avatar";
import { avatarColor, initialsOf } from "@/core/utils/avatar";

type Size = "sm" | "md" | "lg";

const dims: Record<Size, { size: number; font: number }> = {
	sm: { size: 22, font: 10 },
	md: { size: 28, font: 11 },
	lg: { size: 36, font: 13 },
};

export function Avatar({ name, size = "md" }: { name: string; size?: Size }) {
	const d = dims[size];
	const label = name?.trim() || "??";
	return (
		<MuiAvatar
			sx={{
				width: d.size,
				height: d.size,
				fontSize: d.font,
				fontWeight: 600,
				letterSpacing: "0.01em",
				bgcolor: avatarColor(label),
				color: "#fff",
			}}
		>
			{initialsOf(label)}
		</MuiAvatar>
	);
}
