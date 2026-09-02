const instructions = [
  {
    number: "01",
    title: "Continue monitoring",
    text: "Keep your wearable device connected so LifeRoute can continue receiving health readings.",
  },
  {
    number: "02",
    title: "Review your readings",
    text: "Check your health trends regularly and pay attention to changes from your usual baseline.",
  },
  {
    number: "03",
    title: "Follow care-team guidance",
    text: "Follow any instructions provided by your healthcare team.",
  },
];

export default function CarePlan() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
          Personal Care
        </p>

        <h2 className="text-3xl font-semibold text-white mt-2">
          My Care Plan
        </h2>

        <p className="text-white/40 mt-2">
          Your monitoring instructions and recommended next steps.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] overflow-hidden">
        {instructions.map((item, index) => (
          <div
            key={item.number}
            className={`p-6 flex gap-5 ${
              index !== instructions.length - 1
                ? "border-b border-white/[0.06]"
                : ""
            }`}
          >
            <span className="text-xs text-orange-400 font-medium pt-1">
              {item.number}
            </span>

            <div>
              <h3 className="text-white font-medium">
                {item.title}
              </h3>

              <p className="text-sm text-white/40 mt-2 leading-6">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-white/35">
          Important
        </p>

        <p className="text-sm text-white/50 mt-3 leading-6">
          LifeRoute provides monitoring and routing assistance. It does not
          replace professional medical advice.
        </p>
      </div>
    </div>
  );
}