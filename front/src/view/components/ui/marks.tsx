import * as React from "react";

/** Marque de l'app : un sous-marin stylisé, posé dans la pastille de la topbar. */
export function BrandMark({ size = 16 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
			<path d="M3 14a4 4 0 0 1 4-4h9l3 3v1a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
			<circle cx="9" cy="14" r="1.2" fill="currentColor" />
			<path d="M14 10V7l2-2" />
			<path d="M5 18v2M19 18v2" />
		</svg>
	);
}

/** Pictogramme Picsou (zone admin). */
export function PicsouMark({ size = 22 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 32 32" fill="none">
			<rect x="9" y="3" width="11" height="6" rx="0.7" fill="#1B1A17" />
			<rect x="7" y="8.4" width="15" height="1.6" rx="0.5" fill="#1B1A17" />
			<rect x="9" y="6" width="11" height="1.2" fill="#B4543A" />
			<ellipse cx="15" cy="17" rx="9" ry="7.2" fill="#F4D26E" stroke="#1B1A17" strokeWidth="1.2" />
			<circle cx="13.5" cy="15.5" r="1.3" fill="#fff" stroke="#1B1A17" strokeWidth="0.8" />
			<circle cx="13.6" cy="15.6" r="0.55" fill="#1B1A17" />
			<circle cx="13.5" cy="15.5" r="2.8" fill="none" stroke="#1B1A17" strokeWidth="0.8" />
			<path d="M16.3 15.5 L19 21" stroke="#1B1A17" strokeWidth="0.7" strokeLinecap="round" />
			<path d="M22 17.5 q3.2 0.6 3.2 2.2 q0 1.5 -3.2 1.8" fill="#E89A2C" stroke="#1B1A17" strokeWidth="1" />
			<text x="14.5" y="7.6" fontFamily="Geist Mono, monospace" fontSize="3.6" fontWeight="700" fill="#F4D26E" textAnchor="middle">
				$
			</text>
		</svg>
	);
}
