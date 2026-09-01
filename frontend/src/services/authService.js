import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import { auth } from "../firebase";

const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


// ============================================================
// FIREBASE AUTHENTICATION
// ============================================================

export const register = async (email, password) => {
    const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    return result.user;
};

export const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    return result.user;
};

export const logout = async () => {
    await signOut(auth);
};

export const getCurrentUser = () => {
    return auth.currentUser;
};


// ============================================================
// FIREBASE TOKEN
// ============================================================

export const getIdToken = async () => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User is not authenticated.");
    }

    const token = await user.getIdToken(true);

    // TEMPORARY: used only for local testing
    console.log("TOKEN:", token);

    if (!token) {
        throw new Error(
            "Firebase did not return an ID token."
        );
    }

    console.log(
        "Authenticated Firebase user:",
        user.email
    );

    console.log(
        "Firebase UID:",
        user.uid
    );

    console.log(
        "Firebase ID token obtained successfully."
    );

    return token;
};


// ============================================================
// GENERIC LIFEROUTE PROFILE
// ============================================================

export const getMe = async () => {
    const token = await getIdToken();

    const response = await fetch(
        `${API_URL}/auth/me`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const responseText = await response.text();

    if (!response.ok) {
        console.error(
            "Backend /auth/me failed:",
            response.status,
            responseText
        );

        throw new Error(
            `Backend authentication failed (${response.status}): ${responseText}`
        );
    }

    try {
        return JSON.parse(responseText);
    } catch {
        throw new Error(
            "Backend returned invalid JSON."
        );
    }
};


// ============================================================
// PATIENT REGISTRATION
// ============================================================

export const registerPatient = async () => {
    const token = await getIdToken();

    const response = await fetch(
        `${API_URL}/patient/register`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const responseText = await response.text();

    if (!response.ok) {
        console.error(
            "Patient registration failed:",
            response.status,
            responseText
        );

        throw new Error(
            `Patient registration failed (${response.status}): ${responseText}`
        );
    }

    try {
        return JSON.parse(responseText);
    } catch {
        throw new Error(
            "Backend returned invalid JSON."
        );
    }
};


// ============================================================
// CURRENT PATIENT
// ============================================================

export const getPatientMe = async () => {
    const token = await getIdToken();

    const response = await fetch(
        `${API_URL}/patient/me`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const responseText = await response.text();

    if (!response.ok) {
        console.error(
            "Patient profile request failed:",
            response.status,
            responseText
        );

        throw new Error(
            `Patient profile request failed (${response.status}): ${responseText}`
        );
    }

    try {
        return JSON.parse(responseText);
    } catch {
        throw new Error(
            "Backend returned invalid JSON."
        );
    }
};


// ============================================================
// TEMPORARY VITAL TEST
// ============================================================

export const sendTestVital = async () => {
    const token = await getIdToken();

    const response = await fetch(
        `${API_URL}/vitals/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                patient_id: auth.currentUser.uid,
                device_id: "DEMO-DEVICE-001",
                timestamp: new Date().toISOString(),
                heart_rate: 82,
                spo2: 98,
                temperature: 36.7,
                activity: 0.4,
            }),
        }
    );

    const data = await response.json();

    console.log(
        "VITAL RESPONSE:",
        response.status,
        data
    );

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to send vital reading."
        );
    }

    return data;
};


// ============================================================
// TEMPORARY BROWSER TEST ACCESS
// ============================================================

// Allows us to call sendTestVital() from the browser console.
// REMOVE THIS AFTER TESTING.
window.sendTestVital = sendTestVital;