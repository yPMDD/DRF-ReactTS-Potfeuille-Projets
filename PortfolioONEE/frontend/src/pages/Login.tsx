import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, FolderKanban, Shield, User, UserCog } from "lucide-react";
import AuthService from "@/services/auth";
import { useToast } from "@/hooks/use-toast";

interface User {
	id: number;
	role: string;
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	localisation?: string;
	poste?: string;
	biography?: string;
	division?: string;
	secteur?: string;
}

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const { toast } = useToast();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const user: User = await AuthService.login(email, password);
			localStorage.setItem("user", JSON.stringify(user));
			if (user.role === "supervisor") {
				navigate("/dashboard");
				toast({
					title: "Connexion réussie",
					description: "Welcome back " + user.first_name + " " + user.last_name,
					variant: "default",
				});
			} else if (user.role === "manager") {
				navigate("/simple/projects");
				toast({
					title: "Connexion réussie",
					description: "Welcome back " + user.first_name + " " + user.last_name,
					variant: "default",
				});
			} else {
				navigate("/");
			}
		} catch (error) {
			console.error("Login failed:", error);
			toast({
				title: "Identifiants invalides",
				description: "Veuillez vérifier vos identifiants",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-dashboard flex items-center justify-center p-4">
			<div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
				{/* Left side - Branding */}
				<div className="space-y-6 text-center lg:text-left">
					<div className="flex items-center justify-center lg:justify-start gap-3">
						<div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
							<FolderKanban className="w-7 h-7 text-white" />
						</div>
						<div>
							<h1 className="text-3xl font-bold">DSI Manager</h1>
							<p className="text-muted-foreground">Gestion de projets DSI</p>
						</div>
					</div>

					<div className="space-y-4">
						<h2 className="text-2xl font-semibold">
							Plateforme de Gestion de Projets
						</h2>
						<p className="text-lg text-muted-foreground">
							Optimisez la gestion de vos projets informatiques avec des outils
							d'aide à la décision pour réduire les incertitudes et maximiser
							l'utilisation de vos ressources.
						</p>
					</div>

					<div className="grid gap-3">
						<div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg backdrop-blur">
							<div className="w-2 h-2 bg-success rounded-full"></div>
							<span className="text-sm">Suivi en temps réel des projets</span>
						</div>
						<div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg backdrop-blur">
							<div className="w-2 h-2 bg-success rounded-full"></div>
							<span className="text-sm">Gestion des coûts et ressources</span>
						</div>
						<div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg backdrop-blur">
							<div className="w-2 h-2 bg-success rounded-full"></div>
							<span className="text-sm">Tableaux de bord analytiques</span>
						</div>
					</div>
				</div>

				{/* Right side - Login Form */}
				<div className="space-y-6">
					<Card className="shadow-lg">
						<CardHeader>
							<CardTitle>Connexion</CardTitle>
							<CardDescription>
								Accédez à votre espace de gestion de projets DSI
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleLogin} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Adresse email</Label>
									<Input
										id="email"
										type="email"
										placeholder="exemple@dsi.gouv.ma"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="password">Mot de passe</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Votre mot de passe"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className="w-4 h-4" />
											) : (
												<Eye className="w-4 h-4" />
											)}
										</Button>
									</div>
								</div>

								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Connexion..." : "Se connecter"}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
