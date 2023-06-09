declare module "*.avif" {
	const src: string;
	export default src;
}

declare module "*.bmp" {
	const src: string;
	export default src;
}

declare module "*.gif" {
	const src: string;
	export default src;
}

declare module "*.jpg" {
	const src: string;
	export default src;
}

declare module "*.jpeg" {
	const src: string;
	export default src;
}

declare module "*.png" {
	const src: string;
	export default src;
}

declare module "*.webp" {
	const src: string;
	export default src;
}

declare module "*.svg" {
	import React from "react";
	export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
	const src: string;
	const content: any;
	const viewBox: string;
	const width: string;
	const height: string;
	export default src;
}

declare module "*.module.css" {
	const classes: {
		readonly [key: string]: string;
	};
	export default classes;
}

declare module "*.module.scss" {
	const classes: {
		readonly [key: string]: string;
	};
	export default classes;
}

declare module "*.module.sass" {
	const classes: {
		readonly [key: string]: string;
	};
	export default classes;
}
