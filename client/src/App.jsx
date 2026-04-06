import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import IdeaDetailPage from "./pages/IdeaDetailPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="ideas/:id" element={<IdeaDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}