import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Briefcase,
	Lock,
	Settings,
	Save,
	Edit,
	ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStoredUser } from "@/services/auth";
import { User as UserType } from "@/types/User";
import { fetchDivisionsAndSecteurs } from "@/services/fetchData";
import { set } from "react-hook-form";
import { Division } from "@/types/Division";
import { Secteur } from "@/types/Secteur";
interface DivisionsAndSecteurs {
	divisions: Division[];
	secteurs: Secteur[];
}

export default function Profile() {
	const [isEditing, setIsEditing] = useState(false);
	const location = useLocation();
	const isSimpleUser = location.pathname.startsWith("/simple");
	const userAuth: UserType | null = getStoredUser();
	const [formData, setFormData] = useState({
		firstName: userAuth?.first_name,
		lastName: userAuth?.last_name,
		email: userAuth?.email,
		position: userAuth?.poste,
		phone: userAuth?.phone,
		division: userAuth?.division,
		section: userAuth?.secteur,
		location: userAuth?.localisation,
		joinDate: userAuth?.date_joined,
		bio: userAuth?.biography,
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [divisions, setDivisions] = useState<Division[]>([]);
	const [secteurs, setSecteurs] = useState<Secteur[]>([]);

	const { toast } = useToast();

	useEffect(() => {
		async function loadDivSec() {
			const DivSec: DivisionsAndSecteurs = await fetchDivisionsAndSecteurs();
			setDivisions(DivSec.divisions);
			setSecteurs(DivSec.secteurs);

			// Find the division and secteur IDs based on the user's division/secteur name
			if (userAuth) {
				const divisionObj = DivSec.divisions.find(
					(d) => d.name === userAuth.division
				);
				const secteurObj = DivSec.secteurs.find(
					(s) => s.name === userAuth.secteur
				);
				setFormData((prev) => ({
					...prev,
					division: divisionObj ? divisionObj.id.toString() : "",
					section: secteurObj ? secteurObj.name : "",
				}));
			}
		}
		loadDivSec();
		// eslint-disable-next-line
	}, []);

	const handleSave = () => {
		toast({
			title: "Profil mis à jour",
			description: "Vos informations ont été enregistrées avec succès",
		});
		setIsEditing(false);
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Navigation */}
			{isSimpleUser && (
				<div className="flex items-center">
					<Button variant="ghost" size="sm" asChild>
						<NavLink to="/simple/projects" className="flex items-center gap-2">
							<ArrowLeft className="w-4 h-4" />
							Retour aux projets
						</NavLink>
					</Button>
				</div>
			)}

			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
					<p className="text-muted-foreground">
						Gérez vos informations personnelles et professionnelles
					</p>
				</div>
				<div className="flex gap-2">
					{isEditing ? (
						<>
							<Button variant="outline" onClick={() => setIsEditing(false)}>
								Annuler
							</Button>
							<Button onClick={handleSave} className="gap-2">
								<Save className="w-4 h-4" />
								Enregistrer
							</Button>
						</>
					) : (
						<Button onClick={() => setIsEditing(true)} className="gap-2">
							<Edit className="w-4 h-4" />
							Modifier
						</Button>
					)}
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{/* Profile Summary */}
				<Card className="md:col-span-1">
					<CardHeader className="text-center">
						<div className="flex justify-center mb-4">
							<Avatar className="w-24 h-24">
								<AvatarImage src="/placeholder-avatar.jpg" />
								<AvatarFallback className="text-lg">
									{formData.firstName[0]}
									{formData.lastName[0]}
								</AvatarFallback>
							</Avatar>
						</div>
						<CardTitle>
							{formData.firstName} {formData.lastName}
						</CardTitle>
						<p className="text-muted-foreground">{formData.position}</p>
						<Badge variant="secondary">
							{divisions.find((d) => d.id === Number(formData.division))
								?.name || ""}
						</Badge>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-2 text-sm">
							<Mail className="w-4 h-4 text-muted-foreground" />
							<span>{formData.email}</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<Phone className="w-4 h-4 text-muted-foreground" />
							<span>{formData.phone}</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<MapPin className="w-4 h-4 text-muted-foreground" />
							<span>{formData.location}</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<Calendar className="w-4 h-4 text-muted-foreground" />
							<span>
								Arrivé le{" "}
								{new Date(formData.joinDate).toLocaleDateString("fr-FR")}
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Profile Details */}
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="w-5 h-5" />
							Informations Personnelles
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">Prénom</Label>
								<Input
									id="firstName"
									value={formData.firstName}
									onChange={(e) =>
										handleInputChange("firstName", e.target.value)
									}
									disabled={!isEditing}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Nom</Label>
								<Input
									id="lastName"
									value={formData.lastName}
									onChange={(e) =>
										handleInputChange("lastName", e.target.value)
									}
									disabled={!isEditing}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) => handleInputChange("email", e.target.value)}
								disabled={!isEditing}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">Téléphone</Label>
							<Input
								id="phone"
								value={formData.phone}
								onChange={(e) => handleInputChange("phone", e.target.value)}
								disabled={!isEditing}
							/>
						</div>

						<Separator />

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="division">Division</Label>
								<Select
									value={formData.division}
									onValueChange={(value) =>
										handleInputChange("division", value)
									}
									disabled={!isEditing}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{divisions.map((division) => (
											<SelectItem
												key={division.id}
												value={division.id.toString()}
											>
												{division.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="section">Section</Label>
								<Select
									value={formData.section}
									onValueChange={(value) => handleInputChange("section", value)}
									disabled={!isEditing}
								>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionner une section" />
									</SelectTrigger>
									<SelectContent>
										{secteurs
											.filter(
												(secteur) =>
													secteur.division_id === Number(formData.division)
											)
											.map((secteur) => (
												<SelectItem key={secteur.id} value={secteur.name}>
													{secteur.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="position">Poste</Label>
							<Input
								id="position"
								value={formData.position}
								onChange={(e) => handleInputChange("position", e.target.value)}
								disabled={!isEditing}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="location">Localisation</Label>
							<Input
								id="location"
								value={formData.location}
								onChange={(e) => handleInputChange("location", e.target.value)}
								disabled={!isEditing}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="bio">Biographie</Label>
							<Textarea
								id="bio"
								value={formData.bio}
								onChange={(e) => handleInputChange("bio", e.target.value)}
								disabled={!isEditing}
								rows={3}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Password Management */}
				<Card className="md:col-span-3">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Lock className="w-5 h-5" />
							Modifier le mot de passe
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="currentPassword">Mot de passe actuel</Label>
							<Input
								id="currentPassword"
								type="password"
								value={formData.currentPassword}
								onChange={(e) =>
									handleInputChange("currentPassword", e.target.value)
								}
								disabled={!isEditing}
								placeholder="Entrez votre mot de passe actuel"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="newPassword">Nouveau mot de passe</Label>
								<Input
									id="newPassword"
									type="password"
									value={formData.newPassword}
									onChange={(e) =>
										handleInputChange("newPassword", e.target.value)
									}
									disabled={!isEditing}
									placeholder="Nouveau mot de passe"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirmPassword">
									Confirmer le mot de passe
								</Label>
								<Input
									id="confirmPassword"
									type="password"
									value={formData.confirmPassword}
									onChange={(e) =>
										handleInputChange("confirmPassword", e.target.value)
									}
									disabled={!isEditing}
									placeholder="Confirmer le mot de passe"
								/>
							</div>
						</div>
						{isEditing && (
							<div className="mt-4 p-4 bg-muted/50 rounded-lg">
								<p className="text-sm text-muted-foreground">
									Le mot de passe doit contenir au moins 8 caractères, incluant
									des majuscules, minuscules, chiffres et caractères spéciaux.
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
