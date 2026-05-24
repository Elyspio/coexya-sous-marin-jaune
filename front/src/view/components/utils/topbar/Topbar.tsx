import * as React from "react";
import { useMemo, useState } from "react";
import { Box, IconButton, Menu, MenuItem, Stack, Tooltip, Typography } from "@mui/material";
import { AccountBalance, DarkMode, LightMode, Login, Logout, Merge, Message, Settings } from "@mui/icons-material";
import { OrderTime, useClientStore } from "@/core/store/clientStore";
import { useAuth } from "@/core/data/auth/AuthContext";
import { useIsAdmin } from "@hooks/permissions/useIsAdmin";
import { useTime } from "@hooks/utils/useTime";
import { lastTime } from "@/core/data/orders/orders.utils";
import { BrandMark, PicsouMark } from "@components/ui/marks";
import { Avatar } from "@components/ui/Avatar";

const HISTORY_DEFAULT = OrderTime.months3;

function NavButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
	return (
		<Box
			component="button"
			onClick={onClick}
			sx={(theme) => ({
				appearance: "none",
				border: 0,
				background: active ? theme.palette.custom.paper : "transparent",
				boxShadow: active ? theme.palette.custom.shadowSm : "none",
				padding: "6px 14px",
				borderRadius: "7px",
				fontFamily: theme.typography.fontFamily,
				fontSize: 13,
				fontWeight: 500,
				color: active ? theme.palette.custom.ink : theme.palette.custom.ink2,
				cursor: "pointer",
				transition: "background 120ms ease, color 120ms ease",
				"&:hover": { color: theme.palette.custom.ink },
			})}
		>
			{children}
		</Box>
	);
}

const iconBtnSx = (color?: string) => (theme: import("@mui/material/styles").Theme) => ({
	width: 34,
	height: 34,
	borderRadius: "8px",
	border: `1px solid ${theme.palette.custom.line}`,
	color: color ?? theme.palette.custom.ink2,
	"&:hover": { backgroundColor: theme.palette.custom.paper2, color: color ?? theme.palette.custom.ink },
});

export function Topbar() {
	const theme = useClientStore((s) => s.theme);
	const toggleTheme = useClientStore((s) => s.toggleTheme);
	const toggleModal = useClientStore((s) => s.toggleModal);
	const timeRange = useClientStore((s) => s.timeRange);
	const setTimeRange = useClientStore((s) => s.setTimeRange);
	const orderName = useClientStore((s) => s.orderName);

	const { logged, login, logout } = useAuth();
	const isAdmin = useIsAdmin();
	const now = useTime();

	const isToday = timeRange === OrderTime.today;
	const tooLate = useMemo(() => now.isAfter(lastTime), [now]);
	const timeLeft = useMemo(() => lastTime.from(now, true), [now]);

	const [adminAnchor, setAdminAnchor] = useState<null | HTMLElement>(null);
	const closeAdmin = () => setAdminAnchor(null);
	const adminAction = (modal: "mergeUsers" | "balances" | "updateConfig") => () => {
		toggleModal(modal);
		closeAdmin();
	};

	return (
		<Box
			component="header"
			sx={(t) => ({
				display: "flex",
				alignItems: "center",
				gap: 3,
				px: 3.5,
				borderBottom: `1px solid ${t.palette.custom.line}`,
				backgroundColor: t.palette.custom.paper,
				position: "relative",
				zIndex: 30,
			})}
		>
			<Stack direction="row" alignItems="center" spacing={1.25} sx={{ flexShrink: 0 }}>
				<Box
					sx={(t) => ({
						width: 28,
						height: 28,
						borderRadius: "50%",
						backgroundColor: t.palette.custom.accent,
						color: "#fff",
						display: "grid",
						placeItems: "center",
					})}
				>
					<BrandMark size={16} />
				</Box>
				<Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>Sous-marin Jaune</Typography>
				<Typography variant="eyebrow" sx={{ fontSize: 10 }}>
					v2
				</Typography>
			</Stack>

			<Stack
				direction="row"
				spacing={0.25}
				sx={(t) => ({
					ml: 1.5,
					p: 0.5,
					borderRadius: "8px",
					backgroundColor: t.palette.custom.paper2,
					border: `1px solid ${t.palette.custom.line}`,
					display: { xs: "none", sm: "flex" },
				})}
			>
				<NavButton active={isToday} onClick={() => setTimeRange(OrderTime.today)}>
					Aujourd'hui
				</NavButton>
				<NavButton active={!isToday} onClick={() => setTimeRange(isToday ? HISTORY_DEFAULT : timeRange)}>
					Historique
				</NavButton>
				{isAdmin && (
					<NavButton active={false} onClick={() => toggleModal("balances")}>
						Soldes
					</NavButton>
				)}
			</Stack>

			<Box sx={{ flex: 1 }} />

			<Stack
				direction="row"
				alignItems="center"
				spacing={1.25}
				sx={(t) => ({
					px: 1.75,
					py: 0.75,
					border: `1px solid ${t.palette.custom.line}`,
					borderRadius: 999,
					backgroundColor: t.palette.custom.paper,
					display: { xs: "none", md: "flex" },
				})}
			>
				<Box
					sx={(t) => ({
						width: 7,
						height: 7,
						borderRadius: "50%",
						backgroundColor: tooLate ? t.palette.custom.danger : t.palette.custom.success,
						boxShadow: `0 0 0 4px ${tooLate ? t.palette.custom.dangerSoft : t.palette.custom.accentSoft}`,
					})}
				/>
				<Typography sx={{ fontSize: 13, color: "custom.ink3" }}>Fin des commandes</Typography>
				<Typography variant="mono" sx={{ fontSize: 13, fontWeight: 500, color: tooLate ? "custom.danger" : "custom.ink" }}>
					{tooLate ? "Trop tard" : timeLeft}
				</Typography>
			</Stack>

			<Tooltip title="Message">
				<IconButton aria-label="Message" onClick={() => toggleModal("message")} sx={iconBtnSx()}>
					<Message sx={{ fontSize: 18 }} />
				</IconButton>
			</Tooltip>

			{isAdmin && (
				<>
					<Tooltip title="Admin">
						<IconButton aria-label="Admin" onClick={(e) => setAdminAnchor(e.currentTarget)} sx={iconBtnSx()}>
							<PicsouMark size={18} />
						</IconButton>
					</Tooltip>
					<Menu anchorEl={adminAnchor} open={Boolean(adminAnchor)} onClose={closeAdmin}>
						<MenuItem onClick={adminAction("mergeUsers")}>
							<Merge fontSize="small" sx={{ mr: 1.5 }} /> Fusionner
						</MenuItem>
						<MenuItem onClick={adminAction("balances")}>
							<AccountBalance fontSize="small" sx={{ mr: 1.5 }} /> Soldes
						</MenuItem>
						<MenuItem onClick={adminAction("updateConfig")}>
							<Settings fontSize="small" sx={{ mr: 1.5 }} /> Config
						</MenuItem>
					</Menu>
				</>
			)}

			<Tooltip title={theme === "dark" ? "Mode clair" : "Mode sombre"}>
				<IconButton aria-label="Basculer le thème" onClick={toggleTheme} sx={iconBtnSx()}>
					{theme === "dark" ? <LightMode sx={{ fontSize: 18 }} /> : <DarkMode sx={{ fontSize: 18 }} />}
				</IconButton>
			</Tooltip>

			<Tooltip title={logged ? "Déconnexion" : "Connexion"}>
				<IconButton aria-label={logged ? "Déconnexion" : "Connexion"} onClick={() => void (logged ? logout() : login())} sx={iconBtnSx()}>
					{logged ? <Logout sx={{ fontSize: 18 }} /> : <Login sx={{ fontSize: 18 }} />}
				</IconButton>
			</Tooltip>

			{orderName && (
				<Stack
					direction="row"
					alignItems="center"
					spacing={1.25}
					sx={(t) => ({
						pl: 0.5,
						pr: 1.5,
						py: 0.5,
						border: `1px solid ${t.palette.custom.line}`,
						borderRadius: 999,
						backgroundColor: t.palette.custom.paper,
						display: { xs: "none", sm: "flex" },
					})}
				>
					<Avatar name={orderName} size="md" />
					<Typography sx={{ fontSize: 13, fontWeight: 500 }}>{orderName}</Typography>
				</Stack>
			)}
		</Box>
	);
}
