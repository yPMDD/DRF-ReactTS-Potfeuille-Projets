import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
	LayoutDashboard,
	FolderKanban,
	Users,
	Settings,
	BarChart3,
	UserCog,
	User,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
		description: "Vue d'ensemble",
	},
	{
		title: "Projets",
		url: "/projets",
		icon: FolderKanban,
		description: "Gestion des projets",
	},
	{
		title: "Utilisateurs",
		url: "/utilisateurs",
		icon: Users,
		description: "Gestion des utilisateurs",
	},
	{
		title: "Ressources",
		url: "/ressources",
		icon: UserCog,
		description: "Gestion des ressources",
	},
	{
		title: "Rapports",
		url: "/rapports",
		icon: BarChart3,
		description: "Analytics et exports",
	},
	{
		title: "Paramètres",
		url: "/parametres",
		icon: Settings,
		description: "Configuration",
	},
];

export function AppSidebar() {
	const [collapsed, setCollapsed] = useState(false);
	const location = useLocation();
	const currentPath = location.pathname;

	const isActive = (path: string) =>
		currentPath === path || currentPath.startsWith(path + "/");

	const getNavClassName = (isActive: boolean) =>
		`flex items-center gap-3 rounded-lg px-4 py-6 pr-8 transition-all hover:bg-accent ${
			isActive
				? "bg-primary text-primary-foreground shadow-sm"
				: "text-muted-foreground hover:text-foreground"
		}`;

	return (
		<Sidebar
			className={`border-r bg-card transition-all duration-300 ${
				collapsed ? "w-16" : "w-64"
			}`}
		>
			{/* Header avec logo */}
			<div className="p-4 border-b">
				<div className="flex items-center justify-between">
					{!collapsed && (
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
								<FolderKanban className="w-5 h-5 text-white" />
							</div>
							<div>
								<h2 className="font-semibold text-sm">DSI Manager</h2>
								<p className="text-xs text-muted-foreground">
									Gestion de projets
								</p>
							</div>
						</div>
					)}
					<button
						onClick={() => setCollapsed(!collapsed)}
						className="p-1 rounded-lg hover:bg-accent transition-colors"
					>
						{collapsed ? (
							<ChevronRight className="w-4 h-4" />
						) : (
							<ChevronLeft className="w-4 h-4" />
						)}
					</button>
				</div>
			</div>

			<SidebarContent className="p-4">
				<SidebarGroup>
					<SidebarGroupLabel className={`${collapsed ? "sr-only" : ""}`}>
						Navigation
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu className="space-y-1">
							{navigationItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<NavLink
											to={item.url}
											className={getNavClassName(isActive(item.url))}
											title={collapsed ? item.title : ""}
										>
											<item.icon
												className={`w-5 h-5 ${collapsed ? "mx-auto" : ""}`}
											/>
											{!collapsed && (
												<div className="flex-1">
													<div className="font-medium text-sm">
														{item.title}
													</div>
													<div className="text-xs opacity-75">
														{item.description}
													</div>
												</div>
											)}
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
