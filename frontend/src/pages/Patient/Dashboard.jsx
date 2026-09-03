import AIHealthStatus from "../../components/patient/portal/AIHealthStatus";
import VitalsGrid from "../../components/patient/portal/VitalsGrid";
import HealthTrendsPreview from "../../components/patient/portal/HealthTrendsPreview";
import CarePlanPreview from "../../components/patient/portal/CarePlanPreview";
import EmergencyAssistance from "../../components/patient/portal/EmergencyAssistance";
import useHealthData from "../../hooks/useHealthData";

function Dashboard() {
  const healthData = useHealthData();

  return (
    <div className="space-y-6">
      <AIHealthStatus {...healthData} />

      <VitalsGrid {...healthData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthTrendsPreview />
        <CarePlanPreview />
      </div>

      <EmergencyAssistance variant="card" />
    </div>
  );
}

export default Dashboard;
