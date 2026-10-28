import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CarePlan from "../pages/Patient/CarePlan";
import api from "../services/api";
// LifeRoute 2.0 - frontend routing
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
import EmergencyNotification from "../components/patient/portal/EmergencyNotification";
import VitalsGrid from "../components/patient/portal/VitalsGrid";
import HealthTrendsPreview from "../components/patient/portal/HealthTrendsPreview";
import CarePlanPreview from "../components/patient/portal/CarePlanPreview";
import useHealthData from "../hooks/useHealthData";

// Hospital
import HospitalDashboard from "../pages/Hospital/Dashboard";
import Resources from "../pages/Hospital/Resources";
import Analytics from "../pages/Hospital/Analytics";
import HospitalProfile from "../pages/Hospital/Profile";

// Auth protection
import ProtectedRoute from "./ProtectedRoute";


function PortalHealthPage() {
    const healthData = useHealthData();

    const [emergency, setEmergency] = useState(null);
    const [emergencyLoading, setEmergencyLoading] = useState(true);
    const [emergencyError, setEmergencyError] = useState("");
const fetchEmergency = async () => {
    try {
        setEmergencyLoading(true);
        setEmergencyError("");

        const response = await api.get("/emergency/my-case");

        console.log("LIFEROUTE EMERGENCY RESPONSE:", response.data);

        const caseData = response.data?.case ?? response.data;

        console.log("LIFEROUTE CASE STATUS:", caseData?.status);

        setEmergency(caseData);
    } catch (error) {
        if (error?.response?.status === 404) {
            setEmergency(null);
        } else {
            console.error(
                "Emergency status fetch error:",
                error
            );

            setEmergencyError(
                "Unable to load your current emergency status."
            );
        }
    } finally {
        setEmergencyLoading(false);
    }
};
    useEffect(() => {
        fetchEmergency();

        const interval = setInterval(
            fetchEmergency,
            5000
        );

        return () => clearInterval(interval);
    }, []);

    const statusConfig = {
        incoming: {
            label: "Incoming",
            description:
                "LifeRoute has routed your emergency to this hospital.",
        },
        accepted: {
            label: "Accepted",
            description:
                "The hospital has accepted your emergency case.",
        },
        preparing: {
            label: "Preparing",
            description:
                "The hospital is preparing the required resources for your arrival.",
        },
        patient_arrived: {
            label: "Patient Arrived",
            description:
                "The hospital has marked the patient as arrived.",
        },
        completed: {
            label: "Completed",
            description:
                "This emergency case has been completed.",
        },
    };

    const currentStatus =
        statusConfig[emergency?.status] ||
        statusConfig.incoming;

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

            <VitalsGrid {...healthData} />

            <section className="rounded-2xl border border-[#FF5A36]/20 bg-[#FF5A36]/[0.025] overflow-hidden">
                <div className="border-b border-white/[0.07] bg-[#FF5A36]/[0.035] px-6 py-5">
                    <p className="text-xs uppercase tracking-widest text-[#FF7A5C]">
                        LifeRoute Emergency
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-2">
                        Emergency Status
                    </h2>
                </div>

                <div className="p-6">
                    {emergencyLoading ? (
                        <div className="animate-pulse space-y-3">
                            <div className="h-5 w-40 rounded bg-white/[0.06]" />
                            <div className="h-4 w-72 rounded bg-white/[0.06]" />
                            <div className="h-12 w-full rounded-xl bg-white/[0.04]" />
                        </div>
                    ) : emergencyError ? (
                        <div className="rounded-xl border border-red-400/10 bg-red-400/[0.04] p-4">
                            <p className="text-sm text-red-300">
                                {emergencyError}
                            </p>
                        </div>
                    ) : !emergency ? (
                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 text-center">
                            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-white/30">
                                <span className="text-lg">✓</span>
                            </div>

                            <p className="mt-4 text-sm font-medium text-white/60">
                                No active emergency
                            </p>

                            <p className="mt-1 text-xs leading-5 text-white/30">
                                Your active LifeRoute emergency case will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/25">
                                        Recommended Hospital
                                    </p>

                                    <h3 className="mt-1.5 text-lg font-semibold text-white">
                                        {emergency.hospital?.name ||
                                            "Hospital assigned"}
                                    </h3>
                                </div>

                                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/[0.08] px-3 py-1.5 text-xs font-medium text-orange-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {currentStatus.label}
                                </span>
                            </div>

                            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
                                <p className="text-[10px] uppercase tracking-wider text-white/25">
                                    Current Status
                                </p>

                                <p className="mt-2 text-xl font-semibold text-white">
                                    {currentStatus.label}
                                </p>

                                <p className="mt-2 text-sm leading-6 text-white/40">
                                    {currentStatus.description}
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                                    <p className="text-[10px] uppercase tracking-wider text-white/25">
                                        Estimated Arrival
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-white/75">
                                        {emergency.hospital?.eta != null
                                            ? `${emergency.hospital.eta} min`
                                            : "Unavailable"}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                                    <p className="text-[10px] uppercase tracking-wider text-white/25">
                                        Distance
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-white/75">
                                        {emergency.hospital?.distance_km != null
                                            ? `${emergency.hospital.distance_km} km`
                                            : "Unavailable"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-white/25">
                                    Emergency Progress
                                </p>

                                <div className="mt-4 grid grid-cols-4 gap-2">
                                    {[
                                        ["incoming", "Incoming"],
                                        ["accepted", "Accepted"],
                                        ["preparing", "Preparing"],
                                        ["patient_arrived", "Arrived"],
                                    ].map(([step, label]) => {
                                        const order = [
                                            "incoming",
                                            "accepted",
                                            "preparing",
                                            "patient_arrived",
                                            "completed",
                                        ];

                                        const currentIndex =
                                            order.indexOf(
                                                emergency.status
                                            );

                                        const stepIndex =
                                            order.indexOf(step);

                                        const complete =
                                            currentIndex >= stepIndex;

                                        return (
                                            <div key={step}>
                                                <div
                                                    className={`h-1.5 rounded-full ${complete
                                                            ? "bg-[#FF5A36]"
                                                            : "bg-white/[0.08]"
                                                        }`}
                                                />

                                                <p
                                                    className={`mt-2 text-[10px] ${complete
                                                            ? "text-white/65"
                                                            : "text-white/25"
                                                        }`}
                                                >
                                                    {label}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}


function PortalAlertsPage() {
    const healthData = useHealthData();

    return (
        <div className="space-y-6">

            <div>
                <p className="text-xs uppercase tracking-widest text-white/40">
                    Alerts
                </p>

                <h1 className="text-2xl font-semibold text-white mt-2">
                    Health Alerts
                </h1>

                <p className="text-white/50 mt-2">
                    Review health observations and emergency notifications.
                </p>
            </div>

            <AIHealthStatus {...healthData} />

            <EmergencyNotification />

        </div>
    );
}


function PortalTrendsPage() {
    const healthData = useHealthData();

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs uppercase tracking-widest text-white/40">
                    Health Trends
                </p>

                <h1 className="text-2xl font-semibold text-white mt-2">
                    Your Health Trends
                </h1>

                <p className="text-white/50 mt-2">
                    Review changes in your recorded vital measurements over
                    time.
                </p>
            </div>

            <HealthTrendsPreview {...healthData} />
        </div>
    );
}


function TelemedicinePage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs uppercase tracking-widest text-white/40">
                    Telemedicine
                </p>

                <h1 className="text-2xl font-semibold text-white mt-2">
                    Telemedicine
                </h1>

                <p className="text-white/50 mt-2">
                    Connect with healthcare professionals remotely when
                    appropriate.
                </p>
            </div>

            <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-8">
                <div className="w-12 h-12 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center">
                    <span className="text-xl">+</span>
                </div>

                <h2 className="text-xl font-semibold text-white mt-5">
                    Telemedicine is coming soon
                </h2>

                <p className="text-sm text-white/40 mt-3 max-w-xl leading-6">
                    LifeRoute will provide remote consultation support in a
                    future version. For emergencies, use Emergency Assessment
                    to evaluate the situation and find the most suitable
                    hospital.
                </p>

                <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <p className="text-xs uppercase tracking-wider text-white/30">
                        Current emergency pathway
                    </p>

                    <p className="text-sm text-white/60 mt-2">
                        Patient assessment → KTAS triage → required resources →
                        hospital capability → travel time → recommended
                        hospital
                    </p>
                </div>
            </section>
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
                        element={<PortalTrendsPage />}
                    />

                    {/* Care Plan */}
                    <Route
                        path="care-plan"
                        element={<CarePlan />}
                    />

                    {/* Alerts */}
                    <Route
                        path="alerts"
                        element={<PortalAlertsPage />}
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