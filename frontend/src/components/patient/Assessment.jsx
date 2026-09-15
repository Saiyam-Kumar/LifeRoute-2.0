import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import usePatientForm from "../../hooks/usePatientForm";
import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  ClipboardList,
  HeartPulse,
  MessageSquareText,
  User,
} from "lucide-react";

/* ================================================================ */
/* Reusable UI                                                       */
/* ================================================================ */

function Card({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6 sm:p-8">
      <div className="flex items-start gap-3.5 mb-6">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/[0.04] border border-white/[0.08] shrink-0">
          <Icon size={17} strokeWidth={1.75} className="text-[#FF7A5C]" />
        </div>

        <div>
          <h2 className="font-display font-semibold text-[16px] text-white tracking-tightest">
            {title}
          </h2>

          <p className="text-[12.5px] text-white/35 mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <label className="text-[13px] font-medium text-white/65">
          {label}
        </label>

        {hint && (
          <span className="font-mono text-[10.5px] text-white/25">
            {hint}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/[0.1] bg-white/[0.035] px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#FF5A36]/50 focus:bg-white/[0.05]";

function Select({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-10 ${
          value ? "text-white" : "text-white/30"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        strokeWidth={1.75}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30"
      />
    </div>
  );
}

function SegmentedControl({
  options,
  value,
  onChange,
  columns = 2,
}) {
  return (
    <div
      className="grid gap-2.5"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {options.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-xl border px-3 py-3 text-[13.5px] font-medium transition-all duration-200 ${
              active
                ? "border-[#FF5A36]/50 bg-[#FF5A36]/[0.12] text-[#FF7A5C] ring-1 ring-[#FF5A36]/20"
                : "border-white/[0.1] bg-white/[0.035] text-white/55 hover:border-white/20 hover:bg-white/[0.055] hover:text-white/75"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================ */
/* Assessment configuration                                          */
/* ================================================================ */

const STEPS = [
  "Symptom Intake",
  "AI Assessment",
  "Hospital Match",
];

const GENDER_OPTIONS = [
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
  },
  {
    value: "other",
    label: "Other",
  },
];

const CONSCIOUSNESS_OPTIONS = [
  {
    value: "alert",
    label: "Alert — fully aware",
  },
  {
    value: "verbal",
    label: "Responds to voice",
  },
  {
    value: "pain",
    label: "Responds to pain",
  },
  {
    value: "unresponsive",
    label: "Unresponsive",
  },
];

const BREATHING_OPTIONS = [
  {
    value: "normal",
    label: "Normal",
  },
  {
    value: "labored",
    label: "Labored",
  },
  {
    value: "shallow",
    label: "Shallow",
  },
  {
    value: "absent",
    label: "Absent",
  },
];

const ARRIVAL_MODE = {
  SELF: "SELF",
  AMBULANCE: "AMBULANCE",
};

const ARRIVAL_MODE_MODEL_VALUES = {
  SELF: 3,
  AMBULANCE: 2,
};

/* ================================================================ */
/* Assessment                                                        */
/* ================================================================ */

export default function Assessment() {
  const {
    formData,
    errors,
    handleChange,
    submitForm,
  } = usePatientForm();

  const location = useLocation();

  /*
   * Portal entry is ONLY true when the patient came from
   * the authenticated monitoring dashboard.
   *
   * Public/landing assessment does not contain this state,
   * so the existing manual workflow remains unchanged.
   */
  const fromPatientPortal =
    location.state?.fromPatientPortal === true;

  const portalVitals = location.state?.vitals;

  const [gender, setGender] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const [pain, setPain] = useState(0);

  const [arrivalMode, setArrivalMode] = useState("");

  const [consciousness, setConsciousness] = useState("");
  const [breathing, setBreathing] = useState("");

  const [hasVitals, setHasVitals] = useState(false);

  const [hasInjury, setHasInjury] = useState(false);

  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");

  /* ============================================================ */
  /* PREFILL FROM PATIENT MONITORING                               */
  /* ============================================================ */

  useEffect(() => {
    if (!fromPatientPortal || !portalVitals) {
      return;
    }

    /*
     * Known from wearable/monitoring data:
     *
     * heart_rate  -> hr
     * spo2        -> saturation
     * temperature -> bt
     *
     * We intentionally DO NOT invent:
     * respiratory rate
     * blood pressure
     */

    if (portalVitals.heart_rate != null) {
      handleChange(
        "hr",
        Number(portalVitals.heart_rate)
      );
    }

    if (portalVitals.spo2 != null) {
      handleChange(
        "saturation",
        Number(portalVitals.spo2)
      );
    }

    if (portalVitals.temperature != null) {
      handleChange(
        "bt",
        Number(portalVitals.temperature)
      );
    }

    /*
     * Show the vitals section because we already have
     * measured monitoring data.
     */
    setHasVitals(true);

    handleChange(
      "saturation_missing",
      0
    );
  }, [
    fromPatientPortal,
    portalVitals,
    handleChange,
  ]);

  const isAmbulance =
    arrivalMode === ARRIVAL_MODE.AMBULANCE;

  const isSelfArrival =
    arrivalMode === ARRIVAL_MODE.SELF;

  /* ============================================================ */
  /* HELPERS                                                       */
  /* ============================================================ */

  const clearVitals = () => {
    handleChange("sbp", null);
    handleChange("dbp", null);
    handleChange("hr", null);
    handleChange("rr", null);
    handleChange("bt", null);
    handleChange("saturation", null);
  };

  const handleArrivalChange = (value) => {
    setArrivalMode(value);

    handleChange(
      "arrival_mode",
      ARRIVAL_MODE_MODEL_VALUES[value]
    );

    if (value === ARRIVAL_MODE.SELF) {
      /*
       * For a public/manual assessment this preserves
       * the original behaviour.
       *
       * For a patient coming from the monitoring portal,
       * don't destroy the known wearable vitals.
       */
      if (!fromPatientPortal) {
        setHasVitals(false);
        clearVitals();

        handleChange(
          "saturation_missing",
          1
        );
      } else {
        setHasVitals(true);

        handleChange(
          "saturation_missing",
          0
        );
      }
    }

    if (value === ARRIVAL_MODE.AMBULANCE) {
      setHasVitals(true);

      handleChange(
        "saturation_missing",
        0
      );
    }
  };

  const handleGenderChange = (value) => {
    setGender(value);

    /*
     * Existing model encoding:
     *
     * Female = 1
     * Male   = 2
     *
     * Other falls back to Female's supported encoding.
     */
    if (value === "male") {
      handleChange("sex", 2);
    } else {
      handleChange("sex", 1);
    }
  };

  const handlePainChange = (value) => {
    setPain(value);

    handleChange(
      "nrs_pain",
      value
    );

    handleChange(
      "pain",
      value > 0 ? 1 : 0
    );
  };

  const handleConsciousnessChange = (value) => {
    setConsciousness(value);

    const mentalMap = {
      alert: 1,
      verbal: 2,
      pain: 3,
      unresponsive: 4,
    };

    handleChange(
      "mental",
      mentalMap[value]
    );
  };

  const handleBreathingChange = (value) => {
    setBreathing(value);

    /*
     * Keep the UI selection locally.
     *
     * The existing model does not require us to invent
     * a new numeric field for this UI value.
     */
  };

  const handleVitalChange = (field, value) => {
    if (value === "") {
      handleChange(field, null);
      return;
    }

    handleChange(
      field,
      Number(value)
    );
  };

  const handleSubmit = async () => {
    await submitForm();
  };

  /* ============================================================ */
  /* RENDER                                                         */
  /* ============================================================ */

  return (
    <div className="min-h-screen bg-[#0B0D12] pb-28 text-white">

      {/* ======================================================== */}
      {/* HEADER                                                     */}
      {/* ======================================================== */}

      <header className="border-b border-white/[0.08] bg-[#0D1016]">

        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-5 flex items-center gap-2.5">

          <svg
            width="22"
            height="22"
            viewBox="0 0 26 26"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="4"
              cy="21"
              r="2.5"
              fill="#FFFFFF"
            />

            <circle
              cx="22"
              cy="5"
              r="2.5"
              fill="#FF5A36"
            />

            <path
              d="M5.5 19.5C11 12 13 12 20 6.5"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="1 4.2"
            />
          </svg>

          <span className="font-display font-semibold text-[16px] text-white tracking-tightest">
            LifeRoute
          </span>

          <span className="ml-2 font-mono text-[11.5px] uppercase tracking-wide text-white/30">
            Patient Assessment
          </span>

        </div>

      </header>

      {/* ======================================================== */}
      {/* PROGRESS                                                   */}
      {/* ======================================================== */}

      <div className="sticky top-0 z-40 bg-[#0B0D12]/90 backdrop-blur-md border-b border-white/[0.07]">

        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-5">

          <div className="flex items-center">

            {STEPS.map((step, index) => {

              const active = index === 0;

              return (
                <div
                  key={step}
                  className="flex items-center flex-1 last:flex-none"
                >

                  <div className="flex items-center gap-2.5">

                    <span
                      className={`flex items-center justify-center h-6 w-6 rounded-full border font-mono text-[11px] shrink-0 ${
                        active
                          ? "border-[#FF5A36] bg-[#FF5A36] text-white"
                          : "border-white/15 text-white/25"
                      }`}
                    >
                      {index + 1}
                    </span>

                    <span
                      className={`text-[13px] font-medium hidden sm:inline whitespace-nowrap ${
                        active
                          ? "text-white"
                          : "text-white/25"
                      }`}
                    >
                      {step}
                    </span>

                  </div>

                  {index < STEPS.length - 1 && (
                    <span className="flex-1 h-px bg-white/[0.08] mx-3" />
                  )}

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MAIN CONTENT                                               */}
      {/* ======================================================== */}

      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-10">

        <div className="mb-10">

          <div className="flex items-center gap-2.5 mb-3">

            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A36] animate-pulse" />

            <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/30">
              Emergency Assessment
            </span>

          </div>

          <h1 className="font-display font-semibold text-[clamp(1.6rem,3vw,2.1rem)] tracking-tightest text-white">
            Tell us what's happening.
          </h1>

          <p className="text-[15px] text-white/40 mt-2 max-w-lg">
            A few details help LifeRoute route you accurately.
            Skip anything you don't know — an estimate is still useful.
          </p>

          {fromPatientPortal && (
            <div className="mt-5 rounded-xl border border-[#FF5A36]/20 bg-[#FF5A36]/[0.06] px-4 py-3">

              <div className="flex items-start gap-3">

                <Activity
                  size={16}
                  className="text-[#FF7A5C] mt-0.5 shrink-0"
                />

                <div>

                  <p className="text-[13px] font-medium text-[#FF7A5C]">
                    Monitoring data detected
                  </p>

                  <p className="text-[12px] text-white/40 mt-1">
                    Your latest heart rate, SpO₂ and temperature
                    have been prefilled from LifeRoute monitoring.
                    Please complete the information we cannot
                    measure automatically.
                  </p>

                </div>

              </div>

            </div>
          )}

        </div>

        <div className="flex flex-col gap-6">

          {/* ==================================================== */}
          {/* PATIENT INFORMATION                                  */}
          {/* ==================================================== */}

          <Card
            icon={User}
            title="Patient Information"
            subtitle="Who this assessment is for"
          >

            <div className="grid lg:grid-cols-2 gap-6">

              <Field
                label="Age"
                hint="years"
              >

                <input
                  type="number"
                  min="0"
                  max="120"
                  placeholder="e.g. 34"
                  value={formData.age ?? ""}
                  onChange={(event) => {

                    const value =
                      event.target.value;

                    handleChange(
                      "age",
                      value === ""
                        ? ""
                        : Number(value)
                    );

                  }}
                  className={inputClass}
                />

              </Field>

              <Field label="Gender">

                <SegmentedControl
                  options={GENDER_OPTIONS}
                  value={gender}
                  onChange={handleGenderChange}
                  columns={3}
                />

              </Field>

            </div>

            {/* Arrival mode */}

            <div className="mt-8">

              <div className="mb-3">

                <h3 className="text-[14px] font-medium text-white/70">
                  How is the patient arriving?
                </h3>

                <p className="text-[12.5px] text-white/30 mt-1">
                  This helps us tailor the assessment to the situation.
                </p>

              </div>

              <div className="grid md:grid-cols-2 gap-4">

                {/* Self arrival */}

                <button
                  type="button"
                  onClick={() =>
                    handleArrivalChange(
                      ARRIVAL_MODE.SELF
                    )
                  }
                  className={`text-left rounded-2xl border p-5 transition-all duration-200 ${
                    isSelfArrival
                      ? "border-[#FF5A36]/50 bg-[#FF5A36]/[0.08]"
                      : "border-white/[0.08] bg-white/[0.025] hover:border-white/15"
                  }`}
                >

                  <div className="font-medium text-[14px] text-white/80">
                    Self-arrival
                  </div>

                  <div className="text-[12.5px] text-white/30 mt-1">
                    Arriving by private vehicle or independently
                  </div>

                </button>

                {/* Ambulance */}

                <button
                  type="button"
                  onClick={() =>
                    handleArrivalChange(
                      ARRIVAL_MODE.AMBULANCE
                    )
                  }
                  className={`text-left rounded-2xl border p-5 transition-all duration-200 ${
                    isAmbulance
                      ? "border-[#FF5A36]/50 bg-[#FF5A36]/[0.08]"
                      : "border-white/[0.08] bg-white/[0.025] hover:border-white/15"
                  }`}
                >

                  <div className="font-medium text-[14px] text-white/80">
                    Ambulance
                  </div>

                  <div className="text-[12.5px] text-white/30 mt-1">
                    Being transported by emergency services
                  </div>

                </button>

              </div>

            </div>

          </Card>

          {/* ==================================================== */}
          {/* SYMPTOMS                                               */}
          {/* ==================================================== */}

          <Card
            icon={MessageSquareText}
            title="Symptoms"
            subtitle="Describe what is happening in your own words"
          >

            <Field
              label="What's happening?"
              hint={`${symptoms.length}/500`}
            >

              <textarea
                rows={5}
                maxLength={500}
                placeholder="e.g. Sharp chest pain since 20 minutes ago, worse when breathing in..."
                value={formData.chief_complain ?? ""}
                onChange={(event) => {

                  const value =
                    event.target.value;

                  setSymptoms(value);

                  handleChange(
                    "chief_complain",
                    value
                  );

                }}
                className={`${inputClass} resize-none`}
              />

            </Field>

          </Card>

          {/* ==================================================== */}
          {/* CURRENT CONDITION                                     */}
          {/* ==================================================== */}

          <Card
            icon={HeartPulse}
            title="Current Condition"
            subtitle="Tell us how the patient is doing right now"
          >

            <div className="flex flex-col gap-7">

              {/* Pain */}

              <Field
                label="Pain scale"
                hint={`${pain} / 10`}
              >

                <div className="flex items-center gap-1.5">

                  {Array.from(
                    { length: 11 },
                    (_, index) => index
                  ).map((number) => (

                    <button
                      key={number}
                      type="button"
                      onClick={() =>
                        handlePainChange(number)
                      }
                      aria-label={`Pain level ${number}`}
                      className={`flex-1 rounded-lg py-2.5 text-[12px] font-mono transition-all duration-150 ${
                        number === pain
                          ? "bg-[#FF5A36] text-white"
                          : number < pain
                            ? "bg-[#FF5A36]/15 text-[#FF7A5C]"
                            : "bg-white/[0.05] text-white/30 hover:bg-white/[0.08] hover:text-white/50"
                      }`}
                    >
                      {number}
                    </button>

                  ))}

                </div>

              </Field>

              {/* Consciousness + breathing */}

              <div className="grid lg:grid-cols-2 gap-6">

                <Field label="Consciousness">

                  <Select
                    value={consciousness}
                    onChange={
                      handleConsciousnessChange
                    }
                    options={CONSCIOUSNESS_OPTIONS}
                    placeholder="Select condition"
                  />

                </Field>

                <Field label="Breathing">

                  <Select
                    value={breathing}
                    onChange={
                      handleBreathingChange
                    }
                    options={BREATHING_OPTIONS}
                    placeholder="Select breathing status"
                  />

                </Field>

              </div>

            </div>

          </Card>

          {/* ==================================================== */}
          {/* VITALS                                                 */}
          {/* ==================================================== */}

          {(isAmbulance || hasVitals) && (

            <Card
              icon={Activity}
              title="Vital Signs"
              subtitle={
                fromPatientPortal
                  ? "Latest vitals detected from LifeRoute monitoring"
                  : "Measured values available for this assessment"
              }
            >

              {fromPatientPortal && (

                <div className="mb-5 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] px-4 py-3">

                  <p className="text-[12px] text-emerald-300/80">
                    Automatically detected
                  </p>

                  <p className="text-[11.5px] text-white/35 mt-1">
                    Heart rate, SpO₂ and temperature were obtained
                    from the patient's monitoring data.
                  </p>

                </div>

              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* Heart rate */}

                <Field
                  label="Heart rate"
                  hint="bpm"
                >

                  <input
                    type="number"
                    min="0"
                    max="250"
                    placeholder="e.g. 82"
                    value={formData.hr ?? ""}
                    onChange={(event) =>
                      handleVitalChange(
                        "hr",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />

                  {fromPatientPortal &&
                    formData.hr != null && (
                      <p className="text-[10.5px] text-emerald-300/60 mt-1.5">
                        Detected from monitoring
                      </p>
                    )}

                </Field>

                {/* Respiratory rate */}

                <Field
                  label="Respiratory rate"
                  hint="breaths/min"
                >

                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 18"
                    value={formData.rr ?? ""}
                    onChange={(event) =>
                      handleVitalChange(
                        "rr",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <p className="text-[10.5px] text-white/25 mt-1.5">
                    Enter if known
                  </p>

                </Field>

                {/* Temperature */}

                <Field
                  label="Temperature"
                  hint="°C"
                >

                  <input
                    type="number"
                    step="0.1"
                    min="25"
                    max="45"
                    placeholder="e.g. 37.0"
                    value={formData.bt ?? ""}
                    onChange={(event) =>
                      handleVitalChange(
                        "bt",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />

                  {fromPatientPortal &&
                    formData.bt != null && (
                      <p className="text-[10.5px] text-emerald-300/60 mt-1.5">
                        Detected from monitoring
                      </p>
                    )}

                </Field>

                {/* Systolic BP */}

                <Field
                  label="Blood pressure"
                  hint="systolic"
                >

                  <input
                    type="number"
                    min="0"
                    max="300"
                    placeholder="e.g. 120"
                    value={formData.sbp ?? ""}
                    onChange={(event) =>
                      handleVitalChange(
                        "sbp",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <p className="text-[10.5px] text-white/25 mt-1.5">
                    Systolic mmHg
                  </p>

                </Field>

                {/* Diastolic BP */}

                <Field
                  label="Blood pressure"
                  hint="diastolic"
                >

                  <input
                    type="number"
                    min="0"
                    max="200"
                    placeholder="e.g. 80"
                    value={formData.dbp ?? ""}
                    onChange={(event) =>
                      handleVitalChange(
                        "dbp",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <p className="text-[10.5px] text-white/25 mt-1.5">
                    Diastolic mmHg
                  </p>

                </Field>

                {/* SpO2 */}

                <Field
                  label="Oxygen saturation"
                  hint="%"
                >

                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 98"
                    value={formData.saturation ?? ""}
                    onChange={(event) =>
                      handleVitalChange(
                        "saturation",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />

                  {fromPatientPortal &&
                    formData.saturation != null && (
                      <p className="text-[10.5px] text-emerald-300/60 mt-1.5">
                        Detected from monitoring
                      </p>
                    )}

                </Field>

              </div>

              <div className="mt-6 flex items-center justify-between gap-4">

                <p className="text-[11.5px] text-white/25">
                  Only enter values you know. Do not guess measurements.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    clearVitals();
                    setHasVitals(false);
                    handleChange(
                      "saturation_missing",
                      1
                    );
                  }}
                  className="text-[11.5px] text-white/35 hover:text-white/60 transition-colors shrink-0"
                >
                  Clear vitals
                </button>

              </div>

            </Card>

          )}

          {/* ==================================================== */}
          {/* INJURY + HISTORY                                      */}
          {/* ==================================================== */}

          <Card
            icon={ClipboardList}
            title="Injury & History"
            subtitle="Anything responders should know in advance"
          >

            <div className="flex flex-col gap-5">

              <label className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 cursor-pointer">

                <input
                  type="checkbox"
                  checked={hasInjury}
                  onChange={(event) =>
                    setHasInjury(
                      event.target.checked
                    )
                  }
                  className="h-4.5 w-4.5 rounded-md border-white/20 text-[#FF5A36] accent-[#FF5A36]"
                />

                <span className="text-[14.5px] font-medium text-white/70">
                  Visible injury or trauma involved
                </span>

              </label>

              <Field label="Allergies">

                <input
                  type="text"
                  placeholder="e.g. Penicillin, latex — separate with commas"
                  value={allergies}
                  onChange={(event) =>
                    setAllergies(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />

              </Field>

              <Field label="Existing conditions">

                <input
                  type="text"
                  placeholder="e.g. Asthma, diabetes, heart condition"
                  value={conditions}
                  onChange={(event) =>
                    setConditions(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />

              </Field>

            </div>

          </Card>

        </div>

        {/* ======================================================== */}
        {/* CONTINUE                                                  */}
        {/* ======================================================== */}

        {Object.keys(errors || {}).length > 0 && (

          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3">

            <p className="text-[12.5px] text-red-300">
              Please check the highlighted assessment information
              before continuing.
            </p>

            {Object.entries(errors).map(
              ([key, value]) => (
                <p
                  key={key}
                  className="text-[11.5px] text-red-300/60 mt-1"
                >
                  {value}
                </p>
              )
            )}

          </div>

        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">

          <button
            type="button"
            onClick={handleSubmit}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5A36] px-8 py-4 text-[15px] font-medium text-white transition-all duration-300 hover:bg-[#FF6B4A] active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(255,90,54,0.55)]"
          >

            Continue Assessment

            <ArrowUpRight
              size={16}
              strokeWidth={2.25}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />

          </button>

          <p className="text-[12.5px] text-white/30 text-center sm:text-left">
            LifeRoute recommends where to go. It does not diagnose or treat.
          </p>

        </div>

      </div>

    </div>
  );
}