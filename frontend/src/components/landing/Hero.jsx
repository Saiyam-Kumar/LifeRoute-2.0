import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../common/Button";
import ECGBackground from "./ECGBackground";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#0B0D12] pt-36 pb-24 lg:pt-40 lg:pb-32">
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 8% 20%, rgba(74,88,180,.14), transparent 38%), radial-gradient(circle at 88% 78%, rgba(255,90,54,.08), transparent 38%)",
        }}
      />

      {/* ECG background */}
      <ECGBackground />

      {/* Keeps the ECG atmospheric rather than dominant */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#0B0D12]/10" />

      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] xl:gap-20">

          {/* LEFT — HERO CONTENT */}
          <div className="relative max-w-2xl">

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 backdrop-blur-sm"
            >
              <span className="h-2 w-2 rounded-full bg-route shadow-[0_0_12px_rgba(255,90,54,0.5)]" />

              <span className="font-mono text-xs text-white/65">
                Live hospital capacity, not a guess
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.05,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display text-[clamp(3.2rem,5.4vw,5.7rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white"
            >
              <span className="text-white">
                The Right Care.
              </span>

              <br />

              <span className="text-white/90">
                At The Right Time.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-7 max-w-xl text-base leading-8 text-white/65 md:text-lg"
            >
              LifeRoute reads your symptoms, checks live hospital capacity,
              specialist availability, and travel time before recommending
              the hospital most capable of treating your emergency.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.25,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Button
                variant="primary"
                onClick={() => navigate("/patient/assessment")}
              >
                Start Emergency Assessment
              </Button>

              <Button
                variant="secondary-dark"
                icon={false}
                as="a"
                href="#how-it-works"
              >
                See How It Works
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.45,
                duration: 0.7,
              }}
              className="mt-10 flex items-center gap-3 text-[12px] text-white/40"
            >
              <span className="h-px w-8 bg-white/15" />

              <span>
                AI-assisted emergency routing
              </span>
            </motion.div>

          </div>

          {/* RIGHT — AI RECOMMENDATION */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative lg:justify-self-end"
          >

            {/* Ambient glow */}
            <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[#4A58B4]/[0.05] blur-3xl" />

            <div
              className="
                relative
                w-full
                max-w-[560px]
                overflow-hidden
                rounded-[26px]
                border border-white/[0.10]
                bg-[#111722]/80
                p-6
                shadow-[0_24px_80px_rgba(0,0,0,0.38)]
                backdrop-blur-xl
                md:p-7
              "
            >

              {/* Subtle panel lighting */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.035] via-transparent to-route/[0.025]" />

              {/* Header */}
              <div className="relative flex items-start justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />

                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                      Live Hospital Intelligence
                    </p>

                  </div>

                  <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-white">
                    AI Recommendation
                  </h2>

                </div>

                <span className="rounded-full border border-green-400/15 bg-green-400/[0.06] px-2.5 py-1 text-[10px] font-medium text-green-300/70">
                  LIVE
                </span>

              </div>

              {/* Hospital metrics */}
              <div className="relative mt-8 space-y-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-white/40">
                    Hospitals Checked
                  </span>

                  <span className="font-semibold text-white">
                    18
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-sm text-white/40">
                    KTAS Severity
                  </span>

                  <span className="text-sm font-semibold text-route">
                    Level 2 • Emergent
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-sm text-white/40">
                    Predicted ETA
                  </span>

                  <span className="font-semibold text-white">
                    11 min
                  </span>

                </div>

              </div>

              {/* Divider */}
              <div className="relative my-7 h-px bg-white/[0.08]" />

              {/* Recommended hospital */}
              <div className="relative">

                <p className="text-xs text-white/35">
                  Recommended Hospital
                </p>

                <div className="mt-2 flex items-end justify-between gap-4">

                  <div>

                    <h3 className="text-[27px] font-semibold tracking-tight text-white">
                      PGIMER Chandigarh
                    </h3>

                    <p className="mt-1.5 text-sm text-route">
                      Capacity Match • 98%
                    </p>

                  </div>

                  <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-route/15 bg-route/[0.06] text-route sm:flex">

                    <span className="text-lg">
                      ✓
                    </span>

                  </div>

                </div>

              </div>

              {/* Bottom statistics */}
              <div className="relative mt-7 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

                  <p className="text-xs text-white/35">
                    ICU Beds
                  </p>

                  <div className="mt-2 flex items-end justify-between">

                    <span className="text-2xl font-semibold text-white">
                      14
                    </span>

                    <span className="text-[11px] text-green-300/60">
                      Available
                    </span>

                  </div>

                </div>

                <div className="rounded-2xl border border-route/[0.12] bg-route/[0.035] p-4">

                  <p className="text-xs text-white/35">
                    Confidence
                  </p>

                  <div className="mt-2 flex items-end justify-between">

                    <span className="text-2xl font-semibold text-route">
                      96%
                    </span>

                    <span className="text-[11px] text-white/30">
                      High
                    </span>

                  </div>

                </div>

              </div>

              {/* Explanation */}
              <div className="relative mt-5 flex items-center gap-2 text-[11px] text-white/30">

                <span className="h-1.5 w-1.5 rounded-full bg-route/80" />

                <span>
                  Recommendation based on severity, resources and travel time
                </span>

              </div>

            </div>

          </motion.div>

        </div>
      </div>

    </section>
  );
}