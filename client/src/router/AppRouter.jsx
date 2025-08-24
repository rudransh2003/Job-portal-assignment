import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import SeekerDashboard from "../pages/seeker/SeekerDashboard";
import SeekerProfile from "../pages/seeker/SeekerProfile";
import EmployerDashboard from "../pages/employer/EmployerDashboard";
import EmployerProfile from "../pages/employer/EmployerProfile";
import CreateJob from "../pages/employer/CreateJob";
import AppliedJobs from "../pages/seeker/AppliedJobs";
import ApplicationsPage from "../pages/employer/ApplicationsPage";
import AdminDashboard from "../pages/admin/AdminDashboard";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
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
                <Route
                    path="/seeker/applied-jobs"
                    element={
                        <ProtectedRoute allowedRoles={["seeker"]}>
                            <AppliedJobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employer/view-jobs"
                    element={
                        <ProtectedRoute allowedRoles={["employer"]}>
                            <EmployerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employer/profile"
                    element={
                        <ProtectedRoute allowedRoles={["employer"]}>
                            <EmployerProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employer/create-job"
                    element={
                        <ProtectedRoute allowedRoles={["employer"]}>
                            <CreateJob />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employer/view-applicants"
                    element={
                        <ProtectedRoute allowedRoles={["employer"]}>
                            <ApplicationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}