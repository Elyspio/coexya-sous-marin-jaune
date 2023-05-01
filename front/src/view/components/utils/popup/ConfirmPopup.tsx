import React, { ReactNode, useCallback } from "react";
import { Button, ButtonProps, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, StyledEngineProvider } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useModal } from "@hooks/utils/useModal";
import { createRoot } from "react-dom/client";
import store, { useAppSelector } from "@store";
import { themes } from "@/config/theme";
import { Provider } from "react-redux";

export type ConfirmPopupProps<T> = {
	title: ReactNode;
	content: ReactNode;
	choices: { label: string; value: T; color?: ButtonProps["color"]; variant?: ButtonProps["variant"] }[];

	onSelected: (val: T) => any;

	defaultValue: T;
};

function PopupWrapper({ children }: { children: ReactNode }) {
	return <Provider store={store}>{children}</Provider>;
}

function PopupWrapperStored({ children }: { children: ReactNode }) {
	const { theme } = useAppSelector((state) => ({
		theme: state.theme.current === "dark" ? themes.dark : themes.light,
		current: state.theme.current,
	}));

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

export function ConfirmPopup<T>({ choices, title, content, onSelected, defaultValue }: ConfirmPopupProps<T>) {
	const { toggle, open } = useModal(true);

	const onAction = useCallback(
		(value: T) => () => {
			onSelected(value);
			toggle();
		},
		[onSelected, toggle]
	);

	const cancel = useCallback(() => {
		onSelected(defaultValue);
		toggle();
	}, [defaultValue, onSelected, toggle]);

	return (
		<Dialog open={open} onClose={cancel}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>{content}</DialogContent>
			<DialogActions>
				{choices.map((choice) => (
					<Button key={"" + choice.value} color={choice.color} onClick={onAction(choice.value)} variant={choice.variant}>
						{choice.label}
					</Button>
				))}
			</DialogActions>
		</Dialog>
	);
}

export async function createConfirmModal<T>(props: Omit<ConfirmPopupProps<T>, "onSelected" | "choices" | "defaultValue">) {
	const elem = document.createElement("div");

	const root = createRoot(elem);
	document.body.appendChild(elem);

	const val = await new Promise<boolean>((resolve) => {
		root.render(
			<PopupWrapper>
				<PopupWrapperStored>
					<ConfirmPopup
						{...props}
						onSelected={resolve}
						defaultValue={false}
						choices={[
							{ label: "Annuler", color: "inherit", value: false, variant: "outlined" },
							{ label: "Oui", color: "error", value: true, variant: "contained" },
						]}
					/>
				</PopupWrapperStored>
			</PopupWrapper>
		);
	});

	root.unmount();
	document.body.removeChild(elem);
	return val;
}
