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

// Patient Portal
import AIHealthStatus from "../components/patient/portal/AIHealthStatus";
import VitalsGrid from "../components/patient/portal/VitalsGrid";
import HealthTrendsPreview from "../components/patient/portal/HealthTrendsPreview";
import CarePlanPreview from "../components/patient/portal/CarePlanPreview";
import useHealthData from "../hooks/useHealthData";

// RFID / NFC
import RfidNfcScanner from "../components/patient/RfidNfcScanner";

// Hospital
import HospitalDashboard from "../pages/Hospital/Dashboard";
import Resources from "../pages/Hospital/Resources";
import Analytics from "../pages/Hospital/Analytics";
import HospitalProfile from "../pages/Hospital/Profile";

// Auth protection
import ProtectedRoute from "./ProtectedRoute";


function PortalHealthPage() {
    const { latest } = useHealthData();

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs uppercase tracking-widest text-white/40">
                    My Health
                </p>

                <h1 className="text-2xl font-semibold text-white mt-2">
                    Your Vitals
                </h1>

                <p className="text-white/50 mt-2">
                    View your latest recorded health measurements.
                </p>
            </div>

            <VitalsGrid latest={latest} />
        </div>
    );
}


function TelemedicinePage() {
    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-8 text-white">
            <p className="text-xs uppercase tracking-widest text-white/40">
                Telemedicine
            </p>

            <h1 className="text-2xl font-semibold mt-2">
                Telemedicine
            </h1>

            <p className="text-white/50 mt-3">
                Telemedicine services will be available here.
            </p>
        </div>
    );
}


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
                {/* PATIENT PORTAL        */}
                {/* ==================== */}

                <Route
                    path="/patient/dashboard"
                    element={
                        <ProtectedRoute role="patient">
                            <PatientLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* Overview */}
                    <Route
                        index
                        element={<Dashboard />}
                    />

                    {/* My Health */}
                    <Route
                        path="health"
                        element={<PortalHealthPage />}
                    />

                    {/* Health Trends */}
                    <Route
                        path="trends"
                        element={<HealthTrendsPreview />}
                    />

                    {/* Care Plan */}
                    <Route
                        path="care-plan"
                        element={<CarePlanPreview />}
                    />

                    {/* Alerts */}
                    <Route
                        path="alerts"
                        element={
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-white/40">
                                        Alerts
                                    </p>

                                    <h1 className="text-2xl font-semibold text-white mt-2">
                                        Health Alerts
                                    </h1>
                                </div>

                                <AIHealthStatus />
                            </div>
                        }
                    />

                    {/* Telemedicine */}
                    <Route
                        path="telemedicine"
                        element={<TelemedicinePage />}
                    />

                    {/* Profile */}
                    <Route
                        path="profile"
                        element={<Profile />}
                    />

                </Route>


                {/* ==================== */}
                {/* RFID / NFC            */}
                {/* ==================== */}

                <Route
                    path="/patient/rfid"
                    element={<RfidNfcScanner />}
                />


                {/* ==================== */}
                {/* EMERGENCY ASSESSMENT  */}
                {/* ==================== */}

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


                {/* ==================== */}
                {/* EXISTING PATIENT      */}
                {/* ==================== */}

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
                {/* HOSPITAL PORTAL       */}
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