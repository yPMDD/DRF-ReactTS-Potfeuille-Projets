import { MiseAjour } from "@/types/miseAjour";

export type Projet = {
	id: number;
	name: string;
	category: string;
	division: string;
	secteur: string;
	description: string;
	manager: string;
	budget: number;
	date_debut: string;
	date_fin: string;
	status?: string;
	budget_used?: number;
	mise_a_jour?: MiseAjour[];
};
