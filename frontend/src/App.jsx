import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/user/ProtectedRoute";
import Login from "./pages/auth/Login";
import HomePage from "./pages/user/homepage";
import Dashboard from "./pages/admin/Dashboard";
import RiceManagement from "./pages/admin/RiceManagement";
import RiceVariety from "./pages/user/RiceVariety";
import RiceVarietyDetail from "./pages/user/RiceVarietyDetail";
import PestDiseaseManagement from "./pages/admin/PestDiseaseManagement";
import PestDisease from "./pages/user/PestDisease";
import PestDiseaseDetail from "./pages/user/PestDiseaseDetail";
import CultivationManagement from "./pages/admin/CultivationManagement";
import UserManagement from "./pages/admin/UserManagement";
import CultivationList from "./pages/user/CultivationList";
import FarmingModelManagement from "./pages/admin/FarmingModelManagement";
import ModelFarmList from "./pages/user/ModelFarmList";
function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} /> 
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/" element={<HomePage />} /> */}
          {/* Route bảo vệ dành cho Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/rice-management" element={< RiceManagement/>}/>
            <Route path="/admin/pest-diseases-management" element={<PestDiseaseManagement />} />
            <Route path="/admin/cultivation-management" element={<CultivationManagement />} />
            <Route path="/admin/user-management" element={<UserManagement />} />
            <Route path="/admin/farming-model-management" element={<FarmingModelManagement />} />
          </Route>

          {/* Route bảo vệ dành cho User */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/rice-variety" element={<RiceVariety />} />
            <Route path="/rice/:id" element={<RiceVarietyDetail />} />
            <Route path="/pest-disease" element={<PestDisease />} />
            <Route path="/pest-disease/:id" element={<PestDiseaseDetail />} />
            <Route path="/cultivation" element={<CultivationList />} />
            <Route path="/model-farm" element={<ModelFarmList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
