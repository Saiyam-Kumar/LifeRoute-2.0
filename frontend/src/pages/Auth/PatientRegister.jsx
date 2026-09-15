import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    UserPlus,
    ArrowRight,
} from "lucide-react";

import {
    register,
    registerPatient,
} from "../../services/authService";


function PatientRegister() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // -----------------------------
        // Basic validation
        // -----------------------------

        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }


        try {
            setLoading(true);

            // -----------------------------------------
            // STEP 1
            // Create Firebase authentication account
            // -----------------------------------------

            const firebaseUser = await register(
                email,
                password
            );

            console.log(
                "Patient Firebase account created:",
                firebaseUser.uid
            );


            // -----------------------------------------
            // STEP 2
            // Create LifeRoute patient record
            // -----------------------------------------

            const patientResult = await registerPatient();

            console.log(
                "LifeRoute patient created:",
                patientResult
            );


            // -----------------------------------------
            // STEP 3
            // Continue to patient dashboard
            // -----------------------------------------

            navigate("/patient/dashboard");

        } catch (err) {
            console.error(
                "Patient registration error:",
                err
            );


            // Firebase errors
            if (
                err.code ===
                "auth/email-already-in-use"
            ) {
                setError(
                    "An account with this email already exists."
                );

            } else if (
                err.code ===
                "auth/invalid-email"
            ) {
                setError(
                    "Please enter a valid email address."
                );

            } else if (
                err.code ===
                "auth/weak-password"
            ) {
                setError(
                    "Password is too weak."
                );

            } else {
                setError(
                    err.message ||
                    "Unable to create patient account."
                );
            }

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center px-6 py-12">

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.5,
                }}
                className="w-full max-w-md"
            >

                <div className="bg-[#15161c] border border-white/10 rounded-3xl p-8 shadow-2xl">

                    {/* Header */}

                    <div className="mb-8">

                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-5">

                            <UserPlus
                                className="text-orange-400"
                                size={24}
                            />

                        </div>


                        <h1 className="text-3xl font-bold">
                            Create your account
                        </h1>


                        <p className="text-gray-400 mt-2">
                            Create a LifeRoute patient account
                            to access your healthcare portal.
                        </p>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}

                        <div>

                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>


                            <div className="relative">

                                <Mail
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />


                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-[#202126] border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-orange-500 transition"
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div>

                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>


                            <div className="relative">

                                <Lock
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />


                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Create a password"
                                    required
                                    className="w-full bg-[#202126] border border-white/10 rounded-xl py-4 pl-12 pr-12 outline-none focus:border-orange-500 transition"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >

                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* Confirm Password */}

                        <div>

                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>


                            <div className="relative">

                                <Lock
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />


                                <input
                                    type={
                                        showConfirm
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Confirm your password"
                                    required
                                    className="w-full bg-[#202126] border border-white/10 rounded-xl py-4 pl-12 pr-12 outline-none focus:border-orange-500 transition"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirm(
                                            !showConfirm
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >

                                    {showConfirm ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition"
                        >

                            {loading ? (
                                "Creating account..."
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={19} />
                                </>
                            )}

                        </button>

                    </form>


                    {/* Login */}

                    <div className="mt-7 text-center text-sm text-gray-400">

                        Already have an account?{" "}

                        <Link
                            to="/patient/login"
                            className="text-orange-400 hover:text-orange-300 font-semibold"
                        >
                            Sign in
                        </Link>

                    </div>

                </div>

            </motion.div>

        </div>
    );
}


export default PatientRegister;