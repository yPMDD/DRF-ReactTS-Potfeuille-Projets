import { Bell, Search, User, Moon, Sun } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthService from "@/services/auth";
import { toast } from "@/hooks/use-toast";

import { User as UserType } from "@/types/User";
interface HeaderProps {
	user: UserType;
	showSidebar?: boolean;
}

export function Header({ user, showSidebar = true }: HeaderProps) {
	console.log(user);
	const { setTheme, theme } = useTheme();
	const navigate = useNavigate();
	const location = useLocation();

	const profilePath = location.pathname.startsWith("/simple")
		? "/simple/profile"
		: "/profile";

	const getRoleLabel = (role: string) => {
		switch (role) {
			case "admin":
				return "Administrateur";
			case "supervisor":
				return "Superviseur";
			case "manager":
				return "Manager";
			default:
				return role;
		}
	};

	const getRoleVariant = (role: string) => {
		switch (role) {
			case "admin":
				return "destructive";
			case "supervisor":
				return "secondary";
			case "manager":
				return "outline";
			default:
				return "outline";
		}
	};

	const handleLogout = async () => {
		try {
			await AuthService.logout();
			navigate("/login");
			toast({
				title: "Déconnexion",
				description: "Vous avez été déconnecté",
				variant: "default",
			});
		} catch (error) {
			toast({
				title: "Déconnexion",
				description: "Erreur lors de la déconnexion",
				variant: "destructive",
			});
			console.error("Logout failed:", error);
		}
	};

	return (
		<header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
			<div className="flex h-16 items-center justify-between px-6">
				{/* Search */}
				<div className="flex items-center flex-1 max-w-md">
					<div className="relative w-full">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
						<Input
							placeholder="Rechercher un projet, utilisateur..."
							className="pl-10"
						/>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-4">
					{/* Dark Mode Toggle */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					</Button>

					{/* Notifications */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="w-5 h-5" />
								<Badge
									variant="destructive"
									className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
								>
									3
								</Badge>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80">
							<DropdownMenuLabel>Notifications</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<div className="space-y-2 p-2">
								<div className="p-3 bg-info/10 rounded-lg border border-info/20">
									<p className="font-medium text-sm">Nouveau projet assigné</p>
									<p className="text-xs text-muted-foreground">
										Migration CRM - Échéance dans 2 jours
									</p>
								</div>
								<div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
									<p className="font-medium text-sm">Dépassement budget</p>
									<p className="text-xs text-muted-foreground">
										Projet ERP - 15% au-dessus du budget
									</p>
								</div>
								<div className="p-3 bg-success/10 rounded-lg border border-success/20">
									<p className="font-medium text-sm">Livraison terminée</p>
									<p className="text-xs text-muted-foreground">
										Site web institutionnel livré
									</p>
								</div>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="flex items-center gap-3 px-3">
								<Avatar className="w-8 h-8">
									<AvatarImage
										src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`}
										alt={user.first_name + " " + user.last_name}
									/>
								</Avatar>
								<div className="hidden md:block text-left">
									<p className="text-sm font-medium">
										{user.first_name} {user.last_name}
									</p>
									<Badge
										variant={getRoleVariant(user.role)}
										className="text-xs"
									>
										{getRoleLabel(user.role)}
									</Badge>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>Mon compte</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<NavLink to={profilePath} className="flex items-center">
									<User className="mr-2 h-4 w-4" />
									<span>Profil</span>
								</NavLink>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								onClick={handleLogout}
							>
								<span>Se déconnecter</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
