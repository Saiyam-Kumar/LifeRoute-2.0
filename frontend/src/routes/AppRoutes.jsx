import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PatientLayout from "../layouts/PatientLayout";
import HospitalLayout from "../layouts/HospitalLayout";

// Landing
import Landing from "../pages/Landing/Landing";
import Incidents from "../pages/Incidents/Incidents";

// Auth
import PatientLogin from "../pages/Auth/PatientLogin";
import PatientRegister from "../pages/Auth/PatientRegister";
import HospitalLogin from "../pages/Auth/HospitalLogin";
import HospitalRegister from "../pages/Auth/HospitalRegister";

// Patient
import Dashboard from "../pages/Patient/Dashboard";
import Assessment from "../pages/Patient/Assessment";
import Loading from "../pages/Patient/Loading";
import Results from "../pages/Patient/Results";
import HospitalDetails from "../pages/Patient/HospitalDetails";
import History from "../pages/Patient/History";
import Profile from "../pages/Patient/Profile";

// RFID / NFC
import RfidNfcScanner from "../components/patient/RfidNfcScanner";

// Hospital
import HospitalDashboard from "../pages/Hospital/Dashboard";
import Resources from "../pages/Hospital/Resources";
import Analytics from "../pages/Hospital/Analytics";
import HospitalProfile from "../pages/Hospital/Profile";

// Auth protection
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ==================== */}
                {/* LANDING              */}
                {/* ==================== */}

                <Route
                    path="/"
                    element={<Landing />}
                />

                {/* ==================== */}
                {/* INCIDENTS             */}
                {/* ==================== */}

                <Route
                    path="/incidents"
                    element={<Incidents />}
                />

                {/* ==================== */}
                {/* AUTHENTICATION        */}
                {/* ==================== */}

                <Route
                    path="/patient/login"
                    element={<PatientLogin />}
                />

                <Route
                    path="/patient/register"
                    element={<PatientRegister />}
                />

                <Route
                    path="/hospital/login"
                    element={<HospitalLogin />}
                />

                <Route
                    path="/hospital/register"
                    element={<HospitalRegister />}
                />

                {/* ==================== */}
                {/* PATIENT               */}
                {/* ==================== */}

                <Route
                    path="/patient/dashboard"
                    element={
                        <ProtectedRoute role="patient">
                            <PatientLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={<Dashboard />}
                    />
                </Route>

                {/* RFID / NFC IDENTIFICATION */}
                <Route
                    path="/patient/rfid"
                    element={<RfidNfcScanner />}
                />

                {/* Existing emergency assessment */}
                <Route
                    path="/patient/assessment"
                    element={
                        <ProtectedRoute role="patient">
                            <Assessment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patient/loading"
                    element={<Loading />}
                />

                <Route
                    path="/patient/results"
                    element={<Results />}
                />

                <Route
                    path="/patient/history"
                    element={<History />}
                />

                <Route
                    path="/patient/profile"
                    element={<Profile />}
                />

                <Route
                    path="/patient/hospital"
                    element={<HospitalDetails />}
                />

                {/* ==================== */}
                {/* HOSPITAL PORTAL      */}
                {/* ==================== */}

                <Route
                    path="/hospital"
                    element={<HospitalLayout />}
                >
                    <Route
                        path="dashboard"
                        element={
                            <ProtectedRoute role="hospital">
                                <HospitalDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="resources"
                        element={<Resources />}
                    />

                    <Route
                        path="analytics"
                        element={<Analytics />}
                    />

                    <Route
                        path="profile"
                        element={<HospitalProfile />}
                    />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
