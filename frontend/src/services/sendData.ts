import axios from "axios";
import AuthService from "./auth";

const API_URL = "http://localhost:8000"; // Adjust if needed

export async function createUser(
	full_name: string,
	email: string,
	role: string
) {
	const csrfToken = await AuthService.getCsrfToken();
	const response = await axios.post(
		`${API_URL}/users/create/`, // Adjust the endpoint if needed
		{ full_name, email, role },
		{ withCredentials: true, headers: { "X-CSRFToken": csrfToken } }
	);
	return response.data;
}

export async function createProject(
	name: string,
	category: string,
	division: string,
	secteur: string,
	description: string,
	manager: number,
	budget: number,
	date_debut: string,
	date_fin: string
) {
	const csrfToken = await AuthService.getCsrfToken();
	const response = await axios.post(
		`${API_URL}/projects/create/`, // Adjust the endpoint if needed
		{
			name,
			category,
			division,
			secteur,
			description,
			manager,
			budget,
			date_debut,
			date_fin,
		},
		{ withCredentials: true, headers: { "X-CSRFToken": csrfToken } }
	);
	return response.data;
}
export async function createMiseAjour(
	project: number,
	manager: number,
	content: string
) {
	const csrfToken = await AuthService.getCsrfToken();
	console.log(project, manager, content);
	const response = await axios.post(
		`${API_URL}/mise-ajour/create/`,
		{ project, manager, content },
		{ withCredentials: true, headers: { "X-CSRFToken": csrfToken } }
	);
	return response.data;
}
export async function createRessource(
	name: string,
	type: string,
	quantity: number
) {
	const csrfToken = await AuthService.getCsrfToken();
	const response = await axios.post(
		`${API_URL}/ressources/create/`,
		{ name, type, quantity },
		{ withCredentials: true, headers: { "X-CSRFToken": csrfToken } }
	);
	return response.data;
}
export async function addRessourceUtilisee(
	ressource: number,
	project: number,
	quantity: number
) {
	const csrfToken = await AuthService.getCsrfToken();
	const response = await axios.post(
		`${API_URL}/ressources/add-utilisee/`,
		{ ressource, project, quantity },
		{ withCredentials: true, headers: { "X-CSRFToken": csrfToken } }
	);
	return response.data;
}
