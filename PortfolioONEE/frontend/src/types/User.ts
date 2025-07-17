export interface User {
	id: number;
	role: string;
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	phone?: string;
	localisation?: string;
	poste?: string;
	biography?: string;
	division?: string;
	secteur?: string;
	date_joined?: string;
}
