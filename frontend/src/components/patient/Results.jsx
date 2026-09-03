import usePrediction from "../../hooks/usePrediction";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


import {
  Activity,
  HeartPulse,
  MapPin,
  Clock3,
  Building2,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  RotateCcw,
  Sparkles,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* KTAS severity configuration                                        */
/* ------------------------------------------------------------------ */

const KTAS_MAP = {
  1: {
    label: "Level 1 — Critical",
    ring: "border-red-400/30",
    bg: "bg-red-400/[0.08]",
    text: "text-red-300",
    dot: "bg-red-400",
  },

  2: {
    label: "Level 2 — Emergent",
    ring: "border-orange-400/30",
    bg: "bg-orange-400/[0.08]",
    text: "text-orange-300",
    dot: "bg-orange-400",
  },

  3: {
    label: "Level 3 — Urgent",
    ring: "border-yellow-400/30",
    bg: "bg-yellow-400/[0.08]",
    text: "text-yellow-300",
    dot: "bg-yellow-400",
  },

  4: {
    label: "Level 4 — Less Urgent",
    ring: "border-green-400/30",
    bg: "bg-green-400/[0.08]",
    text: "text-green-300",
    dot: "bg-green-400",
  },

  5: {
    label: "Level 5 — Non-Urgent",
    ring: "border-blue-400/30",
    bg: "bg-blue-400/[0.08]",
    text: "text-blue-300",
    dot: "bg-blue-400",
  },
};

/* ------------------------------------------------------------------ */
/* Animation                                                          */
/* ------------------------------------------------------------------ */

const fadeUp = {
  initial: {
    opacity: 0,
    y: 16,
  },

  whileInView: {
    opacity: 1,
    y: 0,
  },

  viewport: {
    once: true,
    amount: 0.3,
  },

  transition: {
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1],
  },
};

/* ------------------------------------------------------------------ */
/* Reusable section label                                             */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }) {
  return (
    <span className="block mb-3 font-mono text-[11px] uppercase tracking-wide text-white/30">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable dark panel                                                */
/* ------------------------------------------------------------------ */

function Panel({ children, className = "" }) {
  return (
    <motion.section
      {...fadeUp}
      className={`rounded-2xl border border-white/[0.08] bg-[#11151D] p-6 sm:p-8 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.65)] ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ================================================================== */
/* RESULTS                                                            */
/* ================================================================== */

export default function Results() {
  const { prediction } = usePrediction();
  const navigate = useNavigate();

  console.log("RESULTS:", prediction);

  if (!prediction) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center px-6 text-white">
        <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] px-8 py-7 text-center">
          <p className="text-sm text-white/50">
            No prediction available.
          </p>

          <button
            type="button"
            onClick={() => navigate("/patient/assessment")}
            className="mt-5 rounded-full bg-[#FF5A36] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#FF6B4A]"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  const ktas =
    KTAS_MAP[prediction.ktas_level] ??
    KTAS_MAP[3];

  const hospital =
    prediction.recommended_hospital;

  const hasMissing =
    hospital?.missing_resources?.length > 0;

  const hospitalName =
    hospital?.hospital ||
    hospital?.name ||
    "Recommended Hospital";

  return (
    <div className="min-h-screen bg-[#0B0D12] pb-28 text-white">

      {/* ========================================================== */}
      {/* EMERGENCY STRIP                                            */}
      {/* ========================================================== */}


      {/* ========================================================== */}
      {/* HEADER                                                      */}
      {/* ========================================================== */}

      <header className="border-b border-white/[0.08] bg-[#0D1016]">

        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-2.5">

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

            <span className="ml-2 font-mono text-[11.5px] uppercase tracking-wide text-white/30 hidden sm:inline">
              Patient Results
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium ${ktas.ring} ${ktas.bg} ${ktas.text}`}
            >

              <span
                className={`h-1.5 w-1.5 rounded-full ${ktas.dot}`}
              />

              KTAS {prediction.ktas_level}

            </span>

            {prediction.category && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7C8CF5]/25 bg-[#7C8CF5]/[0.08] px-3 py-1.5 text-[12px] font-medium text-[#AAB4FF]">

                <Stethoscope
                  size={12}
                  strokeWidth={2}
                />

                {prediction.category}

              </span>
            )}

          </div>

        </div>

      </header>

      {/* ========================================================== */}
      {/* MAIN                                                        */}
      {/* ========================================================== */}

      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-10">

        {/* ======================================================== */}
        {/* INTRO                                                     */}
        {/* ======================================================== */}

        <motion.div
          {...fadeUp}
          className="mb-8 max-w-3xl"
        >

          <div className="flex items-center gap-2.5 mb-3">

            <Sparkles
              size={14}
              className="text-[#FF5A36]"
              strokeWidth={2}
            />

            <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/30">
              AI Recommendation
            </span>

          </div>

          <h1 className="font-display font-semibold text-[clamp(1.6rem,3vw,2.1rem)] tracking-tightest text-white text-balance">
            Here's where to go.
          </h1>

          <p className="text-[15px] text-white/45 mt-2 max-w-lg">
            Based on your assessment, LifeRoute matched you to the hospital
            best equipped to treat you right now.
          </p>

        </motion.div>

        {/* ======================================================== */}
        {/* HERO RECOMMENDATION                                      */}
        {/* ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
            amount: 0.3,
          }}

          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}

          whileHover={{
            y: -3,
          }}

          className="relative rounded-3xl border border-[#FF5A36]/25 bg-[#11151D] overflow-hidden mb-6 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.75)]"
        >

          <svg
            viewBox="0 0 600 200"
            className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none"
            fill="none"
            aria-hidden="true"
          >

            <path
              d="M20,170 C160,170 200,40 320,40 C440,40 480,150 580,150"
              stroke="#FF5A36"
              strokeWidth="2"
              strokeLinecap="round"
            />

          </svg>

          <div className="relative flex items-center justify-between px-6 sm:px-8 pt-6">

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5A36]/[0.10] text-[#FF7A5C] px-3 py-1 text-[12px] font-medium">

              <ShieldCheck
                size={12}
                strokeWidth={2}
              />

              Recommended For You

            </span>

            <span className="font-mono text-[12px] text-white/30">
              Match score{" "}
              {Number(
                hospital?.score ?? 0
              ).toFixed(1)}
            </span>

          </div>

          <div className="relative px-6 sm:px-8 pt-5 pb-7">

            <div className="flex items-start gap-3.5 mb-6">

              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#FF5A36]/[0.10] border border-[#FF5A36]/25 shrink-0">

                <Building2
                  size={20}
                  strokeWidth={1.75}
                  className="text-[#FF7A5C]"
                />

              </div>

              <div>

                <h2 className="font-display font-semibold text-[20px] sm:text-[22px] text-white tracking-tightest leading-tight">
                  {hospitalName}
                </h2>

                <p className="text-[13.5px] text-white/30 mt-0.5">
                  Best overall fit for your assessment
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">

              <div className="rounded-xl border border-[#FF5A36]/20 bg-[#FF5A36]/[0.05] p-4">

                <div className="flex items-center gap-1.5 text-[#FF7A5C] mb-1.5">

                  <Activity size={13} />

                  <span className="font-mono text-[10px] uppercase tracking-wide">
                    Score
                  </span>

                </div>

                <div className="font-display font-semibold text-[18px] sm:text-[20px] text-white tracking-tightest">
                  {Number(
                    hospital?.score ?? 0
                  ).toFixed(1)}
                </div>

              </div>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">

                <div className="flex items-center gap-1.5 text-white/35 mb-1.5">

                  <Clock3 size={13} />

                  <span className="font-mono text-[10px] uppercase tracking-wide">
                    ETA
                  </span>

                </div>

                <div className="font-display font-semibold text-[18px] sm:text-[20px] text-white tracking-tightest">
                  {hospital?.eta ?? "N/A"} min
                </div>

              </div>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">

                <div className="flex items-center gap-1.5 text-white/35 mb-1.5">

                  <MapPin size={13} />

                  <span className="font-mono text-[10px] uppercase tracking-wide">
                    Distance
                  </span>

                </div>

                <div className="font-display font-semibold text-[18px] sm:text-[20px] text-white tracking-tightest">
                  {hospital?.distance_km != null
                    ? `${hospital.distance_km} km`
                    : "N/A"}
                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/patient/hospital")
              }
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5A36] px-8 py-4 text-[15px] font-medium text-white transition-all duration-300 hover:bg-[#FF6B4A] active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(255,90,54,0.55)]"
            >

              View Hospital Details

              <ChevronRight
                size={16}
                strokeWidth={2.25}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />

            </button>

          </div>

        </motion.div>

        {/* ======================================================== */}
        {/* SEVERITY                                                  */}
        {/* ======================================================== */}

        <Panel className="mb-6">

          <SectionLabel>
            Severity
          </SectionLabel>

          <div
            className={`flex items-center gap-3.5 rounded-xl border p-4 ${ktas.ring} ${ktas.bg}`}
          >

            <span
              className={`flex items-center justify-center h-10 w-10 rounded-full text-white font-display font-semibold text-[15px] ${ktas.dot}`}
            >
              {prediction.ktas_level}
            </span>

            <div>

              <div
                className={`font-display font-semibold text-[15.5px] tracking-tightest ${ktas.text}`}
              >
                {ktas.label}
              </div>

              <div className="text-[13px] text-white/30 mt-0.5">
                Determined from your reported symptoms and vitals
              </div>

            </div>

          </div>

        </Panel>

        {/* ======================================================== */}
        {/* REQUIRED RESOURCES                                       */}
        {/* ======================================================== */}

        <Panel className="mb-6">

          <SectionLabel>
            Required Resources
          </SectionLabel>

          <div className="flex flex-wrap gap-2">

            {(prediction.resources || []).map(
              (resource, i) => (

                <motion.span
                  key={resource}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.05,
                  }}
                  className="rounded-full border border-white/[0.1] bg-white/[0.035] px-3.5 py-1.5 text-[13px] text-white/55"
                >
                  {resource}
                </motion.span>

              )
            )}

          </div>

        </Panel>

        {/* ======================================================== */}
        {/* AVAILABLE / MISSING                                      */}
        {/* ======================================================== */}

        <div className="grid sm:grid-cols-2 gap-6 mb-6">

          <Panel>

            <SectionLabel>
              Available at {hospitalName}
            </SectionLabel>

            <div className="flex flex-col gap-2.5">

              {(hospital?.matched_resources || []).map(
                (resource, i) => (

                  <motion.div
                    key={resource}
                    initial={{
                      opacity: 0,
                      x: -8,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: i * 0.06,
                    }}
                    className="flex items-center gap-2.5 text-[13.5px] text-white/55"
                  >

                    <CheckCircle2
                      size={16}
                      strokeWidth={2}
                      className="text-emerald-400 shrink-0"
                    />

                    {resource}

                  </motion.div>

                )
              )}

            </div>

          </Panel>

          <Panel>

            <SectionLabel>
              Missing Resources
            </SectionLabel>

            {hasMissing ? (

              <div className="flex flex-col gap-2.5">

                {hospital.missing_resources.map(
                  (resource, i) => (

                    <motion.div
                      key={resource}
                      initial={{
                        opacity: 0,
                        x: -8,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.06,
                      }}
                      className="flex items-center gap-2.5 text-[13.5px] text-white/55"
                    >

                      <AlertTriangle
                        size={16}
                        strokeWidth={2}
                        className="text-orange-400 shrink-0"
                      />

                      {resource}

                    </motion.div>

                  )
                )}

              </div>

            ) : (

              <div className="flex items-center gap-2.5 text-[13.5px] text-emerald-400">

                <CheckCircle2
                  size={16}
                  strokeWidth={2}
                  className="shrink-0"
                />

                All required resources available

              </div>

            )}

          </Panel>

        </div>

        {/* ======================================================== */}
        {/* AI CLINICAL REASONS                                      */}
        {/* ======================================================== */}

        <Panel className="mb-8">

          <SectionLabel>
            AI Clinical Reasons
          </SectionLabel>

          <div className="relative flex flex-col gap-6 mt-1">

            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/[0.08]" />

            {(prediction.reasons || []).map(
              (reason, i) => (

                <motion.div
                  key={reason}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="relative flex items-start gap-4"
                >

                  <div className="relative z-10 flex items-center justify-center h-8 w-8 rounded-full border border-[#FF5A36]/30 bg-[#FF5A36]/[0.08] shrink-0">

                    <HeartPulse
                      size={14}
                      strokeWidth={1.75}
                      className="text-[#FF7A5C]"
                    />

                  </div>

                  <p className="text-[14px] leading-relaxed text-white/55 pt-1">
                    {reason}
                  </p>

                </motion.div>

              )
            )}

          </div>

        </Panel>

        {/* ======================================================== */}
        {/* ACTIONS                                                   */}
        {/* ======================================================== */}

        <div className="flex flex-col sm:flex-row gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/patient/hospital")
            }
            className="group flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5A36] px-8 py-4 text-[15px] font-medium text-white transition-all duration-300 hover:bg-[#FF6B4A] active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(255,90,54,0.55)]"
          >

            View Hospital Details

            <ChevronRight
              size={16}
              strokeWidth={2.25}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />

          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/patient/assessment")
            }
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.12] px-8 py-4 text-[15px] font-medium text-white/65 hover:border-white/20 hover:bg-white/[0.04] hover:text-white transition-all duration-300 active:scale-[0.98]"
          >

            <RotateCcw
              size={15}
              strokeWidth={2}
            />

            Start New Assessment

          </button>

        </div>

      </div>

    </div>
  );
}