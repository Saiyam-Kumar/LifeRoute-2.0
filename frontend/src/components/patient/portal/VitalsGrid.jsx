import { deterioratingHealthData } from "../../../mock/healthData";

export default function VitalsGrid() {
  const latest = deterioratingHealthData[deterioratingHealthData.length - 1];

  const vitals = [
    {
      label: "Heart Rate",
      value: latest.heart_rate,
      unit: "BPM",
      status: latest.heart_rate > 100 ? "Elevated" : "Normal",
    },
    {
      label: "SpO₂",
      value: latest.spo2,
      unit: "%",
      status: latest.spo2 < 94 ? "Low" : "Normal",
    },
    {
      label: "Temperature",
      value: latest.temperature,
      unit: "°C",
      status: latest.temperature > 37.5 ? "Elevated" : "Normal",
    },
    {
      label: "Activity",
      value: latest.activity,
      unit: "level",
      status: latest.activity < 0.25 ? "Low" : "Normal",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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