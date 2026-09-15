export default function AIHealthStatus({
  latest,
  risk,
  loading,
  usingRealData,
}) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">
          LifeRoute AI
        </p>

        <h2 className="text-2xl font-semibold text-white mt-2">
          Health Risk Assessment
        </h2>

        <p className="text-sm text-white/40 mt-2">
          Loading your latest health readings...
        </p>
      </section>
    );
  }

  if (!usingRealData || !latest) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">
          LifeRoute AI
        </p>

        <h2 className="text-2xl font-semibold text-white mt-2">
          Health Risk Assessment
        </h2>

        <p className="text-sm text-white/40 mt-2">
          Your health status will appear here once real vital readings are
          available.
        </p>

        <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="text-sm font-medium text-white/70">
            Awaiting health data
          </p>

          <p className="text-xs text-white/40 mt-2">
            Connect your wearable or record a health reading to begin
            monitoring.
          </p>
        </div>
      </section>
    );
  }

  const reasons = risk?.reasons || [];

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/40">
            LifeRoute AI
          </p>

          <h2 className="text-2xl font-semibold text-white mt-2">
            Health Risk Assessment
          </h2>

          <p className="text-sm text-white/40 mt-2">
            Your latest recorded vital signs are being monitored for changes
            and unusual patterns.
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 text-center">
          <p className="text-xs text-white/40">
            Status
          </p>

          <p className="text-2xl font-semibold text-white mt-1">
            {risk?.label || "Monitoring"}
          </p>

          <p className="text-xs text-white/40 mt-1">
            Based on latest recorded vitals
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider">
            What LifeRoute detected
          </p>

          <ul className="mt-3 space-y-2">
            {reasons.length > 0 ? (
              reasons.map((reason) => (
                <li
                  key={reason}
                  className="text-sm text-white/70 flex gap-2"
                >
                  <span className="text-white/40">•</span>
                  {reason}
                </li>
              ))
            ) : (
              <li className="text-sm text-white/40">
                No additional observations available.
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider">
            Current monitoring
          </p>

          <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <p className="text-sm font-medium text-white/80">
              Continue monitoring
            </p>

            <p className="text-xs text-white/40 mt-2">
              LifeRoute is using your latest recorded vital signs. This
              dashboard is for monitoring and does not replace professional
              medical assessment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}