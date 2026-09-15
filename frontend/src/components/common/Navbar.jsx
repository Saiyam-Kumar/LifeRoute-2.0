import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#how-it-works" },
  { label: "Team", href: "#team" },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5 shrink-0">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="4" cy="21" r="2.5" fill="#FFFFFF" />

        <circle cx="22" cy="5" r="2.5" fill="#FF5A36" />

        <path
          d="M5.5 19.5C11 12 13 12 20 6.5"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="1 4.2"
        />
      </svg>

      <span className="font-display font-semibold text-[17px] tracking-tightest text-white">
        LifeRoute
      </span>
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const goToPatientPortal = () => {
    setOpen(false);
    navigate("/patient/login");
  };

  const goToAssessment = () => {
    setOpen(false);
    navigate("/patient/assessment");
  };

  const goToHospitalLogin = () => {
    setOpen(false);
    navigate("/hospital/login");
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed top-0 inset-x-0 z-[999] bg-[#0B0D12] border-b border-white/10 shadow-lg"
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-[72px]">
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Patient Portal */}
          <button
            onClick={goToPatientPortal}
            className="text-[14px] font-medium text-white/70 hover:text-white transition-colors"
          >
            Patient Portal
          </button>

          {/* Hospital Portal */}
          <button
            onClick={goToHospitalLogin}
            className="text-[14px] font-medium text-white/70 hover:text-white transition-colors"
          >
            Hospital Portal
          </button>
        </div>

        {/* Emergency Assessment */}
        <div className="hidden md:block">
          <Button
            variant="primary"
            icon={false}
            onClick={goToAssessment}
            className="!px-5 !py-2.5 !text-[13.5px]"
          >
            Emergency Assessment
          </Button>
        </div>

        {/* Mobile menu */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="md:hidden bg-[#0B0D12] border-t border-white/10 px-6 py-5 flex flex-col gap-4"
        >
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[15px] font-medium text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Patient Portal */}
          <button
            onClick={goToPatientPortal}
            className="text-left text-[15px] font-medium text-white/70 hover:text-white transition-colors"
          >
            Patient Portal
          </button>

          {/* Hospital Portal */}
          <button
            onClick={goToHospitalLogin}
            className="text-left text-[15px] font-medium text-white/70 hover:text-white transition-colors"
          >
            Hospital Portal
          </button>

          <Button
            variant="primary"
            icon={false}
            onClick={goToAssessment}
            className="!py-3 justify-center mt-1"
          >
            Emergency Assessment
          </Button>
        </motion.div>
      )}
    </motion.header>
  );
}