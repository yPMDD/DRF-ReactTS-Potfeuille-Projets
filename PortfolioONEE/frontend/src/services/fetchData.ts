import axios from "axios";

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
