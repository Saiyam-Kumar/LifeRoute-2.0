import useHealthData from "../../../hooks/useHealthData";

function TrendChart({ title, data, field, unit }) {
  const values = data.map((item) => item[field]);

  const min = Math.min(...values);
  const max = Math.max(...values);

  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x =
        values.length === 1
          ? 50
          : (index / (values.length - 1)) * 100;

      const y = 90 - ((value - min) / range) * 70;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-white">
            {title}
          </p>

          <p className="text-xs text-white/35 mt-1">
            Recent readings
          </p>
        </div>

        <span className="text-xs text-white/40">
          {unit}
        </span>
      </div>

      <div className="h-48 w-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <line
            x1="0"
            y1="90"
            x2="100"
            y2="90"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />

          <line
            x1="0"
            y1="55"
            x2="100"
            y2="55"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />

          <line
            x1="0"
            y1="20"
            x2="100"
            y2="20"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />

          <polyline
            points={points}
            fill="none"
            stroke="#FF5A36"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {values.map((value, index) => {
            const x =
              values.length === 1
                ? 50
                : (index / (values.length - 1)) * 100;

            const y =
              90 - ((value - min) / range) * 70;

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.8"
                fill="#FF5A36"
              />
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between mt-4 text-[10px] text-white/25">
        {data.map((item, index) => (
          <span key={index}>
            {new Date(item.timestamp).getHours()}:00
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HealthTrends() {
  const { data } = useHealthData();

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
          Personal Health
        </p>

        <h2 className="text-3xl font-semibold text-white mt-2">
          Health Trends
        </h2>

        <p className="text-white/40 mt-2">
          See how your health readings have changed over time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TrendChart
          title="Heart Rate"
          data={data}
          field="heart_rate"
          unit="BPM"
        />

        <TrendChart
          title="SpO₂"
          data={data}
          field="spo2"
          unit="%"
        />

        <TrendChart
          title="Temperature"
          data={data}
          field="temperature"
          unit="°C"
        />

        <TrendChart
          title="Activity"
          data={data}
          field="activity"
          unit="level"
        />
      </div>
    </div>
  );
}