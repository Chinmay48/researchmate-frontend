import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateResearchPage from "./pages/CreateResearchPage";
import ResearchProjectsPage from "./pages/ResearchProjectPage";
import ProjectWorkspacePage from "./pages/ProjectWorkspacePage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Only logged-out users */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Only authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/research/new" element={<CreateResearchPage />} />
            <Route path="/research" element={<ResearchProjectsPage />} />
            <Route
              path="/research/:projectId"
              element={<ProjectWorkspacePage />}
            />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
