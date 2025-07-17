import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { SimpleUserLayout } from "./components/layout/SimpleUserLayout";
import Dashboard from "./pages/Dashboard";
import Projets from "./pages/Projets";
import Utilisateurs from "./pages/Utilisateurs";
import Ressources from "./pages/Ressources";
import Rapports from "./pages/Rapports";
import Parametres from "./pages/Parametres";
import SimpleUserProjects from "./pages/SimpleUserProjects";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<AppLayout />}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/projets" element={<Projets />} />
						<Route path="/utilisateurs" element={<Utilisateurs />} />
						<Route path="/ressources" element={<Ressources />} />
						<Route path="/rapports" element={<Rapports />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/parametres" element={<Parametres />} />
					</Route>
					<Route path="/simple" element={<SimpleUserLayout />}>
						<Route path="/simple/projects" element={<SimpleUserProjects />} />
						<Route path="/simple/profile" element={<Profile />} />
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
