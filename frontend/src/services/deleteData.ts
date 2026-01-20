import axios from "axios";
import AuthService from "./auth";
const API_URL = "http://localhost:8000";

export async function deleteUser(userId: number) {
	const csrfToken = await AuthService.getCsrfToken();
	await axios.delete(`${API_URL}/users/delete/${userId}/`, {
		withCredentials: true,
		headers: { "X-CSRFToken": csrfToken },
	});
}

export async function deleteProject(projectId: number) {
	const csrfToken = await AuthService.getCsrfToken();
	await axios.delete(`${API_URL}/projects/delete/${projectId}/`, {
		withCredentials: true,
		headers: { "X-CSRFToken": csrfToken },
	});
}
export async function deleteRessource(ressourceId: number) {
	const csrfToken = await AuthService.getCsrfToken();
	await axios.delete(`${API_URL}/ressources/delete/${ressourceId}/`, {
		withCredentials: true,
		headers: { "X-CSRFToken": csrfToken },
	});
}
