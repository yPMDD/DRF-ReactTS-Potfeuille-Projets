import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { getStoredUser } from "@/services/auth";
import { User } from "@/types/User";
export function AppLayout() {
	const userAuth: User | null = getStoredUser();

	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full bg-gradient-dashboard">
				<AppSidebar />

				<div className="flex-1 flex flex-col">
					<Header user={userAuth!} />

					<main className="flex-1 p-6 overflow-auto">
						<Outlet />
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
