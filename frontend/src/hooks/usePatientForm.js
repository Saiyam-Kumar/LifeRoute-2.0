import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { initialPatientForm } from "../models/patientForm";
import { validatePatientForm } from "../utils/validation";
import { runPrediction } from "../utils/predictionWorkflow";
import { getCurrentLocation } from "../services/locationService";
import { getPatientMe } from "../services/authService";
import api from "../services/api";

import usePrediction from "./usePrediction";


const WEARABLE_REFRESH_INTERVAL = 5000;

// A reading older than this is not treated as live.
const WEARABLE_MAX_AGE_MS = 30000;


const usePatientForm = () => {
  const navigate = useNavigate();

  const { setPrediction, setLoading } = usePrediction();

  const [formData, setFormData] = useState(initialPatientForm);

  const [errors, setErrors] = useState({});

  const [patientProfile, setPatientProfile] = useState(null);

  const [profileLoading, setProfileLoading] = useState(true);

  const [wearableVitals, setWearableVitals] = useState(null);


  // --------------------------------------------------
  // Load latest wearable vitals
  // --------------------------------------------------

  const loadLatestWearableVitals = async (
    patientId,
    cancelledRef
  ) => {
    try {
      const response = await api.get(
        `/vitals/latest/${patientId}`
      );

      if (cancelledRef.cancelled) {
        return;
      }

      const latestVitals = response?.data;

      if (!latestVitals) {
        setWearableVitals(null);
        return;
      }


      // ------------------------------------------------
      // Check reading freshness
      // ------------------------------------------------

      let recordedAt = null;

      // Live wearable readings use updated_at.
      // Firestore/history readings use recorded_at.
      const timestamp =
        latestVitals.updated_at ||
        latestVitals.recorded_at;

      if (timestamp) {
        const parsedDate = new Date(timestamp);

        if (!Number.isNaN(parsedDate.getTime())) {
          recordedAt = parsedDate;
        }
      }

      if (!recordedAt) {
        setWearableVitals(null);
        return;
      }


      const ageMs =
        Date.now() - recordedAt.getTime();


      /*
       * If the wearable hasn't sent a reading recently,
       * don't call it live.
       */

      if (
        ageMs < 0 ||
        ageMs > WEARABLE_MAX_AGE_MS
      ) {
        setWearableVitals(null);
        return;
      }


      // ------------------------------------------------
      // Validate individual vital values
      // ------------------------------------------------

      const heartRate = Number(
        latestVitals.heart_rate
      );

      const spo2 = Number(
        latestVitals.spo2
      );

      // ESP32 sends temperature in Fahrenheit.
      const temperature = Number(latestVitals.temperature);
      const validTemperature =
        Number.isFinite(temperature) &&
        temperature >= 80 &&
        temperature <= 115;

      const validHeartRate =
        Number.isFinite(heartRate) &&
        heartRate >= 30 &&
        heartRate <= 250;


      /*
       * Current MAX30102 readings may be unavailable.
       * Only accept SpO2 values in a reasonable range.
       */

      const validSpO2 =
        Number.isFinite(spo2) &&
        spo2 >= 70 &&
        spo2 <= 100;


      const usableVitals = {
        heart_rate:
          validHeartRate
            ? heartRate
            : null,

        spo2:
          validSpO2
            ? spo2
            : null,

        activity:
          latestVitals.activity ?? null,

        temperature:
          validTemperature ? temperature : null,

        recorded_at:
          recordedAt.toISOString(),

        updated_at:
          latestVitals.updated_at ?? latestVitals.recorded_at ?? null,

        device_id:
          latestVitals.device_id ?? null,
      };


      // ------------------------------------------------
      // A wearable reading exists if the backend has
      // sent a recent reading.
      //
      // Do NOT require HR or SpO2 to be valid here.
      // This allows the UI to recognize the wearable
      // even while the sensor is returning 0.
      // ------------------------------------------------

      if (
        usableVitals.heart_rate === null &&
        usableVitals.spo2 === null &&
        usableVitals.activity === null &&
        usableVitals.temperature === null
      ) {
        setWearableVitals(null);
        return;
      }


      // ------------------------------------------------
      // Update wearable state
      // ------------------------------------------------

      setWearableVitals(
        usableVitals
      );


      // ------------------------------------------------
      // Put wearable values into existing AI fields
      // ------------------------------------------------

      setFormData((current) => ({
        ...current,

        ...(usableVitals.heart_rate !== null
          ? {
              hr:
                usableVitals.heart_rate,
            }
          : {}),

        ...(usableVitals.spo2 !== null
          ? {
              saturation:
                usableVitals.spo2,
              saturation_missing: 0,
            }
          : {}),

        ...(usableVitals.temperature !== null
          ? { bt: usableVitals.temperature }
          : {}),
      }));

    } catch (error) {
      /*
       * Wearable data is optional.
       * Emergency assessment must continue working
       * even if the wearable cannot be reached.
       */

      console.warn(
        "Unable to refresh wearable vitals:",
        error
      );

      if (!cancelledRef.cancelled) {
        setWearableVitals(null);
      }
    }
  };


  // --------------------------------------------------
  // Load saved patient profile
  // --------------------------------------------------

  useEffect(() => {
    const cancelledRef = {
      cancelled: false,
    };

    let wearableInterval = null;


    const loadPatientProfile = async () => {
      try {
        const response =
          await getPatientMe();


        if (
          cancelledRef.cancelled
        ) {
          return;
        }


        if (
          response?.registered &&
          response?.patient
        ) {
          const patient =
            response.patient;


          setPatientProfile(
            patient
          );


          // --------------------------------------------
          // Map gender
          // --------------------------------------------

          let sex = "";


          if (
            patient.gender ===
            "female"
          ) {
            sex = 1;

          } else if (
            patient.gender ===
            "male"
          ) {
            sex = 2;
          }


          // --------------------------------------------
          // Calculate age
          // --------------------------------------------

          let age = "";


          if (
            patient.date_of_birth
          ) {
            const birthDate =
              new Date(
                patient.date_of_birth
              );


            if (
              !Number.isNaN(
                birthDate.getTime()
              )
            ) {
              const today =
                new Date();


              age =
                today.getFullYear() -
                birthDate.getFullYear();


              const monthDifference =
                today.getMonth() -
                birthDate.getMonth();


              if (
                monthDifference < 0 ||
                (
                  monthDifference === 0 &&
                  today.getDate() <
                    birthDate.getDate()
                )
              ) {
                age -= 1;
              }


              if (
                age < 0 ||
                age > 120
              ) {
                age = "";
              }
            }
          }


          // --------------------------------------------
          // Apply profile information
          // --------------------------------------------

          setFormData(
            (current) => ({
              ...current,

              ...(sex !== ""
                ? { sex }
                : {}),

              ...(age !== ""
                ? { age }
                : {}),
            })
          );


          // --------------------------------------------
          // Initial wearable reading
          // --------------------------------------------

          await loadLatestWearableVitals(
            patient.uid,
            cancelledRef
          );


          // --------------------------------------------
          // Refresh wearable every 5 seconds
          // --------------------------------------------

          wearableInterval =
            window.setInterval(
              () => {
                loadLatestWearableVitals(
                  patient.uid,
                  cancelledRef
                );
              },
              WEARABLE_REFRESH_INTERVAL
            );
        }

      } catch (error) {
        console.error(
          "Failed to load patient profile:",
          error
        );

      } finally {
        if (
          !cancelledRef.cancelled
        ) {
          setProfileLoading(false);
        }
      }
    };


    loadPatientProfile();


    return () => {
      cancelledRef.cancelled = true;

      if (wearableInterval) {
        window.clearInterval(
          wearableInterval
        );
      }
    };

  }, []);


  // --------------------------------------------------
  // Handle input changes
  // --------------------------------------------------

  const handleChange = (
    field,
    value
  ) => {
    setFormData(
      (prev) => ({
        ...prev,
        [field]: value,
      })
    );
  };


  // --------------------------------------------------
  // Detect current location
  // --------------------------------------------------

  const detectLocation =
    async () => {
      try {
        const location =
          await getCurrentLocation();


        setFormData(
          (prev) => ({
            ...prev,

            latitude:
              location.latitude,

            longitude:
              location.longitude,
          })
        );


        return location;

      } catch (error) {
        console.error(
          "Location Error:",
          error
        );

        throw error;
      }
    };


  // --------------------------------------------------
  // Submit assessment
  // --------------------------------------------------

  const submitForm =
    async () => {
      let location;


      // ----------------------------------------------
      // Get location once
      // ----------------------------------------------

      try {
        location =
          await getCurrentLocation();

      } catch (error) {
        console.error(
          "Location Error:",
          error
        );


        setErrors({
          location:
            "Unable to access your current location. Please allow location access and try again.",
        });


        return;
      }


      // ----------------------------------------------
      // Build final assessment data
      // ----------------------------------------------

      const updatedFormData = {
        ...formData,

        latitude:
          location.latitude,

        longitude:
          location.longitude,
      };


      // ----------------------------------------------
      // Add patient profile
      // ----------------------------------------------

      if (patientProfile) {
        updatedFormData.patient_profile = {
          full_name:
            patientProfile.full_name ||
            "",

          date_of_birth:
            patientProfile.date_of_birth ||
            "",

          gender:
            patientProfile.gender ||
            "",

          phone:
            patientProfile.phone ||
            "",

          address:
            patientProfile.address ||
            "",

          blood_group:
            patientProfile.blood_group ||
            "",

          medical_conditions:
            patientProfile.medical_conditions ||
            [],

          medical_history:
            patientProfile.medical_history ||
            "",

          allergies:
            patientProfile.allergies ||
            [],

          current_medications:
            patientProfile.current_medications ||
            [],

          emergency_contact_name:
            patientProfile.emergency_contact_name ||
            "",

          emergency_contact_phone:
            patientProfile.emergency_contact_phone ||
            "",

          emergency_contact_relationship:
            patientProfile.emergency_contact_relationship ||
            "",
        };
      }


      // ----------------------------------------------
      // Add wearable context
      // ----------------------------------------------

      if (wearableVitals) {
        updatedFormData.wearable_vitals = {
          heart_rate:
            wearableVitals.heart_rate,

          spo2:
            wearableVitals.spo2,

          activity:
            wearableVitals.activity,

          temperature:
            wearableVitals.temperature,

          recorded_at:
            wearableVitals.recorded_at,

          device_id:
            wearableVitals.device_id,
        };
      }


      console.log(
        "Final assessment data:",
        updatedFormData
      );


      // ----------------------------------------------
      // Validate
      // ----------------------------------------------

      const validationErrors =
        validatePatientForm(
          updatedFormData
        );


      if (
        Object.keys(
          validationErrors
        ).length > 0
      ) {
        console.log(
          "Validation errors:",
          validationErrors
        );

        setErrors(
          validationErrors
        );

        return;
      }


      setErrors({});


      // ----------------------------------------------
      // Run prediction
      // ----------------------------------------------

      try {
        setLoading(true);

        navigate(
          "/patient/loading"
        );


        const result =
          await runPrediction(
            updatedFormData,
            setPrediction,
            setLoading
          );


        // --------------------------------------------
        // Create emergency case
        // --------------------------------------------

        if (result) {
          try {
            const emergencyResponse =
              await api.post(
                "/emergency/cases",
                {
                  patient_data:
                    updatedFormData,

                  prediction:
                    result,
                }
              );

            console.log(
              "Emergency case created:",
              emergencyResponse.data
            );

          } catch (emergencyError) {
            /*
             * The AI recommendation is still valid.
             * Do not send the patient back to assessment
             * if emergency case creation fails.
             */

            console.error(
              "Emergency case creation failed:",
              emergencyError
            );
          }


          navigate(
            "/patient/results"
          );
        }

      } catch (error) {
        console.error(
          "Prediction Error:",
          error
        );


        setLoading(false);

        navigate(
          "/patient/assessment"
        );
      }
    };


  return {
    formData,
    errors,
    handleChange,
    detectLocation,
    submitForm,

    patientProfile,
    profileLoading,

    wearableVitals,
  };
};


export default usePatientForm;