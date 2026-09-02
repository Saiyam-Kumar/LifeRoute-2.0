import useHealthData from "../../../hooks/useHealthData";

function VitalCard({ label, value, unit, status }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
        {label}
      </p>

      <div className="flex items-end gap-2 mt-4">
        <span className="text-4xl font-semibold text-white">
          {value}
        </span>

        <span className="text-sm text-white/40 mb-1">
          {unit}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        <span className="text-xs text-orange-400">
          {status}
        </span>
      </div>
    </div>
  );
}

export default function MyHealth() {
  const { latest } = useHealthData();

  if (!latest) {
    return (
      <div className="text-white">
        No health data available.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
          Personal Health
        </p>

        <h2 className="text-3xl font-semibold text-white mt-2">
          My Health
        </h2>

        <p className="text-white/40 mt-2">
          Your latest health readings and monitoring status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <VitalCard
          label="Heart Rate"
          value={latest.heart_rate}
          unit="BPM"
          status="Elevated"
        />

        <VitalCard
          label="SpO₂"
          value={latest.spo2}
          unit="%"
          status="Low"
        />

        <VitalCard
          label="Temperature"
          value={latest.temperature}
          unit="°C"
          status="Elevated"
        />

        <VitalCard
          label="Activity"
          value={latest.activity}
          unit="level"
          status="Low"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-white/40">
          Monitoring
        </p>

        <div className="flex items-center gap-3 mt-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />

          <span className="text-white text-sm">
            Wearable monitoring active
          </span>
        </div>

        <p className="text-xs text-white/35 mt-3">
          Latest reading:{" "}
          {new Date(latest.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}