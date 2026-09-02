import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  BarChart3,
  Building2,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/hospital/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Patients",
    path: "/hospital/patients",
    icon: Users,
  },
  {
    label: "Resources",
    path: "/hospital/resources",
    icon: BedDouble,
  },
  {
    label: "Analytics",
    path: "/hospital/analytics",
    icon: BarChart3,
  },
  {
    label: "Hospital Profile",
    path: "/hospital/profile",
    icon: Building2,
  },
];

function LifeRouteLogo({ mobile = false }) {
  return (
    <svg
      width={mobile ? 28 : 32}
      height={mobile ? 28 : 32}
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="4"
        cy="21"
        r="2.5"
        fill="#FFFFFF"
      />

      <circle
        cx="22"
        cy="5"
        r="2.5"
        fill="#FF5A36"
      />

      <path
        d="M5.5 19.5C11 12 13 12 20 6.5"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="1 4.2"
      />
    </svg>
  );
}

export default function HospitalLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-white">

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#0B0D12]/90 px-5 backdrop-blur-xl lg:hidden">

        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Go to LifeRoute home"
        >
          <LifeRouteLogo mobile />

          <div>
            <p className="font-display text-sm font-semibold">
              LifeRoute
            </p>

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
              Hospital Portal
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition hover:bg-white/[0.07] hover:text-white"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </header>


      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-[#0B0D12] pt-20 lg:hidden">

          <nav className="px-5 py-6">

            <div className="space-y-2">

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition-all",
                        isActive
                          ? "border border-[#FF5A36]/20 bg-[#FF5A36]/[0.08] text-white"
                          : "border border-transparent text-white/45 hover:bg-white/[0.04] hover:text-white",
                      ].join(" ")
                    }
                  >
                    <Icon size={18} strokeWidth={1.7} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

            </div>

          </nav>

        </div>
      )}


      {/* Main layout */}
      <div className="flex min-h-screen">

        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] border-r border-white/[0.08] bg-[#0D1016] lg:flex lg:flex-col">

          {/* Logo */}
          <div className="flex h-[82px] items-center border-b border-white/[0.07] px-6">

            <Link
              to="/"
              className="flex items-center gap-3"
              aria-label="Go to LifeRoute home"
            >
              <LifeRouteLogo />

              <div>
                <p className="font-display text-[16px] font-semibold tracking-tight text-white">
                  LifeRoute
                </p>

                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                  Hospital Portal
                </p>
              </div>
            </Link>

          </div>


          {/* Navigation */}
          <div className="flex-1 px-4 py-7">

            <p className="mb-3 px-3 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
              Portal
            </p>

            <nav className="space-y-1.5">

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      [
                        "group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-all duration-200",
                        isActive
                          ? "bg-[#FF5A36]/[0.09] text-white"
                          : "text-white/40 hover:bg-white/[0.035] hover:text-white/80",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-[#FF5A36]" />
                        )}

                        <Icon
                          size={17}
                          strokeWidth={isActive ? 2 : 1.7}
                          className={
                            isActive
                              ? "text-[#FF5A36]"
                              : "text-white/35 transition-colors group-hover:text-white/60"
                          }
                        />

                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}

            </nav>

          </div>


          {/* Bottom status */}
          <div className="border-t border-white/[0.07] p-4">

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]" />

                <span className="text-xs font-medium text-white/70">
                  Portal Active
                </span>

              </div>

              <p className="mt-2 text-[11px] leading-5 text-white/30">
                Hospital information is connected to the LifeRoute routing
                system.
              </p>

            </div>

            <button
              type="button"
              className="mt-3 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/35 transition hover:bg-white/[0.035] hover:text-white/70"
            >
              <LogOut size={17} strokeWidth={1.7} />
              <span>Sign out</span>
            </button>

          </div>

        </aside>


        {/* Main content */}
        <main className="min-w-0 flex-1 pt-16 lg:ml-[250px] lg:pt-0">
          <Outlet />
        </main>

      </div>

    </div>
  );
}