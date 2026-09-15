import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useHealthData from "../../../hooks/useHealthData.js";
import {
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Thermometer,
  Droplets,
  TrendingUp,
} from "lucide-react";

function VitalCard({
  label,
  value,
  unit,
  status,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-5">

      <div className="flex items-center gap-2 text-white/40">

        <Icon
          size={14}
          strokeWidth={1.75}
        />

        <p className="text-[11px] uppercase tracking-[0.16em]">
          {label}
        </p>

      </div>

      <div className="flex items-end gap-2 mt-4">

        <span className="text-3xl font-semibold text-white">
          {value ?? "—"}
        </span>

        <span className="text-xs text-white/35 mb-1">
          {unit}
        </span>

      </div>

      <div className="flex items-center gap-2 mt-3">

        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />

        <span className="text-xs text-orange-400">
          {status}
        </span>

      </div>

    </div>
  );
}

function TrendRow({
  label,
  value,
  direction,
}) {
  const increasing =
    direction === "INCREASING";

  const decreasing =
    direction === "DECREASING";

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/[0.06] last:border-0">

      <span className="text-[13px] text-white/55">
        {label}
      </span>

      <div className="flex items-center gap-2">

        <span className="text-[13px] text-white/70">
          {value ?? "—"}
        </span>

        <span
          className={`text-[11px] font-mono ${
            increasing
              ? "text-red-300"
              : decreasing
                ? "text-amber-300"
                : "text-emerald-300"
          }`}
        >
          {direction || "STABLE"}
        </span>

      </div>

    </div>
  );
}

function AlertsPanel({ alerts }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6 sm:p-8 h-full">

      <span className="font-mono text-[11px] uppercase tracking-wide text-white/30 block mb-4">
        Alerts
      </span>

      {alerts?.length > 0 ? (

        <div className="flex flex-col gap-3">

          {alerts.map((alert, index) => (

            <div
              key={alert.id ?? index}
              className="rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3"
            >

              <div className="flex items-start gap-2.5">

                <AlertTriangle
                  size={14}
                  strokeWidth={1.75}
                  className="shrink-0 mt-0.5 text-red-300"
                />

                <span className="text-[13px] leading-snug text-red-200/80">
                  {alert.message || "Health alert detected"}
                </span>

              </div>

              {alert.timestamp && (

                <div className="flex items-center gap-1.5 mt-2 opacity-50">

                  <Clock3 size={11} />

                  <span className="font-mono text-[10.5px]">
                    {alert.timestamp}
                  </span>

                </div>

              )}

            </div>

          ))}

        </div>

      ) : (

        <div className="flex items-center gap-2.5 text-[13.5px] text-white/40">

          <CheckCircle2
            size={15}
            strokeWidth={1.75}
            className="text-emerald-400"
          />

          No active alerts

        </div>

      )}

    </section>
  );
}

function CarePlanPreview() {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6 sm:p-8 h-full">

      <span className="font-mono text-[11px] uppercase tracking-wide text-white/30 block mb-4">
        Care Plan
      </span>

      <div className="flex flex-col gap-4">

        <div className="flex items-start gap-3">

          <CheckCircle2
            size={16}
            className="text-emerald-400 shrink-0 mt-0.5"
          />

          <div>

            <p className="text-[13.5px] text-white/65">
              Continue regular monitoring
            </p>

            <p className="text-[11.5px] text-white/30 mt-1">
              LifeRoute is watching for meaningful changes in your readings.
            </p>

          </div>

        </div>

        <div className="flex items-start gap-3">

          <Activity
            size={16}
            className="text-[#FF7A5C] shrink-0 mt-0.5"
          />

          <div>

            <p className="text-[13.5px] text-white/65">
              Review your health trends
            </p>

            <p className="text-[11.5px] text-white/30 mt-1">
              Look for persistent changes rather than isolated readings.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default function Overview() {

  const [stage, setStage] = useState("normal");

  const {
    latest,
    risk,
  } = useHealthData(stage);

  const navigate = useNavigate();

  /*
   * Fallback because the current mock hook supports
   * normal / deteriorating / critical monitoring states.
   */
  const current =
    latest || {};

  const isCritical =
    risk?.level === "CRITICAL" ||
    stage === "critical";

  const riskLevel =
    risk?.level || "NORMAL";

  const riskScore =
    risk?.score != null
      ? Math.round(risk.score * 100)
      : 0;

  const goToAssessment = () => {

    /*
     * THIS is the important part.
     *
     * We send the currently displayed monitoring vitals
     * to the existing emergency assessment.
     */
    navigate(
      "/patient/assessment",
      {
        state: {
          fromPatientPortal: true,
          vitals: current,
        },
      }
    );
  };

  if (!current) {
    return (
      <div className="text-white">
        No health data available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ======================================================== */}
      {/* INTRO                                                     */}
      {/* ======================================================== */}

      <div className="flex items-center justify-between flex-wrap gap-4">

        <div>

          <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
            Personal Health
          </p>

          <h2 className="text-3xl font-semibold text-white mt-2">
            Your Health Overview
          </h2>

          <p className="text-white/40 mt-2">
            Monitor your health and stay connected with your care team.
          </p>

        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-1.5">

          <span className="relative flex h-2 w-2">

            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50 animate-ping" />

            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />

          </span>

          <span className="font-mono text-[10px] uppercase tracking-wide text-emerald-300">
            Monitoring Active
          </span>

        </div>

      </div>

      {/* ======================================================== */}
      {/* DEMO CONTROLS                                             */}
      {/* ======================================================== */}

      <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-5">

        <p className="text-xs uppercase tracking-[0.16em] text-white/35">
          Demo Monitoring Mode
        </p>

        <p className="text-sm text-white/50 mt-1">
          Simulate the patient's health journey for the LifeRoute demo.
        </p>

        <div className="flex flex-wrap gap-2 mt-5">

          {[
            "normal",
            "deteriorating",
            "critical",
          ].map((mode) => (

            <button
              key={mode}
              type="button"
              onClick={() => setStage(mode)}
              className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition ${
                stage === mode
                  ? "bg-[#FF5A36] text-white border border-[#FF5A36]/30"
                  : "bg-white/[0.04] text-white/40 border border-white/[0.08] hover:text-white/70"
              }`}
            >
              {mode}
            </button>

          ))}

        </div>

      </div>

      {/* ======================================================== */}
      {/* CURRENT VITALS                                            */}
      {/* ======================================================== */}

      <div>

        <div className="flex items-center justify-between mb-3">

          <div>

            <p className="font-mono text-[11px] uppercase tracking-wide text-white/30">
              Current Health
            </p>

            <p className="text-[12px] text-white/25 mt-1">
              Latest monitored readings
            </p>

          </div>

          <span className="font-mono text-[10px] text-white/25">
            LIVE
          </span>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

          <VitalCard
            icon={HeartPulse}
            label="Heart Rate"
            value={current.heart_rate}
            unit="bpm"
            status={
              stage === "critical"
                ? "Elevated"
                : stage === "deteriorating"
                  ? "Increasing"
                  : "Stable"
            }
          />

          <VitalCard
            icon={Droplets}
            label="SpO₂"
            value={current.spo2}
            unit="%"
            status={
              stage === "critical"
                ? "Critical"
                : stage === "deteriorating"
                  ? "Declining"
                  : "Stable"
            }
          />

          <VitalCard
            icon={Thermometer}
            label="Temperature"
            value={current.temperature}
            unit="°C"
            status={
              stage === "critical"
                ? "Elevated"
                : stage === "deteriorating"
                  ? "Increasing"
                  : "Stable"
            }
          />

          <VitalCard
            icon={Activity}
            label="Activity"
            value={current.activity}
            unit=""
            status={
              stage === "critical"
                ? "Low"
                : stage === "deteriorating"
                  ? "Decreasing"
                  : "Normal"
            }
          />

        </div>

      </div>

      {/* ======================================================== */}
      {/* AI HEALTH STATUS                                          */}
      {/* ======================================================== */}

      <section
        className={`rounded-3xl border overflow-hidden ${
          isCritical
            ? "border-red-400/30 bg-red-400/[0.05]"
            : stage === "deteriorating"
              ? "border-amber-400/25 bg-amber-400/[0.04]"
              : "border-[#FF5A36]/20 bg-[#11151D]"
        }`}
      >

        <div className="p-6 sm:p-8">

          <div className="flex items-center justify-between flex-wrap gap-3">

            <div className="flex items-center gap-2">

              <TrendingUp
                size={15}
                className="text-[#FF7A5C]"
              />

              <span className="font-mono text-[11px] uppercase tracking-wide text-white/30">
                AI Health Status
              </span>

            </div>

            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                isCritical
                  ? "border-red-400/25 bg-red-400/[0.08] text-red-300"
                  : stage === "deteriorating"
                    ? "border-amber-400/25 bg-amber-400/[0.08] text-amber-300"
                    : "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-300"
              }`}
            >
              {riskLevel}
            </span>

          </div>

          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-8 mt-7">

            <div>

              <p className="text-[12px] uppercase tracking-[0.14em] text-white/30">
                Risk Score
              </p>

              <div className="flex items-end gap-2 mt-2">

                <span className="text-5xl font-semibold text-white">
                  {riskScore}
                </span>

                <span className="text-sm text-white/30 mb-2">
                  / 100
                </span>

              </div>

              <p className="text-[12px] text-white/30 mt-3">
                Based on current monitoring data and observed trends.
              </p>

            </div>

            <div>

              <p className="text-[12px] uppercase tracking-[0.14em] text-white/30 mb-3">
                Why LifeRoute is flagging this
              </p>

              <div className="flex flex-col gap-2.5">

                {(risk?.reasons || []).length > 0 ? (

                  risk.reasons.map(
                    (reason, index) => (

                      <div
                        key={index}
                        className="flex items-start gap-2.5"
                      >

                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A36] mt-1.5 shrink-0" />

                        <p className="text-[13px] text-white/55">
                          {reason}
                        </p>

                      </div>

                    )
                  )

                ) : (

                  <p className="text-[13px] text-white/35">
                    No concerning changes detected in the current demo state.
                  </p>

                )}

              </div>

            </div>

          </div>

          {/* CRITICAL CTA */}

          {isCritical && (

            <div className="mt-7 pt-6 border-t border-red-400/10">

              <p className="text-[13px] text-red-200/70">
                Your monitoring data indicates a significant change.
                Complete the emergency assessment so LifeRoute can
                evaluate the situation using the existing routing engine.
              </p>

              <button
                type="button"
                onClick={goToAssessment}
                className="mt-5 rounded-xl bg-[#FF5A36] px-5 py-3 text-sm font-medium text-white hover:bg-[#FF6B4A] transition shadow-[0_8px_24px_-8px_rgba(255,90,54,0.55)]"
              >
                Start Emergency Assistance →
              </button>

            </div>

          )}

        </div>

      </section>

      {/* ======================================================== */}
      {/* TRENDS                                                    */}
      {/* ======================================================== */}

      <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6 sm:p-8">

        <div className="flex items-center justify-between mb-5">

          <div>

            <span className="font-mono text-[11px] uppercase tracking-wide text-white/30">
              Health Trends
            </span>

            <p className="text-[12px] text-white/25 mt-1">
              Direction of the monitored readings
            </p>

          </div>

        </div>

        <div>

          <TrendRow
            label="Heart rate"
            value={current.heart_rate}
            direction={
              stage === "critical"
                ? "INCREASING"
                : stage === "deteriorating"
                  ? "INCREASING"
                  : "STABLE"
            }
          />

          <TrendRow
            label="SpO₂"
            value={current.spo2}
            direction={
              stage === "critical"
                ? "DECREASING"
                : stage === "deteriorating"
                  ? "DECREASING"
                  : "STABLE"
            }
          />

          <TrendRow
            label="Temperature"
            value={current.temperature}
            direction={
              stage === "critical"
                ? "INCREASING"
                : stage === "deteriorating"
                  ? "INCREASING"
                  : "STABLE"
            }
          />

          <TrendRow
            label="Activity"
            value={current.activity}
            direction={
              stage === "critical"
                ? "DECREASING"
                : stage === "deteriorating"
                  ? "DECREASING"
                  : "STABLE"
            }
          />

        </div>

      </section>

      {/* ======================================================== */}
      {/* ALERTS + CARE PLAN                                        */}
      {/* ======================================================== */}

      <div className="grid md:grid-cols-2 gap-6">

        <AlertsPanel
          alerts={
            isCritical
              ? [
                  {
                    id: "critical-vitals",
                    message:
                      "Critical change detected in monitored vitals.",
                    status: "ACTIVE",
                  },
                ]
              : stage === "deteriorating"
                ? [
                    {
                      id: "deterioration",
                      message:
                        "Health readings are trending away from baseline.",
                      status: "WATCH",
                    },
                  ]
                : []
          }
        />

        <CarePlanPreview />

      </div>

      {/* ======================================================== */}
      {/* EMERGENCY ACCESS                                          */}
      {/* ======================================================== */}

      <section className="rounded-2xl border border-[#FF5A36]/20 bg-[#FF5A36]/[0.04] p-5 sm:p-6">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div>

            <p className="text-[13.5px] font-medium text-white/75">
              Need emergency assistance?
            </p>

            <p className="text-[12px] text-white/35 mt-1">
              Start the existing LifeRoute emergency assessment.
              Your monitoring data will be used when available.
            </p>

          </div>

          <button
            type="button"
            onClick={goToAssessment}
            className="shrink-0 rounded-xl bg-[#FF5A36] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#FF6B4A] transition"
          >
            Continue to Assessment
          </button>

        </div>

      </section>

      <p className="text-center text-[11px] text-white/20 pb-4">
        LifeRoute supports emergency routing decisions. It does not diagnose or treat.
      </p>

    </div>
  );
}