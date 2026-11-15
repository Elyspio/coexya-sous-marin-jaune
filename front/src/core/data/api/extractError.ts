import axios from "axios";

export function extractApiError(error: unknown, fallback = "Une erreur est survenue."): string {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data as { detail?: string; message?: string; title?: string } | undefined;
		return data?.detail ?? data?.message ?? data?.title ?? error.message ?? fallback;
	}
	if (error instanceof Error) return error.message;
	return fallback;
}
