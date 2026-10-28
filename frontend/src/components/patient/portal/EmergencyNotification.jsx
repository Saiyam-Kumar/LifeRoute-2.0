import { useEffect, useState } from "react";

import api from "../../../services/api";
import { getPatientMe } from "../../../services/authService";


export default function EmergencyNotification() {
  const [patient, setPatient] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [patientResponse, emergencyResponse] =
        await Promise.all([
          getPatientMe(),
          api.get("/emergency/my-case"),
        ]);

      setPatient(
        patientResponse?.patient || null
      );

      setEmergency(
        emergencyResponse?.data?.case || null
      );

    } catch (error) {
      /*
       * 404 simply means the patient has no emergency
       * case yet. That is normal.
       */
      if (error?.response?.status === 404) {
        setEmergency(null);
      } else {
        console.error(
          "Emergency notification load error:",
          error
        );
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();

    const interval = window.setInterval(
      loadData,
      5000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, []);


  if (loading) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">
          Emergency Notifications
        </p>

        <p className="text-sm text-white/40 mt-3">
          Checking emergency notification status...
        </p>
      </section>
    );
  }


  const emergencyContactName =
    patient?.emergency_contact_name ||
    "Emergency Contact";

  const emergencyContactPhone =
    patient?.emergency_contact_phone ||
    "";

  const relationship =
    patient?.emergency_contact_relationship ||
    "";


  /*
   * No emergency case yet.
   */
  if (!emergency) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">

        <p className="text-xs uppercase tracking-[0.18em] text-white/40">
          Emergency Notifications
        </p>

        <h2 className="text-xl font-semibold text-white mt-2">
          Emergency Contact
        </h2>

        <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">

          <p className="text-sm font-medium text-white/80">
            {emergencyContactName}
          </p>

          {relationship && (
            <p className="text-xs text-white/40 mt-1">
              {relationship}
            </p>
          )}

          <p className="text-sm text-white/60 mt-3">
            {emergencyContactPhone || "No phone number added"}
          </p>

        </div>

        <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">

          <p className="text-sm font-medium text-white/80">
            Emergency SMS
          </p>

          <p className="text-xs text-white/40 mt-2">
            For KTAS Level 1, 2, or 3 emergencies,
            your emergency contact will be notified
            automatically.
          </p>

        </div>

      </section>
    );
  }


  const ktasLevel =
    emergency?.assessment?.ktas_level;

  const notification =
    emergency?.notification;

  const smsSent =
    notification?.sms_sent === true;

  const smsAttempted =
    notification !== undefined;


  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

        <div>

          <p className="text-xs uppercase tracking-[0.18em] text-white/40">
            Emergency Notifications
          </p>

          <h2 className="text-xl font-semibold text-white mt-2">
            Emergency Alert Status
          </h2>

        </div>


        {ktasLevel && (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-3 text-center">

            <p className="text-xs text-white/40">
              KTAS Level
            </p>

            <p className="text-2xl font-semibold text-white mt-1">
              {ktasLevel}
            </p>

          </div>
        )}

      </div>


      <div className="grid md:grid-cols-2 gap-4 mt-6">

        {/* Hospital notification */}

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">

          <p className="text-xs uppercase tracking-wider text-white/40">
            Hospital
          </p>

          <p className="text-sm font-medium text-white/80 mt-2">
            Hospital dashboard notified
          </p>

          <div className="flex items-center gap-2 mt-3">

            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs text-emerald-400">
              Emergency case sent
            </span>

          </div>

        </div>


        {/* SMS notification */}

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">

          <p className="text-xs uppercase tracking-wider text-white/40">
            Emergency Contact
          </p>

          <p className="text-sm font-medium text-white/80 mt-2">
            {emergencyContactName}
          </p>

          {emergencyContactPhone && (
            <p className="text-xs text-white/40 mt-1">
              {emergencyContactPhone}
            </p>
          )}

          {smsAttempted && smsSent && (
            <div className="flex items-center gap-2 mt-3">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs text-emerald-400">
                SMS sent successfully
              </span>

            </div>
          )}

          {smsAttempted && !smsSent && (
            <div className="flex items-center gap-2 mt-3">

              <span className="h-2 w-2 rounded-full bg-red-400" />

              <span className="text-xs text-red-400">
                SMS could not be sent
              </span>

            </div>
          )}

        </div>

      </div>


      <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">

        <p className="text-sm font-medium text-white/80">
          Notification policy
        </p>

        <p className="text-xs text-white/40 mt-2">
          LifeRoute automatically sends an emergency
          notification to the patient's emergency contact
          for KTAS Level 1, 2, or 3 cases.
        </p>

      </div>

    </section>
  );
}