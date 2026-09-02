import { useState } from "react";

export default function Telemedicine() {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const startConsultation = () => {
    setConnecting(true);

    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 1500);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
          Care Team
        </p>

        <h2 className="text-3xl font-semibold text-white mt-2">
          Telemedicine
        </h2>

        <p className="text-white/40 mt-2">
          Connect with your care team for a remote consultation.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
              Care Team
            </p>

            <h3 className="text-xl font-medium text-white mt-3">
              LifeRoute Care Team
            </h3>

            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />

              <span className="text-sm text-emerald-400">
                Available for consultation
              </span>
            </div>
          </div>

          <button
            onClick={startConsultation}
            disabled={connecting || connected}
            className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-400 disabled:opacity-60 transition"
          >
            {connected
              ? "Consultation Active"
              : connecting
              ? "Connecting..."
              : "Start Consultation →"}
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-white/35">
          Recent consultations
        </p>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <p className="text-sm text-white">
                Health review
              </p>
              <p className="text-xs text-white/30 mt-1">
                Recent monitoring review
              </p>
            </div>

            <span className="text-xs text-emerald-400">
              Completed
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">
                Follow-up consultation
              </p>
              <p className="text-xs text-white/30 mt-1">
                Care team follow-up
              </p>
            </div>

            <span className="text-xs text-orange-400">
              Scheduled
            </span>
          </div>
        </div>
      </div>

      {connected && (
        <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
          <p className="text-emerald-400 font-medium">
            Demo consultation connected
          </p>

          <p className="text-sm text-white/40 mt-2">
            Your care team connection is active for this demonstration.
          </p>
        </div>
      )}
    </div>
  );
}