export default function CarePlanPreview() {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-white/30">
        Care Plan
      </p>

      <h2 className="text-lg font-semibold text-white mt-2">
        Today's Guidance
      </h2>

      <div className="mt-5 space-y-3">
        <CareItem text="Continue monitoring your vital signs." />
        <CareItem text="Stay hydrated and maintain adequate rest." />
        <CareItem text="Review any new health alerts." />
      </div>

      <button className="mt-5 text-sm text-orange-400 hover:text-orange-300">
        View full care plan →
      </button>
    </section>
  );
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