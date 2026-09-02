import { deterioratingHealthData } from "../../../mock/healthData";

export default function AIHealthStatus() {
  const latest =
    deterioratingHealthData[deterioratingHealthData.length - 1];

  const previous =
    deterioratingHealthData[deterioratingHealthData.length - 2];

  const reasons = [];

  if (latest.spo2 < 94) reasons.push("SpO₂ is below the safe range");
  if (latest.spo2 < previous.spo2) reasons.push("SpO₂ is declining");
  if (latest.heart_rate > 100) reasons.push("Heart rate is elevated");
  if (latest.heart_rate > previous.heart_rate)
    reasons.push("Heart rate is increasing");
  if (latest.activity < 0.25)
    reasons.push("Activity level is unusually low");

  return (
    <section className="rounded-2xl border border-orange-400/20 bg-[#11151D] p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-orange-400">
            LifeRoute AI
          </p>

          <h2 className="text-2xl font-semibold text-white mt-2">
            Health Risk Assessment
          </h2>

          <p className="text-sm text-white/40 mt-2">
            Your recent readings are being continuously analysed for
            changes and unusual patterns.
          </p>
        </div>

        <div className="rounded-xl border border-orange-400/20 bg-orange-400/5 px-5 py-4 text-center">
          <p className="text-xs text-white/40">Risk Score</p>
          <p className="text-3xl font-semibold text-orange-400 mt-1">
            0.90
          </p>
          <p className="text-xs text-orange-400 mt-1">
            CRITICAL
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider">
            What LifeRoute detected
          </p>

          <ul className="mt-3 space-y-2">
            {reasons.map((reason) => (
              <li
                key={reason}
                className="text-sm text-white/70 flex gap-2"
              >
                <span className="text-orange-400">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider">
            Recommended action
          </p>

          <div className="mt-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4">
            <p className="text-sm font-medium text-red-300">
              Emergency escalation
            </p>

            <p className="text-xs text-white/40 mt-2">
              Your readings indicate a critical pattern that may require
              immediate medical attention.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}