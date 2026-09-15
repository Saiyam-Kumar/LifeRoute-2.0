import { useEffect, useState } from "react";

import {
  Activity,
  BedDouble,
  Check,
  CircleAlert,
  HeartPulse,
  Loader2,
  RefreshCw,
  Save,
  Stethoscope,
  Wind,
  X,
  ShieldCheck,
} from "lucide-react";

import {
  getMe,
  getIdToken,
} from "../../services/authService";


const API_BASE_URL =
  "http://127.0.0.1:8000";


const SPECIALIST_OPTIONS = [
  "Emergency Physician",
  "Cardiologist",
  "Neurologist",
  "Neurosurgeon",
  "Orthopedic Specialist",
  "Oncologist",
  "Pulmonologist",
  "Gastroenterologist",
  "Urologist",
  "Pediatrician",
  "General Physician",
];


const RESOURCE_OPTIONS = [
  "Emergency Physician",
  "Oxygen",
  "Cardiac Monitoring",
  "CT Scan",
  "MRI",
  "Trauma Care",
  "Laboratory",
  "Critical Care",
  "Blood Bank",
  "Emergency Care",
];


export default function Resources() {

  const [hospital, setHospital] = useState(null);

  const [hospitalId, setHospitalId] =
    useState(null);

  const [beds, setBeds] = useState(0);

  const [icu, setIcu] = useState(0);

  const [ventilators, setVentilators] =
    useState(0);

  const [isOpen, setIsOpen] =
    useState(true);

  const [specialists, setSpecialists] =
    useState([]);

  const [resources, setResources] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ============================================================
  // FETCH HOSPITAL
  // ============================================================

  const fetchHospital = async (
    showRefresh = false
  ) => {

    try {

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setSuccess("");


      const profile =
        await getMe();


      const currentHospitalId =
        profile?.hospital_id ||
        profile?.hospital?.id ||
        profile?.id;


      if (!currentHospitalId) {

        throw new Error(
          "No hospital is linked to this account."
        );

      }


      setHospitalId(
        currentHospitalId
      );


      const response =
        await fetch(
          `${API_BASE_URL}/hospital/${currentHospitalId}`
        );


      if (!response.ok) {

        throw new Error(
          `Request failed with status ${response.status}`
        );

      }


      const data =
        await response.json();


      if (
        !data ||
        data.message ===
          "Hospital not found"
      ) {

        throw new Error(
          "Hospital could not be found."
        );

      }


      setHospital(data);


      setBeds(
        data.available_beds ?? 0
      );

      setIcu(
        data.available_icu ?? 0
      );

      setVentilators(
        data.ventilators ?? 0
      );

      setIsOpen(
        Boolean(data.is_open)
      );

      setSpecialists(
        data.specialists ?? []
      );

      setResources(
        data.resources ?? []
      );


    } catch (err) {

      console.error(
        "Resources page error:",
        err
      );


      setError(
        err.message ||
          "Unable to load hospital resources right now."
      );


    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  };


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {

    fetchHospital();

  }, []);


  // ============================================================
  // SPECIALISTS
  // ============================================================

  const toggleSpecialist = (
    specialist
  ) => {

    setSpecialists(
      (current) =>

        current.includes(
          specialist
        )

          ? current.filter(
              (item) =>
                item !== specialist
            )

          : [
              ...current,
              specialist,
            ]
    );

  };


  // ============================================================
  // RESOURCES
  // ============================================================

  const toggleResource = (
    resource
  ) => {

    setResources(
      (current) =>

        current.includes(resource)

          ? current.filter(
              (item) =>
                item !== resource
            )

          : [
              ...current,
              resource,
            ]
    );

  };


  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = async () => {

    try {

      setSaving(true);

      setError("");
      setSuccess("");


      if (!hospitalId) {

        throw new Error(
          "No hospital is linked to this account."
        );

      }


      const payload = {

        available_beds:
          Math.max(
            0,
            Number(beds) || 0
          ),

        available_icu:
          Math.max(
            0,
            Number(icu) || 0
          ),

        ventilators:
          Math.max(
            0,
            Number(ventilators) || 0
          ),

        specialists,

        resources,

        is_open:
          isOpen,

      };


      // ========================================================
      // GET FIREBASE TOKEN
      // ========================================================

      const token =
        await getIdToken();


      // ========================================================
      // AUTHENTICATED PATCH
      // ========================================================

      const response =
        await fetch(
          `${API_BASE_URL}/hospital/${hospitalId}`,
          {

            method: "PATCH",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

            body:
              JSON.stringify(
                payload
              ),

          }
        );


      if (!response.ok) {

        const responseText =
          await response.text();


        throw new Error(
          responseText ||
            `Update failed with status ${response.status}`
        );

      }


      setSuccess(
        "Hospital resources updated successfully."
      );


      // ========================================================
      // REFRESH FROM FIRESTORE
      // ========================================================

      await fetchHospital();


      setTimeout(() => {

        setSuccess("");

      }, 4000);


    } catch (err) {

      console.error(
        "Resource update error:",
        err
      );


      setError(
        err.message ||
          "Unable to update hospital resources."
      );


    } finally {

      setSaving(false);

    }

  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-[#0B0D12] px-6 py-10 lg:px-10">

        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-3 w-28 rounded bg-white/[0.06]" />

          <div className="mt-4 h-10 w-80 rounded bg-white/[0.06]" />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">

            <div className="h-72 rounded-2xl border border-white/[0.06] bg-white/[0.025]" />

            <div className="h-72 rounded-2xl border border-white/[0.06] bg-white/[0.025]" />

            <div className="h-72 rounded-2xl border border-white/[0.06] bg-white/[0.025]" />

          </div>

        </div>

      </div>

    );

  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error && !hospital) {

    return (

      <div className="min-h-screen bg-[#0B0D12] px-6 py-10 lg:px-10">

        <div className="mx-auto max-w-3xl">

          <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-8">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400/[0.08] text-red-400">

              <CircleAlert size={21} />

            </div>


            <h1 className="mt-5 font-display text-2xl font-semibold text-white">

              Unable to load resources

            </h1>


            <p className="mt-2 text-sm leading-6 text-white/40">

              {error}

            </p>


            <button
              type="button"
              onClick={() =>
                fetchHospital()
              }
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


  // ============================================================
  // MAIN UI
  // ============================================================

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

                Resource Management

              </span>

            </div>


            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">

              Manage Resources

            </h1>


            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">

              Keep your hospital's capacity and emergency resources up to date.
              These values help LifeRoute make better routing decisions.

            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              fetchHospital(true)
            }
            disabled={
              refreshing ||
              saving
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/40 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50 md:self-auto"
            aria-label="Refresh resources"
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

        </header>


        {/* MESSAGES */}

        {(error || success) && (

          <div className="mt-6">

            {error && (

              <div className="flex items-start gap-3 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3.5">

                <CircleAlert
                  size={17}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <p className="text-sm text-red-200/70">

                  {error}

                </p>

              </div>

            )}


            {success && (

              <div className="flex items-start gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-3.5">

                <Check
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <p className="text-sm text-emerald-200/70">

                  {success}

                </p>

              </div>

            )}

          </div>

        )}


        {/* HOSPITAL STATUS */}

        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  isOpen
                    ? "bg-emerald-400/[0.08] text-emerald-400"
                    : "bg-red-400/[0.08] text-red-400"
                }`}
              >

                <Activity size={20} />

              </div>


              <div>

                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">

                  Hospital Status

                </p>


                <h2 className="mt-1 text-base font-semibold text-white">

                  {hospital?.name}

                </h2>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                setIsOpen(
                  (value) =>
                    !value
                )
              }
              disabled={saving}
              className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                isOpen
                  ? "border-emerald-400/10 bg-emerald-400/[0.05]"
                  : "border-red-400/10 bg-red-400/[0.05]"
              }`}
            >

              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isOpen
                    ? "bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.6)]"
                    : "bg-red-400"
                }`}
              />


              <span
                className={`text-sm font-medium ${
                  isOpen
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >

                {isOpen
                  ? "Currently Operational"
                  : "Currently Closed"}

              </span>


              <span className="ml-1 text-xs text-white/25 group-hover:text-white/40">

                Change

              </span>

            </button>

          </div>

        </section>


        {/* CRITICAL RESOURCES */}

        <section className="mt-10">

          <SectionHeader
            eyebrow="Capacity"
            title="Update Critical Resources"
            description="Update the number of resources currently available."
          />


          <div className="mt-4 grid gap-4 md:grid-cols-3">

            <NumberResourceCard
              icon={BedDouble}
              label="Available Beds"
              description="General hospital beds"
              value={beds}
              onChange={setBeds}
              accent="orange"
            />


            <NumberResourceCard
              icon={HeartPulse}
              label="Available ICU"
              description="Critical-care beds"
              value={icu}
              onChange={setIcu}
              accent="blue"
            />


            <NumberResourceCard
              icon={Wind}
              label="Ventilators"
              description="Available ventilators"
              value={ventilators}
              onChange={setVentilators}
              accent="green"
            />

          </div>

        </section>


        {/* SPECIALISTS */}

        <section className="mt-10">

          <SectionHeader
            eyebrow="Medical Team"
            title="Specialists"
            description="Select the specialists currently available at your hospital."
          />


          <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">

            <div className="flex flex-wrap gap-2.5">

              {SPECIALIST_OPTIONS.map(
                (specialist) => {

                  const selected =
                    specialists.includes(
                      specialist
                    );


                  return (

                    <button
                      key={specialist}
                      type="button"
                      onClick={() =>
                        toggleSpecialist(
                          specialist
                        )
                      }
                      disabled={saving}
                      className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs transition-all ${
                        selected
                          ? "border-[#FF5A36]/20 bg-[#FF5A36]/[0.08] text-white"
                          : "border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/[0.13] hover:bg-white/[0.045] hover:text-white/70"
                      }`}
                    >

                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          selected
                            ? "border-[#FF5A36] bg-[#FF5A36] text-white"
                            : "border-white/15"
                        }`}
                      >

                        {selected && (
                          <Check
                            size={10}
                            strokeWidth={3}
                          />
                        )}

                      </span>


                      {specialist}

                    </button>

                  );

                }
              )}

            </div>


            <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4">

              <Stethoscope
                size={14}
                className="text-white/25"
              />


              <span className="text-xs text-white/30">

                {specialists.length} specialist
                {specialists.length === 1
                  ? ""
                  : "s"} currently available

              </span>

            </div>

          </div>

        </section>


        {/* FACILITIES */}

        <section className="mt-10">

          <SectionHeader
            eyebrow="Facilities & Equipment"
            title="Available Resources"
            description="Select the emergency resources and facilities currently available."
          />


          <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">

              {RESOURCE_OPTIONS.map(
                (resource) => {

                  const selected =
                    resources.includes(
                      resource
                    );


                  return (

                    <button
                      key={resource}
                      type="button"
                      onClick={() =>
                        toggleResource(
                          resource
                        )
                      }
                      disabled={saving}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                        selected
                          ? "border-[#7C8CF5]/15 bg-[#7C8CF5]/[0.06]"
                          : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                      }`}
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            selected
                              ? "bg-[#7C8CF5] shadow-[0_0_7px_rgba(124,140,245,0.55)]"
                              : "bg-white/15"
                          }`}
                        />


                        <span
                          className={`truncate text-xs ${
                            selected
                              ? "text-white/75"
                              : "text-white/40"
                          }`}
                        >

                          {resource}

                        </span>

                      </div>


                      {selected ? (

                        <Check
                          size={14}
                          className="shrink-0 text-[#7C8CF5]"
                        />

                      ) : (

                        <X
                          size={14}
                          className="shrink-0 text-white/15"
                        />

                      )}

                    </button>

                  );

                }
              )}

            </div>


            <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4">

              <span className="h-1.5 w-1.5 rounded-full bg-[#7C8CF5]" />

              <span className="text-xs text-white/30">

                {resources.length} resource
                {resources.length === 1
                  ? ""
                  : "s"} currently available

              </span>

            </div>

          </div>

        </section>


        {/* SAVE */}

        <div className="sticky bottom-5 z-20 mt-10">

          <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.09] bg-[#0F131A]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-medium text-white/70">

                Keep hospital capacity up to date

              </p>


              <p className="mt-1 text-xs text-white/30">

                Updated resources can affect LifeRoute's hospital recommendations.

              </p>

            </div>


            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#FF5A36] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(255,90,54,0.15)] transition hover:bg-[#ff6847] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving ? (

                <>

                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  Saving...

                </>

              ) : (

                <>

                  <Save size={16} />

                  Save Changes

                </>

              )}

            </button>

          </div>

        </div>


        {/* FOOTER */}

        <div className="mt-8 border-t border-white/[0.06] pt-5 text-[11px] text-white/20">

          Hospital ID:{" "}

          <span className="font-mono text-white/30">

            {hospital?.id}

          </span>

        </div>

      </div>

    </div>

  );

}


/* ===================================================== */
/* CAPACITY STATUS LOGIC */
/* ===================================================== */

function getCapacityStatus(value) {

  const numericValue =
    Number(value) || 0;


  if (numericValue <= 0) {

    return {

      label: "CRITICAL",

      description:
        "No capacity currently available",

      color: "red",

    };

  }


  if (numericValue <= 2) {

    return {

      label: "LOW",

      description:
        "Limited capacity",

      color: "orange",

    };

  }


  return {

    label: "AVAILABLE",

    description:
      "Capacity currently available",

    color: "green",

  };

}


/* ===================================================== */
/* STATUS CARD */
/* ===================================================== */

function StatusCard({
  icon: Icon,
  label,
  value,
  status,
  accent,
}) {

  const iconClasses = {

    orange:
      "bg-[#FF5A36]/[0.08] text-[#FF5A36]",

    blue:
      "bg-[#7C8CF5]/[0.08] text-[#7C8CF5]",

    green:
      "bg-emerald-400/[0.08] text-emerald-400",

  };


  const statusClasses = {

    red: {

      wrapper:
        "border-red-400/10 bg-red-400/[0.035]",

      dot:
        "bg-red-400",

      text:
        "text-red-300",

    },

    orange: {

      wrapper:
        "border-orange-400/10 bg-orange-400/[0.035]",

      dot:
        "bg-orange-400",

      text:
        "text-orange-300",

    },

    green: {

      wrapper:
        "border-emerald-400/10 bg-emerald-400/[0.035]",

      dot:
        "bg-emerald-400",

      text:
        "text-emerald-300",

    },

  };


  const currentStatus =
    statusClasses[
      status.color
    ];


  return (

    <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12]">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClasses[accent]}`}
        >

          <Icon size={18} />

        </div>


        <span
          className={`h-2 w-2 rounded-full ${currentStatus.dot}`}
        />

      </div>


      <div className="mt-5">

        <p className="text-sm text-white/40">

          {label}

        </p>


        <div className="mt-1 flex items-end gap-2">

          <span className="font-display text-3xl font-semibold tracking-tight text-white">

            {value}

          </span>


          <span className="mb-1 text-xs text-white/25">

            available

          </span>

        </div>


        <div
          className={`mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 ${currentStatus.wrapper}`}
        >

          <span
            className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`}
          />


          <div>

            <p
              className={`text-[10px] font-semibold tracking-[0.12em] ${currentStatus.text}`}
            >

              {status.label}

            </p>


            <p className="mt-0.5 text-[10px] text-white/25">

              {status.description}

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}


/* ===================================================== */
/* SECTION HEADER */
/* ===================================================== */

function SectionHeader({
  eyebrow,
  title,
  description,
}) {

  return (

    <div>

      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF5A36]/70">

        {eyebrow}

      </p>


      <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-white">

        {title}

      </h2>


      <p className="mt-1.5 text-sm text-white/35">

        {description}

      </p>

    </div>

  );

}


/* ===================================================== */
/* NUMBER RESOURCE CARD */
/* ===================================================== */

function NumberResourceCard({
  icon: Icon,
  label,
  description,
  value,
  onChange,
  accent,
}) {

  const accents = {

    orange: {

      icon:
        "bg-[#FF5A36]/[0.08] text-[#FF5A36]",

      focus:
        "focus:border-[#FF5A36]/30 focus:ring-[#FF5A36]/10",

    },

    blue: {

      icon:
        "bg-[#7C8CF5]/[0.08] text-[#7C8CF5]",

      focus:
        "focus:border-[#7C8CF5]/30 focus:ring-[#7C8CF5]/10",

    },

    green: {

      icon:
        "bg-emerald-400/[0.08] text-emerald-400",

      focus:
        "focus:border-emerald-400/30 focus:ring-emerald-400/10",

    },

  };


  return (

    <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6 transition-colors hover:border-white/[0.12]">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${accents[accent].icon}`}
        >

          <Icon size={18} />

        </div>

      </div>


      <div className="mt-5">

        <p className="text-sm font-medium text-white/70">

          {label}

        </p>


        <p className="mt-1 text-xs text-white/30">

          {description}

        </p>


        <div className="relative mt-5">

          <input
            type="number"
            min="0"
            value={value}
            onChange={(event) =>
              onChange(
                event.target.value
              )
            }
            className={`w-full rounded-xl border border-white/[0.08] bg-[#0C1016] px-4 py-3 font-display text-2xl font-semibold text-white outline-none transition placeholder:text-white/20 focus:ring-4 ${accents[accent].focus}`}
          />



        </div>

      </div>

    </div>

  );

}