import axios from "axios";
import AuthService from "./auth";
const API_URL = "http://localhost:8000";

export async function updateUser(
	userId: number,
	data: { full_name: string; email: string; role: string }
) {
	// Fetch CSRF token if needed
	const csrfToken = await AuthService.getCsrfToken();

	const response = await axios.put(`${API_URL}/users/update/${userId}/`, data, {
		withCredentials: true,
		headers: { "X-CSRFToken": csrfToken },
	});
	return response.data;
}

export async function updateUserPassword(
	userId: number,
	data: { current_password: string; password: string }
) {
	const csrfToken = await AuthService.getCsrfToken();
	const response = await axios.put(
		`${API_URL}/users/update-password/${userId}/`,
		data,
		{
			withCredentials: true,
			headers: { "X-CSRFToken": csrfToken },
		}
	);
}
export async function markProjectAsCompleted(projectId: number) {
	console.log(`markProjectAsCompleted called with projectId: ${projectId}`);
	const csrfToken = await AuthService.getCsrfToken();
	console.log(`CSRF token obtained: ${csrfToken ? "Yes" : "No"}`);

	try {
		const response = await axios.put(
			`${API_URL}/projects/mark-as-completed/${projectId}/`,
			{},
			{
				withCredentials: true,
				headers: { "X-CSRFToken": csrfToken },
			}
		);
		console.log(`API response:`, response);
		return response;
	} catch (error) {
		console.error(`Error in markProjectAsCompleted:`, error);
		throw error;
	}
}

export async function updateProject(projectId: number, data: any) {
	const csrfToken = await AuthService.getCsrfToken();
	const response = await axios.put(
		`${API_URL}/projects/update/${projectId}/`,
		data,
		{ withCredentials: true, headers: { "X-CSRFToken": csrfToken } }
	);
	return response.data;
}
export async function updateRessource(ressourceId: number, data: any) {
	const csrfToken = await AuthService.getCsrfToken();
	const response = await axios.put(
		`${API_URL}/ressources/update/${ressourceId}/`,
		data,
		{ withCredentials: true, headers: { "X-CSRFToken": csrfToken } }
	);
	return response.data;
}
