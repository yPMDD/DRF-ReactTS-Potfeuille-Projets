import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatBudget(
	amount: number | string | undefined | null
): string {
	if (amount === undefined || amount === null || isNaN(Number(amount)))
		return "-";
	const num = Number(amount);
	if (num >= 1_000_000) {
		return (num / 1_000_000).toFixed(2) + "M€";
	}
	if (num >= 1_000) {
		return (num / 1_000).toFixed(2) + "k€";
	}
	return num.toFixed(2) + "€";
}
