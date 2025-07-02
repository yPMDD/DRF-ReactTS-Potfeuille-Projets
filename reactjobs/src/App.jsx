import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./Layouts/MainLayout";
import JobsPage from "./pages/jobsPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<MainLayout />}>
				<Route index element={<HomePage />} />
				<Route path="/jobs" element={<JobsPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		)
	);

	return <RouterProvider router={router} />;
};

export default App;
