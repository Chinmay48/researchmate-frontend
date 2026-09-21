import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <Navbar />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
