import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import HospitalLayout from "../layouts/HospitalLayout";
import PatientLayout from "../layouts/PatientLayout";

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
import Overview from "../pages/Patient/Portal/Overview";
import MyHealth from "../pages/Patient/Portal/MyHealth";
import HealthTrends from "../pages/Patient/Portal/HealthTrends";
import CarePlan from "../pages/Patient/Portal/CarePlan";
import Alerts from "../pages/Patient/Portal/Alerts";
import Telemedicine from "../pages/Patient/Portal/Telemedicine";

// RFID / NFC
import RfidNfcScanner from "../components/patient/RfidNfcScanner";

// Hospital
import HospitalDashboard from "../pages/Hospital/Dashboard";
import Patients from "../pages/Hospital/Patients";
import PatientDetails from "../pages/Hospital/PatientDetails";
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
          <Route
            index
            element={<Overview />}
          />

          <Route
            path="health"
            element={<MyHealth />}
          />

          <Route
            path="trends"
            element={<HealthTrends />}
          />

          <Route
            path="care-plan"
            element={<CarePlan />}
          />

          <Route
            path="alerts"
            element={<Alerts />}
          />

          <Route
            path="telemedicine"
            element={<Telemedicine />}
          />

          <Route
            path="profile"
            element={<Profile />}
          />
        </Route>

        {/* ==================== */}
        {/* RFID / NFC           */}
        {/* ==================== */}

        <Route
          path="/patient/rfid"
          element={<RfidNfcScanner />}
        />

        {/* ==================== */}
        {/* EXISTING EMERGENCY    */}
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

        <Route
          path="/patient/history"
          element={<History />}
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
            path="patients"
            element={
              <ProtectedRoute role="hospital">
                <Patients />
              </ProtectedRoute>
            }
          />

          <Route
            path="patients/:patientId"
            element={
              <ProtectedRoute role="hospital">
                <PatientDetails />
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