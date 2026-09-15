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
        const response = await api.get(`/vitals/history/${user.uid}`, {
          params: { limit: 100 },
        });

        if (
          !cancelled &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const readings = [...response.data].reverse();

          setHealthData(readings);
          setStage("real");
        }
      } catch (error) {
        console.error("Failed to load patient vitals:", error);

        if (!cancelled) {
          setHealthData(null);
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

  const data =
    stage === "real"
      ? healthData
      : stage === "deteriorating"
        ? deterioratingHealthData
        : normalHealthData;

  const latest = data?.[data.length - 1] ?? null;

  let risk;

  if (stage === "real" && latest) {
    risk = {
      score: 0,
      label: "Monitoring",
      reasons: ["Based on your latest recorded vitals."],
    };
  } else if (stage === "deteriorating") {
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
      reasons: ["Vitals are currently within the demo normal range."],
    };
  }

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