import { Projet } from "./Projet";
import { Ressource } from "./Ressource";

export interface RessourceUtilisee {
	id: number;
	ressource: Ressource;
	project: Projet;
	quantity: number;
}
