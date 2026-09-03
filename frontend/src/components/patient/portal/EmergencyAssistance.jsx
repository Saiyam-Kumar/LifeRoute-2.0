import { useNavigate } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

/**
 * Single responsibility: navigate into the EXISTING emergency workflow.
 * No new emergency logic lives here or anywhere in the portal.
 */
export default function EmergencyAssistance({ variant = "sidebar" }) {
  const navigate = useNavigate();
  const go = () => navigate("/patient/assessment");

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={go}
        className="group w-full flex items-center justify-between gap-4 rounded-2xl border border-[#FF5A36]/25 bg-[#FF5A36]/[0.06] px-6 py-5 text-left transition-all duration-300 hover:bg-[#FF5A36]/[0.1] active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-[#FF5A36]/15 border border-[#FF5A36]/30 shrink-0">
            <TriangleAlert size={18} strokeWidth={1.75} className="text-[#FF7A5C]" />
          </div>
          <div>
            <div className="font-display font-semibold text-[15px] text-white tracking-tightest">
              Emergency Assistance
            </div>
            <div className="text-[13px] text-white/45 mt-0.5">
              Start an assessment and get routed immediately
            </div>
          </div>
        </div>
        <span className="font-mono text-[12px] text-[#FF7A5C] group-hover:translate-x-0.5 transition-transform duration-300 shrink-0">
          →
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={go}
      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5A36] px-4 py-3 text-[13.5px] font-medium text-white transition-all duration-300 hover:bg-[#ff6b4a] active:scale-[0.98]"
    >
      <TriangleAlert size={15} strokeWidth={2} />
      Emergency
    </button>
  );
}