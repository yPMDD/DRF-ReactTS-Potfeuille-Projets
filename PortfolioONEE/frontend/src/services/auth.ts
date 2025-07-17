import axios from "axios";
import { User } from "@/types/User";
const API_URL = "http://localhost:8000";

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

const getCookie = (name: string): string | null => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
	return null;
};

const AuthService = {
	getCsrfToken: async (): Promise<string> => {
		await api.get("csrf/");
		const csrfToken = getCookie("csrftoken");
		if (!csrfToken) throw new Error("CSRF token not found in cookies");
		return csrfToken;
	},

	async login(email: string, password: string) {
		const csrfToken = await AuthService.getCsrfToken();
		console.log(csrfToken);
		const response = await axios.post(
			`${API_URL}/login/`,
			{ email, password },
			{ withCredentials: true, headers: { "X-CSRFToken": csrfToken } }
		);
		return response.data;
	},

	async logout() {
		const csrftoken = await AuthService.getCsrfToken(); // Use your getCookie utility
		await axios.post(
			`${API_URL}/logout/`,
			{},
			{
				headers: { "X-CSRFToken": csrftoken },
				withCredentials: true,
			}
		);
		localStorage.removeItem("user");
	},
};

export function getStoredUser(): User | null {
	const userStr = localStorage.getItem("user");
	if (!userStr) return null;
	try {
		return JSON.parse(userStr) as User;
	} catch {
		return null;
	}
}

export default AuthService;
