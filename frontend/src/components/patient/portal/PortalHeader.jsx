import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { User } from "lucide-react";

export default function PortalHeader() {
  const navigate = useNavigate();
  const { profile, user } = useAuth() || {};

  const displayName =
  profile?.full_name ||
  profile?.name ||
  profile?.firstName ||
  user?.email?.split("@")[0] ||
  "there";

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0B0D12]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">
            LifeRoute
          </p>
          <h1 className="font-display font-semibold text-[16.5px] sm:text-[18px] text-white tracking-tightest truncate">
            Welcome back, {displayName}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wide text-emerald-300">
              Monitoring Active
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/patient/dashboard/profile")}
            aria-label="Profile"
            className="flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <User size={16} strokeWidth={1.75} className="text-white/70" />
          </button>
        </div>
      </div>
    </header>
  );
}