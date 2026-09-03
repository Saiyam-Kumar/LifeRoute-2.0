import { deterioratingHealthData } from "../../../mock/healthData";

export default function HealthTrendsPreview() {
  const data = deterioratingHealthData;

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-white/30">
          Trends
        </p>

        <h2 className="text-lg font-semibold text-white mt-2">
          Recent Health Trends
        </h2>
      </div>

      <div className="mt-6 space-y-5">
        <Trend
          label="Heart Rate"
          values={data.map((item) => item.heart_rate)}
        />

        <Trend
          label="SpO₂"
          values={data.map((item) => item.spo2)}
        />

        <Trend
          label="Temperature"
          values={data.map((item) => item.temperature)}
        />
      </div>
    </section>
  );
}

function Trend({ label, values }) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-xs text-white/50">{label}</span>

        <span className="text-xs text-white/30">
          {values[0]} → {values[values.length - 1]}
        </span>
      </div>

      <div className="flex items-end gap-1 h-12">
        {values.map((value, index) => {
          const height =
            max === min
              ? 50
              : 15 + ((value - min) / (max - min)) * 85;

          return (
            <div
              key={index}
              className="flex-1 bg-orange-400/60 rounded-t"
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}