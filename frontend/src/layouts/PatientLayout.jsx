import { Outlet } from "react-router-dom";
import PortalSidebar from "../components/patient/portal/PortalSidebar";
import PortalHeader from "../components/patient/portal/PortalHeader";

function PatientLayout() {
  return (
    <div className="min-h-screen bg-[#0B0D12] flex">
      <PortalSidebar />

      <div className="flex-1 min-w-0 pb-24 md:pb-0">
        <PortalHeader />

        <main className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PatientLayout;