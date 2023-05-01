import { useEffect, useRef, useState } from "react";

export function useMounted() {
	const ref = useRef(null);

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if (ref.current) setMounted(true);
	}, [ref]);

	return [mounted, ref] as const;
}
