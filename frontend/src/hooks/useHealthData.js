import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  normalHealthData,
  deterioratingHealthData,
} from "../mock/healthData";

export default function useHealthData() {
  const { user } = useAuth() || {};

  const [stage, setStage] = useState("normal");
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadHealthData() {
      if (!user?.uid) {
        setHealthData(null);
        setLoading(false);
        return;
      }

      try {
        // --------------------------------------------------
        // Get LIVE wearable reading first
        // --------------------------------------------------

        const latestResponse = await api.get(
          `/vitals/latest/${user.uid}`
        );

        if (
          !cancelled &&
          latestResponse.data
        ) {
          setHealthData([latestResponse.data]);
          setStage("real");
        }

      } catch (latestError) {

        console.error(
          "Live wearable reading unavailable:",
          latestError
        );

        // --------------------------------------------------
        // Fallback to recorded history
        // --------------------------------------------------

        try {
          const historyResponse = await api.get(
            `/vitals/history/${user.uid}`,
            {
              params: { limit: 100 },
            }
          );

          if (
            !cancelled &&
            Array.isArray(historyResponse.data) &&
            historyResponse.data.length > 0
          ) {
            const readings = [
              ...historyResponse.data
            ].reverse();

            setHealthData(readings);
            setStage("real");
          } else if (!cancelled) {
            setHealthData(null);
          }

        } catch (historyError) {

          console.error(
            "Failed to load patient vitals:",
            historyError
          );

          if (!cancelled) {
            setHealthData(null);
          }
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHealthData();

    return () => {
      cancelled = true;
    };

  }, [user?.uid]);


  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const data =
    stage === "real"
      ? healthData
      : stage === "deteriorating"
        ? deterioratingHealthData
        : normalHealthData;


  const latest =
    data?.[data.length - 1] ?? null;


  // --------------------------------------------------
  // RISK
  // --------------------------------------------------

  let risk;


  if (
    stage === "real" &&
    latest
  ) {

    risk = {
      score: 0,
      label: "Monitoring",
      reasons: [
        "Based on your latest recorded vitals.",
      ],
    };

  } else if (
    stage === "deteriorating"
  ) {

    risk = {
      score: 0.78,
      label: "Deteriorating",
      reasons: [
        "Heart rate is trending upward.",
        "SpO₂ is trending downward.",
      ],
    };

  } else {

    risk = {
      score: 0.12,
      label: "Normal",
      reasons: [
        "Vitals are currently within the demo normal range.",
      ],
    };
  }


  // --------------------------------------------------
  // RETURN
  // --------------------------------------------------

  return {
    stage,
    setStage,
    data,
    latest,
    risk,
    loading,
    usingRealData: stage === "real",
  };
}