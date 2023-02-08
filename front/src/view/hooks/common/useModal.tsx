import { useCallback, useState } from "react";

export function useModal(defaultState: boolean = false) {
	const [open, setOpen] = useState(defaultState);

	const toggle = useCallback(() => {
		setOpen(prev => !prev);
	}, []);

	return {
		open,
		toggle,
	};
}
