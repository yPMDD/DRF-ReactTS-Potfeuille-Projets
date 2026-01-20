import axios from "axios";
import AuthService from "./auth";

const API_URL = "http://localhost:8000"; // Adjust if needed

export async function fetchDivisionsAndSecteurs() {
	const response = await axios.get(`${API_URL}/divisions-secteurs/`, {
		withCredentials: true,
	});
	return response.data; // { divisions: [...], secteurs: [...] }
}
export async function fetchManagers() {
	const response = await axios.get(`${API_URL}/managers/`, {
		withCredentials: true,
	});
	return response.data; // Array of managers
}
export async function fetchUsers() {
	const response = await axios.get(`${API_URL}/users/`, {
		withCredentials: true,
	});
	return response.data; // Array of users
}

export async function fetchProjects() {
	const response = await axios.get(`${API_URL}/projects/`, {
		withCredentials: true,
	});
	return response.data; // Array of projects
}

export async function fetchMiseAjour() {
	const response = await axios.get(`${API_URL}/mise-ajour/get/`, {
		withCredentials: true,
	});
	return response.data; // Array of mise à jour updates
}

export async function fetchRepports() {
	const response = await axios.get(`${API_URL}/rapports/history/`, {
		withCredentials: true,
	});
	return response.data;
}
export async function fetchRessources() {
	const response = await axios.get(`${API_URL}/ressources/get/`, {
		withCredentials: true,
	});
	return response.data;
}
export async function fetchRessourceUtilisee() {
	const response = await axios.get(`${API_URL}/ressources/get-utilisee/`, {
		withCredentials: true,
	});
	return response.data;
}

export async function generateReport(reportData: {
	periode: string;
	data_types: string[];
	format: string;
}) {
	const csrfToken = await AuthService.getCsrfToken();
	const response = await axios.post(
		`${API_URL}/rapports/generate/`,
		reportData,
		{
			withCredentials: true,
			headers: { "X-CSRFToken": csrfToken },
		}
	);
	return response.data;
}

export async function downloadReport(rapportId: string) {
	const response = await axios.get(
		`${API_URL}/rapports/download/${rapportId}/`,
		{
			withCredentials: true,
			responseType: "blob",
		}
	);
	return response.data;
}
