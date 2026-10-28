import { useEffect, useState } from "react";
import {
  Activity,
  BedDouble,
  Building2,
  CircleAlert,
  Clock3,
  HeartPulse,
  RefreshCw,
  Stethoscope,
  Syringe,
  Wind,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Navigation,
} from "lucide-react";

import { getMe } from "../../services/authService";
import api from "../../services/api";

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  accent = "orange",
}) {
  const accentClasses = {
    orange:
      "text-[#FF5A36] bg-[#FF5A36]/[0.08] border-[#FF5A36]/10",
    blue:
      "text-[#7C8CF5] bg-[#7C8CF5]/[0.08] border-[#7C8CF5]/10",
    green:
      "text-emerald-400 bg-emerald-400/[0.08] border-emerald-400/10",
    purple:
      "text-purple-400 bg-purple-400/[0.08] border-purple-400/10",
  };

  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-[#11151D] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-[#141922]">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
            accentClasses[accent]
          }`}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>

        <Activity
          size={16}
          className="text-white/[0.12] transition-colors group-hover:text-white/20"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm text-white/40">{label}</p>

        <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>

        <p className="mt-1.5 text-xs text-white/25">
          {description}
        </p>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  eyebrow,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.08] bg-[#11151D] ${className}`}
    >
      <div className="border-b border-white/[0.07] px-6 py-5">
        {eyebrow && (
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-white">
          {title}
        </h2>
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

export default function Dashboard() {
  const [hospital, setHospital] = useState(null);
  const [emergencies, setEmergencies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [emergencyLoading, setEmergencyLoading] = useState(true);

  const [error, setError] = useState("");
  const [emergencyError, setEmergencyError] = useState("");

  const fetchDashboard = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const profile = await getMe();

      console.log(
        "Authenticated hospital profile:",
        profile
      );

      if (!profile?.hospital_id) {
        throw new Error(
          "Your account is not linked to a LifeRoute hospital."
        );
      }

      const hospitalResponse = await api.get(
        `/hospital/${profile.hospital_id}`
      );

      const hospitalData =
        hospitalResponse.data;

      if (
        !hospitalData ||
        hospitalData.message ===
          "Hospital not found"
      ) {
        throw new Error(
          "Your hospital record could not be found."
        );
      }

      setHospital(hospitalData);

      // ----------------------------------------------
      // Fetch emergencies assigned to this hospital
      // ----------------------------------------------

      try {
        setEmergencyLoading(true);
        setEmergencyError("");

        const emergencyResponse =
          await api.get(
            `/emergency/hospital/${profile.hospital_id}`
          );

        setEmergencies(
          emergencyResponse?.data?.emergencies ||
            []
        );
      } catch (err) {
        console.error(
          "Emergency fetch error:",
          err
        );

        setEmergencyError(
          "Unable to load incoming emergencies."
        );
      } finally {
        setEmergencyLoading(false);
      }

    } catch (err) {
      console.error(
        "Hospital dashboard error:",
        err
      );

      setError(
        err.message ||
          "Unable to load hospital information right now."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-3 w-28 rounded bg-white/[0.06]" />

            <div className="mt-4 h-10 w-72 rounded bg-white/[0.06]" />

            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-40 rounded-2xl border border-white/[0.06] bg-white/[0.025]"
                />
              ))}
            </div>

            <div className="mt-6 h-80 rounded-2xl border border-white/[0.06] bg-white/[0.025]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0D12] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400/[0.08] text-red-400">
              <CircleAlert size={21} />
            </div>

            <h1 className="mt-5 font-display text-2xl font-semibold text-white">
              Unable to load hospital
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/40">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchDashboard()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#ff6847]"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOpen = hospital?.is_open;

  const availableBeds =
    Number(hospital?.available_beds) || 0;

  const availableIcu =
    Number(hospital?.available_icu) || 0;

  const ventilators =
    Number(hospital?.ventilators) || 0;

  const incomingEmergencies =
    emergencies.filter(
      (emergency) =>
        emergency.status !== "completed"
    );

  return (
    <div className="min-h-screen bg-[#0B0D12] px-6 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#FF5A36]">
                Hospital Portal
              </span>

              <span className="h-1 w-1 rounded-full bg-white/20" />

              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
                Emergency Operations
              </span>
            </div>

            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {hospital.name}
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Monitor hospital capacity and prepare for
              LifeRoute emergency arrivals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-full border px-4 py-2 ${
                isOpen
                  ? "border-emerald-400/10 bg-emerald-400/[0.06]"
                  : "border-red-400/10 bg-red-400/[0.06]"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isOpen
                    ? "bg-emerald-400"
                    : "bg-red-400"
                }`}
              />

              <span
                className={`text-xs font-medium ${
                  isOpen
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {isOpen
                  ? "Operational"
                  : "Closed"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/40 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
              aria-label="Refresh hospital data"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </header>

        {/* ====================================================== */}
        {/* INCOMING EMERGENCIES                                   */}
        {/* ====================================================== */}

        <div className="mt-9">
          <SectionCard
            eyebrow="LifeRoute Emergency Network"
            title="Incoming Emergencies"
          >
            {emergencyLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-32 rounded-xl bg-white/[0.025]" />
                <div className="h-32 rounded-xl bg-white/[0.025]" />
              </div>
            ) : emergencyError ? (
              <div className="rounded-xl border border-red-400/10 bg-red-400/[0.04] p-5">
                <div className="flex items-center gap-3">
                  <CircleAlert
                    size={18}
                    className="text-red-400"
                  />

                  <p className="text-sm text-red-300">
                    {emergencyError}
                  </p>
                </div>
              </div>
            ) : incomingEmergencies.length === 0 ? (
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-white/30">
                  <CheckCircle2 size={21} />
                </div>

                <p className="mt-4 text-sm font-medium text-white/60">
                  No incoming emergencies
                </p>

                <p className="mt-1 text-xs text-white/30">
                  LifeRoute emergency cases routed to this
                  hospital will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {incomingEmergencies.map(
                  (emergency) => (
                    <EmergencyCard
                      key={emergency.id}
                      emergency={emergency}
                    />
                  )
                )}
              </div>
            )}
          </SectionCard>
        </div>

        {/* CAPACITY STATS */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={AlertTriangle}
            label="Incoming Emergencies"
            value={incomingEmergencies.length}
            description="LifeRoute cases routed here"
            accent="orange"
          />

          <StatCard
            icon={BedDouble}
            label="Available Beds"
            value={availableBeds}
            description="General capacity currently available"
            accent="orange"
          />

          <StatCard
            icon={HeartPulse}
            label="ICU Beds"
            value={availableIcu}
            description="Critical-care beds available"
            accent="blue"
          />

          <StatCard
            icon={Wind}
            label="Ventilators"
            value={ventilators}
            description="Ventilators currently available"
            accent="green"
          />
        </div>

        {/* CAPACITY + READINESS */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">

          <SectionCard
            eyebrow="Capacity"
            title="Resource Availability"
          >
            <div className="space-y-6">

              <ResourceBar
                label="General Beds"
                value={availableBeds}
                icon={BedDouble}
                max={Math.max(
                  availableBeds,
                  100
                )}
              />

              <ResourceBar
                label="ICU Beds"
                value={availableIcu}
                icon={HeartPulse}
                max={Math.max(
                  availableIcu,
                  25
                )}
              />

              <ResourceBar
                label="Ventilators"
                value={ventilators}
                icon={Wind}
                max={Math.max(
                  ventilators,
                  15
                )}
              />

            </div>

            <div className="mt-7 rounded-xl border border-[#FF5A36]/10 bg-[#FF5A36]/[0.035] p-4">
              <div className="flex gap-3">
                <Activity
                  size={17}
                  className="mt-0.5 shrink-0 text-[#FF5A36]"
                />

                <div>
                  <p className="text-sm font-medium text-white/75">
                    Live capacity matters
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    These resource values are used by
                    LifeRoute when determining which
                    facilities are best equipped for an
                    emergency.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Hospital"
            title="Emergency Readiness"
          >
            <div className="space-y-5">

              <InfoRow
                icon={CircleAlert}
                label="Emergency Level"
                value={hospital.emergency_level}
              />

              <InfoRow
                icon={Building2}
                label="Hospital Type"
                value={hospital.hospital_type}
              />

              <InfoRow
                icon={Clock3}
                label="Operational Status"
                value={
                  isOpen
                    ? "Currently Open"
                    : "Currently Closed"
                }
              />

              <InfoRow
                icon={Stethoscope}
                label="Specialists"
                value={`${
                  hospital.specialists?.length ||
                  0
                }`}
              />

              <InfoRow
                icon={Syringe}
                label="Resources"
                value={`${
                  hospital.resources?.length ||
                  0
                }`}
              />

            </div>
          </SectionCard>

        </div>

        {/* SPECIALISTS + RESOURCES */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          <SectionCard
            eyebrow="Medical Team"
            title="Specialists"
          >
            <div className="flex flex-wrap gap-2">

              {(hospital.specialists || []).map(
                (specialist) => (
                  <span
                    key={specialist}
                    className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-white/55 transition hover:border-white/[0.12] hover:bg-white/[0.045] hover:text-white/75"
                  >
                    {specialist}
                  </span>
                )
              )}

            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Facilities"
            title="Available Resources"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

              {(hospital.resources || []).map(
                (resource) => (
                  <div
                    key={resource}
                    className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A36]" />

                    <span className="text-xs text-white/55">
                      {resource}
                    </span>
                  </div>
                )
              )}

            </div>
          </SectionCard>

        </div>

        {/* FOOTER */}

        <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-[11px] text-white/20 sm:flex-row sm:items-center sm:justify-between">

          <span>
            Hospital ID:{" "}
            <span className="font-mono text-white/30">
              {hospital.id}
            </span>
          </span>

          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
            Connected to LifeRoute emergency network
          </span>

        </div>

      </div>
    </div>
  );
}


function EmergencyCard({
  emergency,
}) {
  const patient = emergency.patient || {};
  const vitals = emergency.vitals || {};
  const assessment = emergency.assessment || {};
  const hospital = emergency.hospital || {};
  const location = emergency.location || {};

  const ktas = Number(assessment.ktas_level) || 0;
  const ktasCritical = ktas === 1 || ktas === 2;

  const [status, setStatus] = useState(
    emergency.status || "incoming"
  );

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const statusConfig = {
    incoming: {
      label: "Incoming",
      next: "accepted",
      nextLabel: "Accept Emergency",
    },
    accepted: {
      label: "Accepted",
      next: "preparing",
      nextLabel: "Prepare Patient",
    },
    preparing: {
      label: "Preparing",
      next: "patient_arrived",
      nextLabel: "Patient Arrived",
    },
    patient_arrived: {
      label: "Patient Arrived",
      next: "completed",
      nextLabel: "Complete Case",
    },
    completed: {
      label: "Completed",
      next: null,
      nextLabel: null,
    },
  };

  const currentStatus =
    statusConfig[status] || statusConfig.incoming;

  const updateEmergencyStatus = async () => {
    if (!currentStatus.next || updatingStatus) {
      return;
    }

    try {
      setUpdatingStatus(true);

      await api.patch(
        `/emergency/cases/${emergency.id}/status`,
        {
          status: currentStatus.next,
        }
      );

      setStatus(currentStatus.next);
    } catch (error) {
      console.error(
        "Emergency status update failed:",
        error
      );

      alert(
        error?.response?.data?.detail ||
          "Unable to update emergency status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#FF5A36]/20 bg-[#FF5A36]/[0.025]">

      {/* TOP BAR */}

      <div className="flex flex-col gap-4 border-b border-white/[0.07] bg-[#FF5A36]/[0.035] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5A36]/[0.10] text-[#FF7A5C]">
            <AlertTriangle size={18} />
          </div>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#FF7A5C]">
              LifeRoute Incoming Emergency
            </p>

            <p className="mt-1 text-xs text-white/30">
              Case {emergency.id}
            </p>
          </div>

        </div>

        <div className="flex flex-wrap items-center gap-2">

          {/* CASE STATUS */}

          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {currentStatus.label}
          </span>

          {/* KTAS */}

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              ktasCritical
                ? "border-red-400/20 bg-red-400/[0.08] text-red-300"
                : "border-orange-400/20 bg-orange-400/[0.08] text-orange-300"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />

            KTAS {ktas || "N/A"}

            {assessment.category
              ? ` — ${assessment.category}`
              : ""}
          </span>

        </div>

      </div>

      <div className="p-5">

        {/* PATIENT + VITALS */}

        <div className="grid gap-5 lg:grid-cols-2">

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
              Patient
            </p>

            <h3 className="mt-2 font-display text-xl font-semibold text-white">
              {patient.age
                ? `${patient.age}-year-old`
                : "Emergency Patient"}
            </h3>

            <p className="mt-1 text-sm text-white/45">
              {patient.gender === 1
                ? "Female"
                : patient.gender === 2
                ? "Male"
                : "Gender not specified"}
            </p>

            {patient.chief_complaint && (
              <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="text-[10px] uppercase tracking-wide text-white/25">
                  Chief Complaint
                </p>

                <p className="mt-1.5 text-sm leading-6 text-white/65">
                  {patient.chief_complaint}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
              Current Vitals
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">

              <VitalBox
                label="Heart Rate"
                value={vitals.heart_rate}
                unit="BPM"
                icon={HeartPulse}
              />

              <VitalBox
                label="SpO₂"
                value={vitals.spo2}
                unit="%"
                icon={Activity}
              />

              <VitalBox
                label="Blood Pressure"
                value={
                  vitals.systolic_bp != null &&
                  vitals.diastolic_bp != null
                    ? `${vitals.systolic_bp}/${vitals.diastolic_bp}`
                    : null
                }
                unit="mmHg"
                icon={HeartPulse}
              />

              <VitalBox
                label="Respiratory Rate"
                value={vitals.respiratory_rate}
                unit="/min"
                icon={Wind}
              />

            </div>
          </div>

        </div>

        {/* RESOURCES */}

        <div className="mt-6 border-t border-white/[0.07] pt-5">

          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
            Prepare Required Resources
          </p>

          <div className="mt-3 flex flex-wrap gap-2">

            {(assessment.resources || []).map(
              (resource) => (
                <span
                  key={resource}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-1.5 text-xs text-emerald-300"
                >
                  <CheckCircle2 size={13} />
                  {resource}
                </span>
              )
            )}

            {(assessment.resources || []).length === 0 && (
              <span className="text-xs text-white/30">
                No specific resources listed.
              </span>
            )}

          </div>

        </div>

        {/* ETA + LOCATION */}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">

          <InfoBox
            icon={Clock3}
            label="Estimated Arrival"
            value={
              hospital.eta != null
                ? `${hospital.eta} min`
                : "Unavailable"
            }
          />

          <InfoBox
            icon={MapPin}
            label="Distance"
            value={
              hospital.distance_km != null
                ? `${hospital.distance_km} km`
                : "Unavailable"
            }
          />

          <InfoBox
            icon={Navigation}
            label="Patient Location"
            value={
              location.latitude != null &&
              location.longitude != null
                ? `${Number(
                    location.latitude
                  ).toFixed(4)}, ${Number(
                    location.longitude
                  ).toFixed(4)}`
                : "Unavailable"
            }
          />

        </div>

        {/* AI REASON */}

        {(assessment.reasons || []).length > 0 && (
          <div className="mt-5 rounded-xl border border-[#7C8CF5]/10 bg-[#7C8CF5]/[0.035] p-4">

            <div className="flex gap-3">

              <Stethoscope
                size={17}
                className="mt-0.5 shrink-0 text-[#AAB4FF]"
              />

              <div>

                <p className="text-xs font-medium text-[#AAB4FF]">
                  LifeRoute Assessment
                </p>

                <ul className="mt-2 space-y-1">
                  {assessment.reasons.map(
                    (reason, index) => (
                      <li
                        key={`${reason}-${index}`}
                        className="text-xs leading-5 text-white/40"
                      >
                        • {reason}
                      </li>
                    )
                  )}
                </ul>

              </div>

            </div>

          </div>
        )}

        {/* EMERGENCY WORKFLOW */}

        <div className="mt-6 border-t border-white/[0.07] pt-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
                Emergency Workflow
              </p>

              <p className="mt-1.5 text-sm text-white/50">
                Current status:{" "}
                <span className="font-medium text-white/80">
                  {currentStatus.label}
                </span>
              </p>

            </div>

            {currentStatus.next ? (
              <button
                type="button"
                onClick={updateEmergencyStatus}
                disabled={updatingStatus}
                className="inline-flex items-center justify-center rounded-xl bg-[#FF5A36] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF5A36]/10 transition hover:bg-[#ff6a4a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updatingStatus
                  ? "Updating..."
                  : currentStatus.nextLabel}
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-5 py-3 text-sm font-medium text-emerald-300">
                <CheckCircle2 size={16} />
                Emergency Case Completed
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}


function VitalBox({
  label,
  value,
  unit,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">

      <div className="flex items-center gap-2 text-white/30">
        <Icon size={13} />
        <span className="text-[10px] uppercase tracking-wide">
          {label}
        </span>
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-display text-lg font-semibold text-white">
          {value != null
            ? value
            : "—"}
        </span>

        {value != null && (
          <span className="text-[9px] text-white/25">
            {unit}
          </span>
        )}
      </div>

    </div>
  );
}


function InfoBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">

      <div className="flex items-center gap-2 text-white/30">
        <Icon size={14} />
        <span className="text-[10px] uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-medium text-white/75">
        {value}
      </p>

    </div>
  );
}


function ResourceBar({
  label,
  value,
  icon: Icon,
  max,
}) {
  const numericValue =
    Number(value) || 0;

  const percentage = Math.min(
    (numericValue / max) * 100,
    100
  );

  return (
    <div>
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2.5">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-white/45">
            <Icon size={15} />
          </div>

          <span className="text-sm text-white/55">
            {label}
          </span>

        </div>

        <span className="font-display text-lg font-semibold text-white">
          {numericValue}
        </span>

      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FF5A36] to-[#FF8A70] transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>
    </div>
  );
}


function InfoRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-white/35">
          <Icon size={16} />
        </div>

        <span className="text-sm text-white/40">
          {label}
        </span>

      </div>

      <span className="truncate text-right text-sm font-medium text-white/75">
        {value}
      </span>

    </div>
  );
}