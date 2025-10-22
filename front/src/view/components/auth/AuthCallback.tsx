import { useEffect } from "react";
import { useAppDispatch } from "@store";
import { continueLogin } from "@modules/authentication/authentication.async.action";

export function AuthCallback() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(continueLogin());
	}, []);

	return null;
}
