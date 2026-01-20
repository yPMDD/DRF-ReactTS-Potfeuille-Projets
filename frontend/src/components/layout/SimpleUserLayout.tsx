import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { getStoredUser } from "@/services/auth";
import { User as UserType } from "@/types/User";

export function SimpleUserLayout() {
	const userAuth: UserType | null = getStoredUser();

	return (
		<div className="min-h-screen bg-gradient-dashboard">
			<Header user={userAuth!} showSidebar={false} />

			<main className="p-6">
				<div className="max-w-7xl mx-auto">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
