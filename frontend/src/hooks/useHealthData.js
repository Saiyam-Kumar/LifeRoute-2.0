import { useState } from "react";
import {
  normalHealthData,
  deterioratingHealthData,
} from "../mock/healthData";

export default function useHealthData() {
  const [stage, setStage] = useState("normal");

  let data;
  let latest;
  let risk;

  if (stage === "normal") {
    data = normalHealthData;
    latest = data[data.length - 1];

    risk = {
      score: 0.12,
      level: "NORMAL",
      reasons: [],
    };
  } else if (stage === "deteriorating") {
    data = deterioratingHealthData.slice(0, 3);
    latest = data[data.length - 1];

    risk = {
      score: 0.58,
      level: "HIGH",
      reasons: [
        "Heart rate is increasing",
        "SpO₂ is beginning to decline",
        "Temperature is increasing",
      ],
    };
  } else {
    data = deterioratingHealthData;
    latest = data[data.length - 1];

    risk = {
      score: 0.90,
      level: "CRITICAL",
      reasons: [
        "SpO₂ is critically low",
        "SpO₂ is declining",
        "Heart rate is elevated",
        "Heart rate is increasing",
        "Activity level is unusually low",
      ],
    };
  }

  return {
    data,
    latest,
    stage,
    setStage,
    risk,
    loading: false,
    error: null,
  };
}