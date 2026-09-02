import useHealthData from "../../../hooks/useHealthData";

export default function Alerts() {
  const { stage, risk } = useHealthData();

  const alerts =
    stage === "normal"
      ? [
          {
            level: "NORMAL",
            title: "No active health alerts",
            message: "Your current health indicators are within the normal range.",
          },
        ]
      : stage === "deteriorating"
      ? [
          {
            level: "HIGH",
            title: "Health indicators changing",
            message: "Heart rate is increasing while SpO₂ is beginning to decline.",
          },
          {
            level: "MEDIUM",
            title: "Temperature increasing",
            message: "Temperature is trending upward and should continue to be monitored.",
          },
        ]
      : [
          {
            level: "CRITICAL",
            title: "Critical health risk detected",
            message: "SpO₂ is critically low and heart rate is elevated.",
          },
          {
            level: "CRITICAL",
            title: "Emergency escalation required",
            message: "The AI monitoring system recommends immediate LifeRoute emergency routing.",
          },
        ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
          Monitoring
        </p>

        <h2 className="text-3xl font-semibold text-white mt-2">
          Alerts
        </h2>

        <p className="text-white/40 mt-2">
          Health alerts generated from your current monitoring state.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-white/[0.08] bg-[#11151D] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
              Current risk
            </p>

            <p className="text-xl font-semibold text-white mt-2">
              {risk.level}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-white/35">Risk score</p>
            <p className="text-xl font-semibold text-orange-400 mt-1">
              {Math.round(risk.score * 100)}%
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6"
          >
            <div className="flex items-start gap-4">
              <span
                className={`mt-1 h-3 w-3 rounded-full shrink-0 ${
                  alert.level === "CRITICAL"
                    ? "bg-red-400"
                    : alert.level === "HIGH"
                    ? "bg-orange-400"
                    : alert.level === "MEDIUM"
                    ? "bg-yellow-400"
                    : "bg-emerald-400"
                }`}
              />

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-base font-medium text-white">
                    {alert.title}
                  </h3>

                  <span className="text-[10px] uppercase tracking-wider text-white/35">
                    {alert.level}
                  </span>
                </div>

                <p className="text-sm text-white/45 mt-2">
                  {alert.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}