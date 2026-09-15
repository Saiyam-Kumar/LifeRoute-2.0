import useHealthData from "../../hooks/useHealthData";

export default function CarePlan() {
  const healthData = useHealthData();

  const {
    latest,
    loading,
    usingRealData,
  } = healthData;

  if (loading) {
    return (
      <div className="space-y-6">
        <Header />

        <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
          <p className="text-sm text-white/40">
            Preparing your care plan...
          </p>
        </section>
      </div>
    );
  }

  if (!usingRealData || !latest) {
    return (
      <div className="space-y-6">
        <Header />

        <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
          <h2 className="text-lg font-semibold text-white">
            Awaiting health data
          </h2>

          <p className="text-sm text-white/40 mt-2">
            Your care guidance will appear once real vital readings are
            available.
          </p>
        </section>
      </div>
    );
  }

  const guidance = buildGuidance(latest);

  return (
    <div className="space-y-6">
      <Header />

      <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-white/30">
          Current Monitoring
        </p>

        <h2 className="text-xl font-semibold text-white mt-2">
          Latest Recorded Vitals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
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
            label="Activity"
            value={latest.activity}
            unit="level"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-white/30">
          Guidance
        </p>

        <h2 className="text-xl font-semibold text-white mt-2">
          Today's Care Guidance
        </h2>

        <div className="mt-6 space-y-4">
          {guidance.map((item) => (
            <div
              key={item}
              className="flex gap-3 items-start rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <span className="mt-1.5 w-2 h-2 rounded-full bg-orange-400 shrink-0" />

              <p className="text-sm text-white/70">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-white/30">
          Important
        </p>

        <p className="text-sm text-white/50 mt-3">
          This care plan provides monitoring guidance based on recorded vital
          readings. It does not replace professional medical assessment.
        </p>
      </section>
    </div>
  );
}

function Header() {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-white/40">
        My Care Plan
      </p>

      <h1 className="text-2xl font-semibold text-white mt-2">
        Your Care Plan
      </h1>

      <p className="text-white/50 mt-2">
        Monitoring guidance based on your latest recorded health data.
      </p>
    </div>
  );
}

function buildGuidance(latest) {
  const guidance = [];

  const heartRate = latest.heart_rate;
  const spo2 = latest.spo2;
  const activity = latest.activity;

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

  if (activity != null && activity < 0.25) {
    guidance.push(
      "Your activity level is currently low. Maintain regular movement as appropriate."
    );
  } else {
    guidance.push(
      "Maintain regular rest and normal activity as appropriate."
    );
  }

  return guidance;
}

function Reading({ label, value, unit }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <p className="text-xs text-white/30">
        {label}
      </p>

      <p className="text-xl font-semibold text-white mt-2">
        {value ?? "--"}
      </p>

      <p className="text-xs text-white/30 mt-1">
        {unit}
      </p>
    </div>
  );
}