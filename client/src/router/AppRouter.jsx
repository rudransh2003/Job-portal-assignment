import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import SeekerDashboard from "../pages/seeker/SeekerDashboard";
import SeekerProfile from "../pages/seeker/SeekerProfile";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/seeker/view-jobs"
                    element={
                        <ProtectedRoute allowedRoles={["seeker"]}>
                            <SeekerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/seeker/profile"
                    element={
                        <ProtectedRoute allowedRoles={["seeker"]}>
                            <SeekerProfile />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}