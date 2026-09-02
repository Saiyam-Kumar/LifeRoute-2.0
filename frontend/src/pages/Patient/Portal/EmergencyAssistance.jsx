import { useNavigate } from "react-router-dom";

export default function EmergencyAssistance() {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-white">
          Need emergency assistance?
        </p>

        <p className="text-xs text-white/40 mt-1">
          Start the existing LifeRoute emergency assessment.
        </p>
      </div>

      <button
        onClick={() => navigate("/patient/assessment")}
        className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-400 transition"
      >
        Start Emergency Assessment
      </button>
    </section>
  );
}