import { avatarColors } from "@/config/tokens";

/** Index couleur déterministe (hash) à partir d'un nom. */
export function colorIndex(name: string): number {
	let h = 0;
	for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
	return h % avatarColors.length;
}

/** Initiales (1 à 2 lettres) à partir d'un nom. */
export function initialsOf(name: string): string {
	const parts = name.split(/[\s-]+/).filter(Boolean);
	if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
	return name.slice(0, 2).toUpperCase();
}

export function avatarColor(name: string): string {
	return avatarColors[colorIndex(name)];
}
