import { NavLink, Link } from "react-router-dom";
import {
  LayoutGrid,
  HeartPulse,
  TrendingUp,
  ClipboardList,
  Bell,
  Video,
  User,
} from "lucide-react";
import EmergencyAssistance from "./EmergencyAssistance.jsx";

const NAV_ITEMS = [
  { to: "/patient/dashboard", label: "Overview", Icon: LayoutGrid, end: true },
  { to: "/patient/dashboard/health", label: "My Health", Icon: HeartPulse },
  { to: "/patient/dashboard/trends", label: "Health Trends", Icon: TrendingUp },
  { to: "/patient/dashboard/care-plan", label: "My Care Plan", Icon: ClipboardList },
  { to: "/patient/dashboard/alerts", label: "Alerts", Icon: Bell },
  { to: "/patient/dashboard/telemedicine", label: "Telemedicine", Icon: Video },
  { to: "/patient/dashboard/profile", label: "Profile", Icon: User },
];

function NavItem({ to, label, Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-colors duration-200 ${
          isActive
            ? "bg-[#FF5A36]/10 text-[#FF7A5C] border border-[#FF5A36]/20"
            : "text-white/50 hover:text-white/85 hover:bg-white/[0.04] border border-transparent"
        }`
      }
    >
      <Icon size={17} strokeWidth={1.75} />
      {label}
    </NavLink>
  );
}

export default function PortalSidebar() {
  return (
    <>
      {/* desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 shrink-0 border-r border-white/[0.08] bg-[#0D1016] min-h-screen sticky top-0">

        {/* clickable LifeRoute logo */}
        <div className="px-5 pt-6 pb-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 w-fit"
            aria-label="Go to LifeRoute home"
          >
            <svg
              width="22"
              height="22"
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

            <span className="font-display font-semibold text-[15px] text-white tracking-tightest">
              LifeRoute
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="px-3 pb-6 pt-3 border-t border-white/[0.08]">
          <EmergencyAssistance variant="sidebar" />
        </div>
      </aside>

      {/* mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/[0.08] bg-[#0D1016]/95 backdrop-blur-md px-2 py-2 flex items-center justify-between gap-1 overflow-x-auto">
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-medium shrink-0 ${
                isActive ? "text-[#FF7A5C]" : "text-white/45"
              }`
            }
          >
            <item.Icon size={17} strokeWidth={1.75} />
            {item.label.split(" ")[0]}
          </NavLink>
        ))}
      </nav>

      {/* mobile floating emergency access */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <EmergencyAssistance variant="sidebar" />
      </div>
    </>
  );
}