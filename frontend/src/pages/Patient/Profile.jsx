import { useEffect, useState } from "react";
import api from "../../services/api";


const initialProfile = {
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address: "",
    blood_group: "",

    medical_conditions: [],
    medical_history: "",
    allergies: [],
    current_medications: [],

    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
};


function Profile() {
    const [profile, setProfile] = useState(initialProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [medicalConditionsText, setMedicalConditionsText] = useState("");
    const [allergiesText, setAllergiesText] = useState("");
    const [medicationsText, setMedicationsText] = useState("");

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await api.get("/patient/me");

                if (response.data?.registered && response.data?.patient) {
                    const patient = response.data.patient;

                    setProfile({
                        ...initialProfile,
                        ...patient,
                    });

                    setMedicalConditionsText(
                        (patient.medical_conditions || []).join(", ")
                    );

                    setAllergiesText(
                        (patient.allergies || []).join(", ")
                    );

                    setMedicationsText(
                        (patient.current_medications || []).join(", ")
                    );
                }
            } catch (err) {
                console.error("Failed to load patient profile:", err);
                setError("Unable to load your profile.");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);


    function handleChange(event) {
        const { name, value } = event.target;

        setProfile((current) => ({
            ...current,
            [name]: value,
        }));

        setMessage("");
        setError("");
    }


    function convertToArray(value) {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }


    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        const updatedProfile = {
            ...profile,
            medical_conditions: convertToArray(medicalConditionsText),
            allergies: convertToArray(allergiesText),
            current_medications: convertToArray(medicationsText),
        };

        try {
            const response = await api.put(
                "/patient/profile",
                updatedProfile
            );

            if (response.data?.patient) {
                setProfile(response.data.patient);

                setMedicalConditionsText(
                    (response.data.patient.medical_conditions || []).join(", ")
                );

                setAllergiesText(
                    (response.data.patient.allergies || []).join(", ")
                );

                setMedicationsText(
                    (response.data.patient.current_medications || []).join(", ")
                );
            }

            setMessage("Profile updated successfully.");
        } catch (err) {
            console.error("Failed to update patient profile:", err);
            setError(
                err.response?.data?.detail ||
                "Unable to update your profile."
            );
        } finally {
            setSaving(false);
        }
    }


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-white/50">
                    Loading your profile...
                </p>
            </div>
        );
    }


    const inputClass =
        "w-full rounded-xl border border-white/[0.08] bg-[#0B0F16] px-4 py-3 text-white outline-none focus:border-white/20";

    const labelClass =
        "block text-sm text-white/60 mb-2";


    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <p className="text-xs uppercase tracking-widest text-white/40">
                    Patient Portal
                </p>

                <h1 className="text-3xl font-semibold text-white mt-2">
                    My Profile
                </h1>

                <p className="text-white/50 mt-2">
                    Keep your personal and medical information up to date.
                </p>
            </div>


            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* Personal Information */}
                <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">

                    <h2 className="text-xl font-semibold text-white">
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                        <div>
                            <label className={labelClass}>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="full_name"
                                value={profile.full_name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={inputClass}
                            />
                        </div>


                        <div>
                            <label className={labelClass}>
                                Date of Birth
                            </label>

                            <input
                                type="date"
                                name="date_of_birth"
                                value={profile.date_of_birth}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>


                        <div>
                            <label className={labelClass}>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">
                                    Select gender
                                </option>

                                <option value="female">
                                    Female
                                </option>

                                <option value="male">
                                    Male
                                </option>

                                <option value="other">
                                    Other
                                </option>

                                <option value="prefer_not_to_say">
                                    Prefer not to say
                                </option>
                            </select>
                        </div>


                        <div>
                            <label className={labelClass}>
                                Blood Group
                            </label>

                            <select
                                name="blood_group"
                                value={profile.blood_group}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">
                                    Select blood group
                                </option>

                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>


                        <div>
                            <label className={labelClass}>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className={inputClass}
                            />
                        </div>


                        <div className="md:col-span-2">
                            <label className={labelClass}>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                rows={3}
                                className={inputClass}
                            />
                        </div>

                    </div>
                </section>


                {/* Medical Information */}
                <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">

                    <h2 className="text-xl font-semibold text-white">
                        Medical Information
                    </h2>

                    <p className="text-sm text-white/40 mt-2">
                        This information can help medical teams understand
                        your condition during an emergency.
                    </p>


                    <div className="space-y-5 mt-6">

                        <div>
                            <label className={labelClass}>
                                Existing Medical Conditions
                            </label>

                            <input
                                type="text"
                                value={medicalConditionsText}
                                onChange={(event) =>
                                    setMedicalConditionsText(event.target.value)
                                }
                                placeholder="Example: Asthma, Diabetes"
                                className={inputClass}
                            />

                            <p className="text-xs text-white/30 mt-2">
                                Separate multiple conditions with commas.
                            </p>
                        </div>


                        <div>
                            <label className={labelClass}>
                                Important Medical History
                            </label>

                            <textarea
                                name="medical_history"
                                value={profile.medical_history}
                                onChange={handleChange}
                                placeholder="Previous surgeries, major illnesses, hospitalizations, etc."
                                rows={4}
                                className={inputClass}
                            />
                        </div>


                        <div>
                            <label className={labelClass}>
                                Allergies
                            </label>

                            <input
                                type="text"
                                value={allergiesText}
                                onChange={(event) =>
                                    setAllergiesText(event.target.value)
                                }
                                placeholder="Example: Penicillin, Peanuts"
                                className={inputClass}
                            />

                            <p className="text-xs text-white/30 mt-2">
                                Separate multiple allergies with commas.
                            </p>
                        </div>


                        <div>
                            <label className={labelClass}>
                                Current Medications
                            </label>

                            <input
                                type="text"
                                value={medicationsText}
                                onChange={(event) =>
                                    setMedicationsText(event.target.value)
                                }
                                placeholder="Example: Metformin, Inhaler"
                                className={inputClass}
                            />

                            <p className="text-xs text-white/30 mt-2">
                                Separate multiple medications with commas.
                            </p>
                        </div>

                    </div>
                </section>


                {/* Emergency Contact */}
                <section className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-6">

                    <h2 className="text-xl font-semibold text-white">
                        Emergency Contact
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                        <div>
                            <label className={labelClass}>
                                Contact Name
                            </label>

                            <input
                                type="text"
                                name="emergency_contact_name"
                                value={profile.emergency_contact_name}
                                onChange={handleChange}
                                placeholder="Emergency contact name"
                                className={inputClass}
                            />
                        </div>


                        <div>
                            <label className={labelClass}>
                                Relationship
                            </label>

                            <input
                                type="text"
                                name="emergency_contact_relationship"
                                value={profile.emergency_contact_relationship}
                                onChange={handleChange}
                                placeholder="Example: Parent, Spouse, Sibling"
                                className={inputClass}
                            />
                        </div>


                        <div>
                            <label className={labelClass}>
                                Contact Phone
                            </label>

                            <input
                                type="tel"
                                name="emergency_contact_phone"
                                value={profile.emergency_contact_phone}
                                onChange={handleChange}
                                placeholder="Emergency contact phone"
                                className={inputClass}
                            />
                        </div>

                    </div>
                </section>


                {/* Status */}
                {message && (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}


                {/* Save */}
                <div className="flex justify-end">

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Profile"}
                    </button>

                </div>

            </form>
        </div>
    );
}


export default Profile;