import { useNavigate } from "react-router-dom";

export default function CarePlanPreview({
  latest,
  loading,
  usingRealData,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-white/30">
          Care Plan
        </p>

        <h2 className="text-lg font-semibold text-white mt-2">
          Today's Guidance
        </h2>

        <p className="text-sm text-white/40 mt-6">
          Preparing your care plan...
        </p>
      </section>
    );
  }

  if (!usingRealData || !latest) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-white/30">
          Care Plan
        </p>

        <h2 className="text-lg font-semibold text-white mt-2">
          Today's Guidance
        </h2>

        <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="text-sm font-medium text-white/70">
            Awaiting health data
          </p>

          <p className="text-sm text-white/40 mt-2">
            Your care guidance will appear once real vital readings are
            available.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/patient/dashboard/care-plan")}
          className="mt-5 text-sm text-orange-400 hover:text-orange-300"
        >
          View full care plan →
        </button>
      </section>
    );
  }

  const guidance = buildGuidance(latest);

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-white/30">
        Care Plan
      </p>

      <h2 className="text-lg font-semibold text-white mt-2">
        Today's Guidance
      </h2>

      <p className="text-sm text-white/40 mt-2">
        Based on your latest recorded vital readings.
      </p>

      <div className="mt-5 space-y-3">
        {guidance.map((item) => (
          <CareItem
            key={item}
            text={item}
          />
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
        <p className="text-xs uppercase tracking-wider text-white/30">
          Latest readings
        </p>

        <div className="grid grid-cols-3 gap-3 mt-3">
          <Reading
            label="Heart Rate"
            value={latest.heart_rate}
            unit="BPM"
          />

          <Reading
            label="SpO₂"
            value={latest.spo2}
            unit="%"
          />

          <Reading
            label="Temperature"
            value={latest.temperature}
            unit="°C"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/patient/dashboard/care-plan")}
        className="mt-5 text-sm text-orange-400 hover:text-orange-300"
      >
        View full care plan →
      </button>
    </section>
  );
}


function buildGuidance(latest) {
  const guidance = [];

  const heartRate = latest.heart_rate;
  const spo2 = latest.spo2;
  const temperature = latest.temperature;

  if (heartRate != null && heartRate > 100) {
    guidance.push(
      "Your heart rate is elevated. Continue monitoring your readings."
    );
  } else {
    guidance.push(
      "Continue monitoring your heart rate and other vital signs."
    );
  }

  if (spo2 != null && spo2 < 94) {
    guidance.push(
      "Your SpO₂ reading is below the current monitoring threshold."
    );
  } else {
    guidance.push(
      "Continue monitoring your SpO₂ readings."
    );
  }

  if (temperature != null && temperature > 37.5) {
    guidance.push(
      "Your temperature is elevated. Continue monitoring for changes."
    );
  } else {
    guidance.push(
      "Maintain regular rest and hydration."
    );
  }

  return guidance;
}


function CareItem({ text }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="mt-1 w-2 h-2 rounded-full bg-orange-400 shrink-0" />

      <p className="text-sm text-white/60">
        {text}
      </p>
    </div>
  );
}


function Reading({ label, value, unit }) {
  return (
    <div>
      <p className="text-[11px] text-white/30">
        {label}
      </p>

      <p className="text-sm font-medium text-white/70 mt-1">
        {value ?? "--"}{" "}
        <span className="text-xs text-white/30">
          {unit}
        </span>
      </p>
    </div>
  );
}