import { useEffect, useRef } from "react";
import { useAuth } from "@/core/data/auth/AuthContext";

export function AuthCallback() {
	const { continueLogin } = useAuth();
	const ran = useRef(false);

	useEffect(() => {
		if (ran.current) return;
		ran.current = true;
		void continueLogin();
	}, [continueLogin]);

	return null;
}
