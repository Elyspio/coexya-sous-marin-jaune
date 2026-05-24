import dayjs, { type ConfigType } from "dayjs";
import "dayjs/locale/fr";

/** Formate un montant en euros, à la française : « 12,50€ ». */
export function fmtPrice(n: number): string {
	return `${(Number.isFinite(n) ? n : 0).toFixed(2).replace(".", ",")}€`;
}

/** Libellé de jour relatif : Aujourd'hui / Hier / Avant-hier / date longue. */
export function fmtDay(date: ConfigType): string {
	const d = dayjs(date).startOf("day");
	const diff = dayjs().startOf("day").diff(d, "day");
	if (diff === 0) return "Aujourd'hui";
	if (diff === 1) return "Hier";
	if (diff === 2) return "Avant-hier";
	return d.locale("fr").format("dddd D MMMM");
}
