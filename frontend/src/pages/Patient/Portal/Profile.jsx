import { useAuth } from "../../../context/AuthContext";

export default function Profile() {
  const { user, profile } = useAuth();

  const name =
    profile?.name ||
    profile?.full_name ||
    user?.displayName ||
    "Patient";

  const email = profile?.email || user?.email || "Not available";

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
          Account
        </p>

        <h2 className="text-3xl font-semibold text-white mt-2">
          Profile
        </h2>

        <p className="text-white/40 mt-2">
          Manage your LifeRoute patient information.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-7">
        <div className="flex items-center gap-5 pb-7 border-b border-white/[0.06]">
          <div className="w-16 h-16 rounded-full bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
            <span className="text-xl font-semibold text-orange-400">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-medium text-white">{name}</h3>
            <p className="text-sm text-white/40 mt-1">{email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-7">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Name
            </p>
            <p className="text-sm text-white mt-2">{name}</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Email
            </p>
            <p className="text-sm text-white mt-2">{email}</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Account Type
            </p>
            <p className="text-sm text-white mt-2">Patient</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Monitoring
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-sm text-emerald-400">Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-wider text-white/30">
          LifeRoute
        </p>

        <p className="text-sm text-white/45 mt-3">
          Your health information is used to support continuous monitoring,
          risk assessment, and emergency care coordination.
        </p>
      </div>
    </div>
  );
}