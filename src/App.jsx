import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProviderDashboard from "./pages/ProviderDashboard.jsx";
import ProviderDetail from "./pages/ProviderDetail.jsx";
import Providers from "./pages/Providers.jsx";
import PublicLanding from "./pages/PublicLanding.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<PublicLanding />} />
      <Route path="/providers" element={<Providers />} />
      <Route path="/providers/:id" element={<ProviderDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={["ROLE_CLIENT"]}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRoles={["ROLE_SERVICE_PROVIDER"]}>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;
