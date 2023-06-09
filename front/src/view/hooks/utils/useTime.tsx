import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

type TimeContext = {
	get: Dayjs;
	set: (date: Dayjs) => void;
};
/**
 * Context de temps permettant d'avoir un temps unique dans toute l'application
 * Refresh du temps toute les 1 seconde
 */
const TimeCtx = createContext<TimeContext>({ get: dayjs() } as TimeContext);

/**
 * @hook
 * Renvoie la date actuelle (refresh toute les seconde)
 */
export function useTime() {
	const time = useContext(TimeCtx);

	return time.get;
}

type DateProviderProps = {
	children: ReactNode;
};

/**
 * Composant provider pour utiliser le hook useTime
 * @see useTime
 * @param children les composants enfants qui pourront utiliser le hook
 */
export function DateProvider({ children }: DateProviderProps) {
	const [time, setTime] = useState(dayjs());

	useEffect(() => {
		const inter = setInterval(() => {
			setTime(dayjs());
		}, 1000);

		return () => {
			clearInterval(inter);
		};
	}, []);

	return (
		<TimeCtx.Provider
			value={{
				get: time,
				set: setTime,
			}}
		>
			{children}
		</TimeCtx.Provider>
	);
}
