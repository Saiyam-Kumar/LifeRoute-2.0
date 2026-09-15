export default function VitalsGrid({ latest, loading, usingRealData }) {
  if (loading) {
    return (
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-5"
            >
              <p className="text-xs text-white/40 uppercase tracking-wider">
                Loading
              </p>

              <div className="mt-4 text-white/40">
                Loading...
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!latest || !usingRealData) {
    return (
      <section>
        <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
          <p className="text-xs text-white/40 uppercase tracking-wider">
            Live Vitals
          </p>

          <p className="text-white/60 mt-3">
            No vital readings available yet.
          </p>

          <p className="text-sm text-white/30 mt-1">
            Connect your wearable or record a health reading to see your
            latest vitals here.
          </p>
        </div>
      </section>
    );
  }

  const vitals = [
    {
      label: "Heart Rate",
      value: latest.heart_rate ?? "--",
      unit: "BPM",
      status:
        latest.heart_rate > 100
          ? "Elevated"
          : "Normal",
    },
    {
      label: "SpO₂",
      value: latest.spo2 ?? "--",
      unit: "%",
      status:
        latest.spo2 < 94
          ? "Low"
          : "Normal",
    },
    {
      label: "Activity",
      value: latest.activity ?? "--",
      unit: "level",
      status:
        latest.activity < 0.25
          ? "Low"
          : "Normal",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vitals.map((vital) => (
          <div
            key={vital.label}
            className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-5"
          >
            <p className="text-xs text-white/40 uppercase tracking-wider">
              {vital.label}
            </p>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-3xl font-semibold text-white">
                {vital.value}
              </span>

              <span className="text-xs text-white/40 mb-1">
                {vital.unit}
              </span>
            </div>

            <p
              className={`text-xs mt-3 ${
                vital.status === "Normal"
                  ? "text-green-400"
                  : "text-orange-400"
              }`}
            >
              ● {vital.status}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}